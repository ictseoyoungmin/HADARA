import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { HadaraPaths } from '../core/paths';
import { assertSchema } from '../core/schema';
import { startMonotonicTimer } from '../core/timing';
import { attachReducedSmokeEvidence } from './smoke-evidence';

export interface PackageRecycleIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  stepId?: string;
}

export interface PackageRecycleStep {
  id: string;
  label: string;
  command?: string;
  status: 'planned' | 'passed' | 'failed' | 'skipped';
  exitCode?: number | null;
  elapsedMs?: number;
  summary: string;
}

export interface PackageRecycleReport {
  schemaVersion: 'hadara.packageRecycle.v1';
  command: 'package.recycle';
  ok: boolean;
  taskId?: string;
  mode: 'dry-run' | 'execute';
  readOnly: boolean;
  package: {
    specifier: string;
    name: string;
    expectedVersion: string | null;
    observedVersion: string | null;
    latestVersion: string | null;
    distTags: Record<string, string>;
  };
  networkPolicy: {
    mode: 'environment-inherited';
    enforced: false;
    notes: string[];
  };
  execution: {
    npmViewExecuted: boolean;
    npmDistTagExecuted: boolean;
    packageInstallExecuted: boolean;
    installedVersionExecuted: boolean;
    commandSurfaceExecuted: boolean;
    lifecycleHelpExecuted: boolean;
    initExecuted: boolean;
    taskStatusExecuted: boolean;
    taskLifecycleExecuted: boolean;
    contextSmokeExecuted: boolean;
    releaseMutationExecuted: false;
    publishExecuted: false;
  };
  workspace: {
    kind: 'disposable';
    displayPath: string;
    pathRedacted: true;
    retention: 'deleted' | 'kept-temporary';
  };
  steps: PackageRecycleStep[];
  artifacts: Array<{
    kind: 'summary' | 'command-log' | 'install-tree';
    visibility: 'public' | 'private' | 'temporary';
    evidencePath?: string;
    relativePath?: string;
    pathRedacted?: true;
    rawContentIncluded: false;
  }>;
  privacy: {
    rawLogsIncluded: false;
    rawPackageContentsIncluded: false;
    privatePathsIncluded: false;
    environmentSecretsIncluded: false;
    privateStorePathsIncluded: false;
  };
  issues: PackageRecycleIssue[];
}

export interface PackageRecycleOptions {
  paths: HadaraPaths;
  execute?: boolean;
  packageSpecifier?: string;
  expectedVersion?: string;
  workspace?: string;
  taskId?: string;
  attachEvidence?: boolean;
  noEvidence?: boolean;
  keepTemp?: boolean;
  includeGraph?: boolean;
  timeoutSeconds?: number;
  runner?: PackageRecycleCommandRunner;
}

export interface PackageRecycleCommandResult {
  status: number | null;
  signal?: string | null;
  stdout: string;
  stderr: string;
  elapsedMs: number;
  timedOut?: boolean;
}

export type PackageRecycleCommandRunner = (
  command: string,
  args: string[],
  options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }
) => PackageRecycleCommandResult;

const DEFAULT_PACKAGE_SPECIFIER = 'hadara@latest';

type InstalledCommandSurface = {
  commandIds: Set<string>;
  commandText: Set<string>;
  available: boolean;
};

type TaskReadSmoke = {
  id: 'task-status' | 'task-lifecycle';
  label: string;
  command: string;
  args: (taskId: string) => string[];
  summary: string;
  compatibility: 'current' | 'legacy';
};

export function createPackageRecycleReport(options: PackageRecycleOptions): PackageRecycleReport {
  return options.execute ? createPackageRecycleExecuteReport(options) : createPackageRecycleDryRunReport(options);
}

export function createPackageRecycleDryRunReport(options: PackageRecycleOptions): PackageRecycleReport {
  const issues: PackageRecycleIssue[] = [];
  validateOptions(options, issues);
  const packageInfo = createPackageInfo(options.packageSpecifier, options.expectedVersion);
  const report: PackageRecycleReport = {
    schemaVersion: 'hadara.packageRecycle.v1',
    command: 'package.recycle',
    ok: issues.every((issue) => issue.severity !== 'error'),
    ...(options.taskId ? { taskId: options.taskId } : {}),
    mode: 'dry-run',
    readOnly: true,
    package: packageInfo,
    networkPolicy: createNetworkPolicy(),
    execution: createExecutionFlags(),
    workspace: createWorkspace(options.workspace, options.keepTemp === true),
    steps: createPlannedSteps(packageInfo, options),
    artifacts: createArtifacts(options),
    privacy: createPrivacy(),
    issues
  };

  assertSchema('hadara.packageRecycle.v1', report);
  return report;
}

export function createPackageRecycleExecuteReport(options: PackageRecycleOptions): PackageRecycleReport {
  const issues: PackageRecycleIssue[] = [];
  validateOptions(options, issues);
  const packageInfo = createPackageInfo(options.packageSpecifier, options.expectedVersion);
  const workspaceSetup = prepareWorkspace(options.paths.projectRoot, options.workspace, options.keepTemp === true, issues);
  const steps: PackageRecycleStep[] = [
    {
      id: 'plan-workspace',
      label: 'Prepare disposable consumer workspace',
      status: workspaceSetup.ok ? 'passed' : 'failed',
      summary: workspaceSetup.ok
        ? 'Disposable consumer workspace was prepared outside the project source.'
        : 'Disposable consumer workspace could not be prepared safely.'
    }
  ];
  const execution = createExecutionFlags();
  const artifacts = createArtifacts(options);
  const runner = options.runner ?? runCommand;
  const timeoutMs = (options.timeoutSeconds ?? 180) * 1000;

  try {
    if (issues.some((issue) => issue.severity === 'error') || !workspaceSetup.ok) {
      steps.push(...createSkippedExecutionSteps());
    } else {
      execution.npmViewExecuted = true;
      const npmView = runner(npmCommand(), ['view', packageInfo.specifier, 'version', '--json'], {
        cwd: workspaceSetup.path,
        timeoutMs
      });
      const viewStep = commandStep('npm-view-version', 'Verify registry package version', `npm view ${packageInfo.specifier} version --json`, npmView);
      const observedVersion = parseJsonString(npmView.stdout);
      packageInfo.observedVersion = observedVersion;
      if (npmView.status !== 0 || !observedVersion) {
        failStep(viewStep, npmView.timedOut ? 'Registry version lookup timed out.' : 'Registry version lookup failed or returned no version.');
        issues.push({
          severity: 'error',
          code: npmView.timedOut ? 'PACKAGE_RECYCLE_NPM_VIEW_TIMEOUT' : 'PACKAGE_RECYCLE_NPM_VIEW_FAILED',
          message: npmView.timedOut ? 'npm view timed out during installed-package recycle.' : 'npm view failed or did not return a package version.',
          stepId: viewStep.id
        });
      } else if (packageInfo.expectedVersion && packageInfo.expectedVersion !== observedVersion) {
        failStep(viewStep, `Registry version ${observedVersion} did not match expected ${packageInfo.expectedVersion}.`);
        issues.push({
          severity: 'error',
          code: 'PACKAGE_RECYCLE_VERSION_MISMATCH',
          message: 'Registry package version did not match the expected version.',
          stepId: viewStep.id
        });
      } else {
        viewStep.summary = `Registry resolved package version ${observedVersion}.`;
      }
      steps.push(viewStep);

      execution.npmDistTagExecuted = true;
      const distTags = runner(npmCommand(), ['dist-tag', 'ls', packageInfo.name], {
        cwd: workspaceSetup.path,
        timeoutMs
      });
      const distTagStep = commandStep('npm-dist-tags', 'Verify registry dist-tags', `npm dist-tag ls ${packageInfo.name}`, distTags);
      if (distTags.status !== 0) {
        failStep(distTagStep, distTags.timedOut ? 'Registry dist-tag lookup timed out.' : 'Registry dist-tag lookup failed.');
        issues.push({
          severity: 'error',
          code: distTags.timedOut ? 'PACKAGE_RECYCLE_DIST_TAG_TIMEOUT' : 'PACKAGE_RECYCLE_DIST_TAG_FAILED',
          message: distTags.timedOut ? 'npm dist-tag lookup timed out.' : 'npm dist-tag lookup failed.',
          stepId: distTagStep.id
        });
      } else {
        packageInfo.distTags = parseDistTags(distTags.stdout);
        packageInfo.latestVersion = packageInfo.distTags.latest ?? null;
        distTagStep.summary = packageInfo.latestVersion
          ? `Registry latest dist-tag points to ${packageInfo.latestVersion}.`
          : 'Registry dist-tags were read; no latest tag was reported.';
      }
      steps.push(distTagStep);

      if (!hasError(issues)) {
        execution.packageInstallExecuted = true;
        const prefix = path.join(workspaceSetup.path, 'prefix');
        fs.mkdirSync(prefix, { recursive: true });
        const install = runner(npmCommand(), ['install', '-g', '--prefix', prefix, '--no-audit', '--no-fund', packageInfo.specifier], {
          cwd: workspaceSetup.path,
          timeoutMs
        });
        const installStep = commandStep('install-package', 'Install package from registry into isolated prefix', `npm install -g --prefix <redacted-prefix> ${packageInfo.specifier}`, install);
        if (install.status !== 0) {
          failStep(installStep, install.timedOut ? 'Isolated registry package install timed out.' : 'Isolated registry package install failed.');
          issues.push({
            severity: 'error',
            code: install.timedOut ? 'PACKAGE_RECYCLE_INSTALL_TIMEOUT' : 'PACKAGE_RECYCLE_INSTALL_FAILED',
            message: install.timedOut ? 'Installed-package recycle install timed out.' : 'Installed-package recycle install failed.',
            stepId: installStep.id
          });
        } else {
          installStep.summary = 'Package installed into an isolated temporary prefix from the registry.';
          artifacts.push({
            kind: 'install-tree',
            visibility: 'temporary',
            relativePath: 'prefix',
            pathRedacted: true,
            rawContentIncluded: false
          });
        }
        steps.push(installStep);

        if (install.status === 0) {
          runInstalledSmokes({
            runner,
            installedBin: installedHadaraCommand(prefix),
            installPrefix: prefix,
            workspacePath: workspaceSetup.path,
            includeGraph: options.includeGraph === true,
            timeoutMs,
            packageInfo,
            execution,
            steps,
            issues
          });
        } else {
          steps.push(...createSkippedInstalledSteps());
        }
      } else {
        steps.push(
          {
            id: 'install-package',
            label: 'Install package from registry into isolated prefix',
            command: `npm install -g --prefix <redacted-prefix> ${packageInfo.specifier}`,
            status: 'skipped',
            summary: 'Skipped because registry metadata checks failed.'
          },
          ...createSkippedInstalledSteps()
        );
      }
    }
  } finally {
    const cleanup = cleanupWorkspace(workspaceSetup, options.keepTemp === true);
    steps.push({
      id: 'cleanup',
      label: 'Cleanup disposable workspace',
      status: cleanup.ok ? 'passed' : 'failed',
      summary: cleanup.summary
    });
    if (!cleanup.ok) {
      issues.push({
        severity: 'warning',
        code: 'PACKAGE_RECYCLE_CLEANUP_FAILED',
        message: 'Installed-package recycle cleanup could not remove the disposable workspace.',
        stepId: 'cleanup'
      });
    }
  }

  const report: PackageRecycleReport = {
    schemaVersion: 'hadara.packageRecycle.v1',
    command: 'package.recycle',
    ok: issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status !== 'failed'),
    ...(options.taskId ? { taskId: options.taskId } : {}),
    mode: 'execute',
    readOnly: false,
    package: packageInfo,
    networkPolicy: createNetworkPolicy(),
    execution,
    workspace: {
      kind: 'disposable',
      displayPath: workspaceSetup.displayPath,
      pathRedacted: true,
      retention: options.keepTemp === true ? 'kept-temporary' : 'deleted'
    },
    steps,
    artifacts,
    privacy: createPrivacy(),
    issues
  };

  if (options.attachEvidence === true && options.taskId && options.noEvidence !== true) {
    const evidence = attachReducedSmokeEvidence({
      projectRoot: options.paths.projectRoot,
      taskId: options.taskId,
      category: 'package-recycle',
      kind: 'command-log',
      summary: `Installed-package recycle ${report.ok ? 'passed' : 'failed'} with reduced public evidence.`,
      result: report.ok ? 'passed' : 'failed',
      report
    });
    report.artifacts.push(evidence.artifact);
    report.steps.push({
      id: 'evidence',
      label: 'Attach reduced public evidence',
      status: 'passed',
      summary: 'Reduced installed-package recycle summary was attached as public evidence after redaction checks.'
    });
  }

  assertSchema('hadara.packageRecycle.v1', report);
  return report;
}

function runInstalledSmokes(input: {
  runner: PackageRecycleCommandRunner;
  installedBin: string;
  installPrefix: string;
  workspacePath: string;
  includeGraph: boolean;
  timeoutMs: number;
  packageInfo: PackageRecycleReport['package'];
  execution: PackageRecycleReport['execution'];
  steps: PackageRecycleStep[];
  issues: PackageRecycleIssue[];
}): void {
  const env = installPathEnv(input.installPrefix);

  input.execution.installedVersionExecuted = true;
  const version = input.runner(input.installedBin, ['version', '--json'], {
    cwd: input.workspacePath,
    timeoutMs: input.timeoutMs,
    env
  });
  const versionStep = commandStep('installed-version', 'Verify installed CLI version', 'hadara version --json', version);
  const packageVersion = parsePackageVersion(version.stdout);
  if (version.status !== 0 || !packageVersion) {
    failStep(versionStep, version.timedOut ? 'Installed CLI version check timed out.' : 'Installed CLI version check failed or returned no packageVersion.');
    input.issues.push({
      severity: 'error',
      code: version.timedOut ? 'PACKAGE_RECYCLE_INSTALLED_VERSION_TIMEOUT' : 'PACKAGE_RECYCLE_INSTALLED_VERSION_FAILED',
      message: version.timedOut ? 'Installed hadara version check timed out.' : 'Installed hadara version check failed or returned no packageVersion.',
      stepId: versionStep.id
    });
  } else if (input.packageInfo.expectedVersion && input.packageInfo.expectedVersion !== packageVersion) {
    failStep(versionStep, `Installed CLI version ${packageVersion} did not match expected ${input.packageInfo.expectedVersion}.`);
    input.issues.push({
      severity: 'error',
      code: 'PACKAGE_RECYCLE_INSTALLED_VERSION_MISMATCH',
      message: 'Installed package version did not match the expected version.',
      stepId: versionStep.id
    });
  } else {
    versionStep.summary = `Installed CLI reports packageVersion ${packageVersion}.`;
  }
  input.steps.push(versionStep);

  input.execution.commandSurfaceExecuted = true;
  const commandSurface = readInstalledCommandSurface(input);

  input.execution.lifecycleHelpExecuted = true;
  pushJsonSmokeStep(input, {
    id: 'help-lifecycle',
    label: 'Verify lifecycle help from installed CLI',
    command: 'hadara help lifecycle --json',
    args: ['help', 'lifecycle', '--json']
  });

  const taskReadSmoke = selectTaskReadSmoke(commandSurface);
  const disposableProject = path.join(input.workspacePath, 'consumer-project');
  fs.mkdirSync(disposableProject, { recursive: true });
  input.execution.initExecuted = true;
  pushJsonSmokeStep(input, {
    id: 'init-project',
    label: 'Initialize disposable project with installed CLI',
    command: 'hadara init --json',
    args: ['init', '--json'],
    cwd: disposableProject
  });

  const createTask = input.runner(input.installedBin, ['task', 'create', 'Installed package recycle smoke', '--json'], {
    cwd: disposableProject,
    timeoutMs: input.timeoutMs,
    env
  });
  const createTaskStep = commandStep('task-create', 'Create disposable task with installed CLI', 'hadara task create <title> --json', createTask);
  const taskId = parseTaskId(createTask.stdout);
  if (!isOkJson(createTask) || !taskId) {
    failStep(createTaskStep, createTask.timedOut ? 'Installed task create timed out.' : 'Installed task create failed or returned no task id.');
    input.issues.push({
      severity: 'error',
      code: createTask.timedOut ? 'PACKAGE_RECYCLE_TASK_CREATE_TIMEOUT' : 'PACKAGE_RECYCLE_TASK_CREATE_FAILED',
      message: createTask.timedOut ? 'Installed task create timed out.' : 'Installed task create failed or returned no task id.',
      stepId: createTaskStep.id
    });
    input.steps.push(createTaskStep);
    input.steps.push(skippedStep(taskReadSmoke.id, taskReadSmoke.label, taskReadSmoke.command, 'Skipped because task creation failed.'));
  } else {
    createTaskStep.summary = `Disposable task ${taskId} was created.`;
    input.steps.push(createTaskStep);
    if (taskReadSmoke.compatibility === 'current') {
      input.execution.taskStatusExecuted = true;
    } else {
      input.execution.taskLifecycleExecuted = true;
    }
    pushJsonSmokeStep(input, {
      id: taskReadSmoke.id,
      label: taskReadSmoke.label,
      command: taskReadSmoke.command,
      args: taskReadSmoke.args(taskId),
      cwd: disposableProject
    });
    pushJsonSmokeStep(input, {
      id: 'status-ingress',
      label: 'Verify project status ingress read model',
      command: 'hadara status --json',
      args: ['status', '--json'],
      cwd: disposableProject
    });
    pushTaskCloseSmokeStep(input, {
      id: 'task-close',
      label: 'Verify task close dry-run report',
      command: 'hadara task close --task <task-id> --dry-run --json',
      args: ['task', 'close', '--task', taskId, '--dry-run', '--json'],
      cwd: disposableProject
    });
  }

  input.execution.contextSmokeExecuted = true;
  if (input.includeGraph) {
    pushJsonSmokeStep(input, {
      id: 'context-graph',
      label: 'Verify context graph read model',
      command: 'hadara context graph --json',
      args: ['context', 'graph', '--json'],
      cwd: disposableProject
    });
  }
  pushJsonSmokeStep(input, {
    id: 'context-pack',
    label: 'Verify context pack read model',
    command: 'hadara context pack --task <task-id> --json',
    args: ['context', 'pack', ...(taskId ? ['--task', taskId] : []), '--json'],
    cwd: disposableProject
  });
  pushJsonSmokeStep(input, {
    id: 'context-slice',
    label: 'Verify context slice raw adapter',
    command: 'hadara context slice --path docs/PROJECT_STATE.md --from 1 --to 20 --json',
    args: ['context', 'slice', '--path', 'docs/PROJECT_STATE.md', '--from', '1', '--to', '20', '--json'],
    cwd: disposableProject
  });
}

function pushJsonSmokeStep(
  input: {
    runner: PackageRecycleCommandRunner;
    installedBin: string;
    installPrefix: string;
    workspacePath: string;
    timeoutMs: number;
    issues: PackageRecycleIssue[];
    steps: PackageRecycleStep[];
  },
  step: { id: string; label: string; command: string; args: string[]; cwd?: string }
): void {
  const result = input.runner(input.installedBin, step.args, {
    cwd: step.cwd ?? input.workspacePath,
    timeoutMs: input.timeoutMs,
    env: installPathEnv(input.installPrefix)
  });
  const reportStep = commandStep(step.id, step.label, step.command, result);
  if (!isOkJson(result)) {
    failStep(reportStep, result.timedOut ? `${step.label} timed out.` : `${step.label} failed or returned non-ok JSON.`);
    input.issues.push({
      severity: 'error',
      code: `PACKAGE_RECYCLE_${step.id.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_FAILED`,
      message: `${step.label} failed during installed-package recycle.`,
      stepId: step.id
    });
  } else {
    reportStep.summary = `${step.label} returned an ok JSON report.`;
  }
  input.steps.push(reportStep);
}

function pushTaskCloseSmokeStep(
  input: {
    runner: PackageRecycleCommandRunner;
    installedBin: string;
    installPrefix: string;
    workspacePath: string;
    timeoutMs: number;
    issues: PackageRecycleIssue[];
    steps: PackageRecycleStep[];
  },
  step: { id: string; label: string; command: string; args: string[]; cwd?: string }
): void {
  const result = input.runner(input.installedBin, step.args, {
    cwd: step.cwd ?? input.workspacePath,
    timeoutMs: input.timeoutMs,
    env: installPathEnv(input.installPrefix)
  });
  const reportStep = commandStep(step.id, step.label, step.command, result);
  const parsed = parseJsonObject(result.stdout);
  if (!parsed || parsed.schemaVersion !== 'hadara.task.close.v2' || parsed.mode !== 'dry-run') {
    failStep(reportStep, result.timedOut ? `${step.label} timed out.` : `${step.label} failed or returned no task close dry-run JSON report.`);
    input.issues.push({
      severity: 'error',
      code: `PACKAGE_RECYCLE_${step.id.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_FAILED`,
      message: `${step.label} failed during installed-package recycle.`,
      stepId: step.id
    });
  } else {
    reportStep.status = 'passed';
    reportStep.summary = `${step.label} returned a task close dry-run report.`;
  }
  input.steps.push(reportStep);
}

function createPackageInfo(packageSpecifier: string | undefined, expectedVersion: string | undefined): PackageRecycleReport['package'] {
  const specifier = packageSpecifier ?? DEFAULT_PACKAGE_SPECIFIER;
  return {
    specifier,
    name: packageNameFromSpecifier(specifier),
    expectedVersion: expectedVersion ?? null,
    observedVersion: null,
    latestVersion: null,
    distTags: {}
  };
}

function createExecutionFlags(): PackageRecycleReport['execution'] {
  return {
    npmViewExecuted: false,
    npmDistTagExecuted: false,
    packageInstallExecuted: false,
    installedVersionExecuted: false,
    commandSurfaceExecuted: false,
    lifecycleHelpExecuted: false,
    initExecuted: false,
    taskStatusExecuted: false,
    taskLifecycleExecuted: false,
    contextSmokeExecuted: false,
    releaseMutationExecuted: false,
    publishExecuted: false
  };
}

function createNetworkPolicy(): PackageRecycleReport['networkPolicy'] {
  return {
    mode: 'environment-inherited',
    enforced: false,
    notes: ['Installed-package recycle uses npm registry/network access only in explicit --execute mode.']
  };
}

function createPrivacy(): PackageRecycleReport['privacy'] {
  return {
    rawLogsIncluded: false,
    rawPackageContentsIncluded: false,
    privatePathsIncluded: false,
    environmentSecretsIncluded: false,
    privateStorePathsIncluded: false
  };
}

function createWorkspace(workspace: string | undefined, keepTemp: boolean): PackageRecycleReport['workspace'] {
  return {
    kind: 'disposable',
    displayPath: workspace ? '<redacted-disposable-workspace>' : '<system-temp>/hadara-package-recycle-*',
    pathRedacted: true,
    retention: keepTemp ? 'kept-temporary' : 'deleted'
  };
}

function createArtifacts(options: PackageRecycleOptions): PackageRecycleReport['artifacts'] {
  const artifacts: PackageRecycleReport['artifacts'] = [
    {
      kind: 'summary',
      visibility: 'temporary',
      pathRedacted: true,
      rawContentIncluded: false
    }
  ];
  if (options.attachEvidence === true && options.taskId && options.noEvidence !== true) {
    artifacts.push({
      kind: 'summary',
      visibility: 'public',
      evidencePath: `tasks/${options.taskId}-*/artifacts/package-recycle/summary.json`,
      rawContentIncluded: false
    });
  }
  return artifacts;
}

function createPlannedSteps(packageInfo: PackageRecycleReport['package'], options: PackageRecycleOptions): PackageRecycleStep[] {
  return [
    {
      id: 'plan-workspace',
      label: 'Plan disposable consumer workspace',
      status: 'planned',
      summary: 'Would create an isolated install prefix and disposable initialized HADARA project.'
    },
    {
      id: 'npm-view-version',
      label: 'Verify registry package version',
      command: `npm view ${packageInfo.specifier} version --json`,
      status: 'planned',
      summary: options.expectedVersion
        ? `Would verify registry version equals ${options.expectedVersion}.`
        : 'Would read the registry package version.'
    },
    {
      id: 'npm-dist-tags',
      label: 'Verify registry dist-tags',
      command: `npm dist-tag ls ${packageInfo.name}`,
      status: 'planned',
      summary: 'Would read npm dist-tags, including latest.'
    },
    {
      id: 'install-package',
      label: 'Install package from registry into isolated prefix',
      command: `npm install -g --prefix <redacted-prefix> ${packageInfo.specifier}`,
      status: 'planned',
      summary: 'Would install the published package into an isolated prefix.'
    },
    {
      id: 'installed-version',
      label: 'Verify installed CLI version',
      command: 'hadara version --json',
      status: 'planned',
      summary: 'Would verify the installed CLI reports the expected packageVersion.'
    },
    {
      id: 'command-surface',
      label: 'Read installed CLI command surface',
      command: 'hadara commands --json',
      status: 'planned',
      summary: 'Would read the installed CLI command registry to choose current or legacy lifecycle smokes.'
    },
    {
      id: 'help-lifecycle',
      label: 'Verify lifecycle help from installed CLI',
      command: 'hadara help lifecycle --json',
      status: 'planned',
      summary: 'Would verify installed lifecycle guidance is available.'
    },
    {
      id: 'init-project',
      label: 'Initialize disposable project with installed CLI',
      command: 'hadara init --json',
      status: 'planned',
      summary: 'Would initialize a disposable consumer project.'
    },
    {
      id: 'task-create',
      label: 'Create disposable task with installed CLI',
      command: 'hadara task create <title> --json',
      status: 'planned',
      summary: 'Would create a task capsule in the disposable project.'
    },
    {
      id: 'task-status',
      label: 'Verify task status read model',
      command: 'hadara task status --task <task-id> --json',
      status: 'planned',
      summary: 'Would verify the task status read model for the disposable task.'
    },
    {
      id: 'status-ingress',
      label: 'Verify project status ingress read model',
      command: 'hadara status --json',
      status: 'planned',
      summary: 'Would verify status-first project/session ingress in the disposable project.'
    },
    {
      id: 'task-close',
      label: 'Verify task close dry-run report',
      command: 'hadara task close --task <task-id> --dry-run --json',
      status: 'planned',
      summary: 'Would verify task close dry-run guidance on the disposable task.'
    },
    ...(options.includeGraph === true
      ? [
          {
            id: 'context-graph',
            label: 'Verify context graph read model',
            command: 'hadara context graph --json',
            status: 'planned' as const,
            summary: 'Would verify context graph on the initialized project because --include-graph was set.'
          }
        ]
      : []),
    {
      id: 'context-pack',
      label: 'Verify context pack read model',
      command: 'hadara context pack --task <task-id> --json',
      status: 'planned',
      summary: 'Would verify task-scoped context pack on the initialized project.'
    },
    {
      id: 'context-slice',
      label: 'Verify context slice raw adapter',
      command: 'hadara context slice --path docs/PROJECT_STATE.md --from 1 --to 20 --json',
      status: 'planned',
      summary: 'Would verify bounded raw context slicing on initialized docs.'
    },
    {
      id: 'cleanup',
      label: 'Cleanup disposable workspace',
      status: 'planned',
      summary: 'Would remove the disposable consumer workspace unless --keep-temp is set.'
    }
  ];
}

function createSkippedExecutionSteps(): PackageRecycleStep[] {
  return [
    skippedStep('npm-view-version', 'Verify registry package version', `npm view ${DEFAULT_PACKAGE_SPECIFIER} version --json`, 'Skipped because option validation or workspace preparation failed.'),
    skippedStep('npm-dist-tags', 'Verify registry dist-tags', 'npm dist-tag ls hadara', 'Skipped because option validation or workspace preparation failed.'),
    skippedStep('install-package', 'Install package from registry into isolated prefix', `npm install -g --prefix <redacted-prefix> ${DEFAULT_PACKAGE_SPECIFIER}`, 'Skipped because option validation or workspace preparation failed.'),
    ...createSkippedInstalledSteps()
  ];
}

function createSkippedInstalledSteps(): PackageRecycleStep[] {
  return [
    skippedStep('installed-version', 'Verify installed CLI version', 'hadara version --json', 'Skipped because package install failed.'),
    skippedStep('command-surface', 'Read installed CLI command surface', 'hadara commands --json', 'Skipped because package install failed.'),
    skippedStep('help-lifecycle', 'Verify lifecycle help from installed CLI', 'hadara help lifecycle --json', 'Skipped because package install failed.'),
    skippedStep('init-project', 'Initialize disposable project with installed CLI', 'hadara init --json', 'Skipped because package install failed.'),
    skippedStep('task-create', 'Create disposable task with installed CLI', 'hadara task create <title> --json', 'Skipped because package install failed.'),
    skippedStep('task-status', 'Verify task status read model', 'hadara task status --task <task-id> --json', 'Skipped because package install failed.'),
    skippedStep('status-ingress', 'Verify project status ingress read model', 'hadara status --json', 'Skipped because package install failed.'),
    skippedStep('task-close', 'Verify task close dry-run report', 'hadara task close --task <task-id> --dry-run --json', 'Skipped because package install failed.'),
    skippedStep('context-pack', 'Verify context pack read model', 'hadara context pack --task <task-id> --json', 'Skipped because package install failed.'),
    skippedStep('context-slice', 'Verify context slice raw adapter', 'hadara context slice --path docs/PROJECT_STATE.md --from 1 --to 20 --json', 'Skipped because package install failed.')
  ];
}

function readInstalledCommandSurface(input: {
  runner: PackageRecycleCommandRunner;
  installedBin: string;
  installPrefix: string;
  workspacePath: string;
  timeoutMs: number;
  issues: PackageRecycleIssue[];
  steps: PackageRecycleStep[];
}): InstalledCommandSurface {
  const result = input.runner(input.installedBin, ['commands', '--json'], {
    cwd: input.workspacePath,
    timeoutMs: input.timeoutMs,
    env: installPathEnv(input.installPrefix)
  });
  const step = commandStep('command-surface', 'Read installed CLI command surface', 'hadara commands --json', result);
  const surface = parseInstalledCommandSurface(result.stdout);
  if (result.status !== 0 || !surface.available) {
    failStep(step, result.timedOut ? 'Installed command-surface read timed out.' : 'Installed command-surface read failed or returned no commands.');
    input.issues.push({
      severity: 'warning',
      code: result.timedOut ? 'PACKAGE_RECYCLE_COMMAND_SURFACE_TIMEOUT' : 'PACKAGE_RECYCLE_COMMAND_SURFACE_UNAVAILABLE',
      message: 'Installed command surface could not be read; package recycle will use the current task status smoke.',
      stepId: step.id
    });
    input.steps.push(step);
    return emptyCommandSurface();
  }

  step.summary = `Installed command surface exposed ${surface.commandIds.size} command ids.`;
  input.steps.push(step);
  return surface;
}

function selectTaskReadSmoke(surface: InstalledCommandSurface): TaskReadSmoke {
  if (hasInstalledCommand(surface, 'task.status', 'hadara task status')) {
    return {
      id: 'task-status',
      label: 'Verify task status read model',
      command: 'hadara task status --task <task-id> --json',
      args: (taskId: string) => ['task', 'status', '--task', taskId, '--json'],
      summary: 'Selected current task status smoke from installed command surface.',
      compatibility: 'current'
    };
  }

  if (hasInstalledCommand(surface, 'task.lifecycle', 'hadara task lifecycle')) {
    return {
      id: 'task-lifecycle',
      label: 'Verify legacy task lifecycle read model',
      command: 'hadara task lifecycle --task <task-id> --json',
      args: (taskId: string) => ['task', 'lifecycle', '--task', taskId, '--json'],
      summary: 'Selected legacy task lifecycle smoke because installed command surface does not expose task.status.',
      compatibility: 'legacy'
    };
  }

  return {
    id: 'task-status',
    label: 'Verify task status read model',
    command: 'hadara task status --task <task-id> --json',
    args: (taskId: string) => ['task', 'status', '--task', taskId, '--json'],
    summary: 'Selected current task status smoke because installed command surface was unavailable or incomplete.',
    compatibility: 'current'
  };
}

function skippedStep(id: string, label: string, command: string, summary: string): PackageRecycleStep {
  return { id, label, command, status: 'skipped', summary };
}

function prepareWorkspace(projectRoot: string, workspace: string | undefined, keepTemp: boolean, issues: PackageRecycleIssue[]): { ok: boolean; path: string; displayPath: string } {
  const target = workspace ? path.resolve(projectRoot, workspace) : fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-package-recycle-'));
  if (workspace) {
    const relative = path.relative(projectRoot, target);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
      issues.push({
        severity: 'error',
        code: 'PACKAGE_RECYCLE_WORKSPACE_OUTSIDE_PROJECT',
        message: 'Custom package recycle workspace must stay inside the project root unless the default system temp workspace is used.',
        stepId: 'plan-workspace'
      });
      return { ok: false, path: target, displayPath: '<redacted-disposable-workspace>' };
    }
    fs.mkdirSync(target, { recursive: true });
  }
  void keepTemp;
  return { ok: true, path: target, displayPath: workspace ? '<redacted-disposable-workspace>' : '<system-temp>/hadara-package-recycle-*' };
}

function cleanupWorkspace(workspace: { ok: boolean; path: string }, keepTemp: boolean): { ok: boolean; summary: string } {
  if (!workspace.ok) return { ok: true, summary: 'No disposable workspace cleanup was needed.' };
  if (keepTemp) return { ok: true, summary: 'Disposable workspace was kept because --keep-temp was set.' };
  try {
    fs.rmSync(workspace.path, { recursive: true, force: true });
    return { ok: true, summary: 'Disposable workspace was removed.' };
  } catch {
    return { ok: false, summary: 'Disposable workspace cleanup failed.' };
  }
}

function validateOptions(options: PackageRecycleOptions, issues: PackageRecycleIssue[]): void {
  if (options.taskId && !/^T-\d{4}$/.test(options.taskId)) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_RECYCLE_TASK_ID_INVALID',
      message: 'Task id must use T-XXXX format.'
    });
  }
  if (options.timeoutSeconds !== undefined && options.timeoutSeconds < 1) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_RECYCLE_TIMEOUT_INVALID',
      message: 'Timeout must be at least one second.'
    });
  }
}

function commandStep(id: string, label: string, command: string, result: PackageRecycleCommandResult): PackageRecycleStep {
  return {
    id,
    label,
    command,
    status: result.status === 0 ? 'passed' : 'failed',
    exitCode: result.status,
    ...(result.elapsedMs === undefined ? {} : { elapsedMs: result.elapsedMs }),
    summary: result.status === 0 ? `${label} completed.` : `${label} failed.`
  };
}

function failStep(step: PackageRecycleStep, summary: string): void {
  step.status = 'failed';
  step.summary = summary;
}

function runCommand(command: string, args: string[], options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }): PackageRecycleCommandResult {
  const timer = startMonotonicTimer();
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    encoding: 'utf8',
    timeout: options.timeoutMs,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return {
    status: result.status,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    elapsedMs: timer.elapsedMs(),
    timedOut: result.error?.name === 'Error' && /timed out/i.test(result.error.message)
  };
}

function npmCommand(): string {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function installedHadaraCommand(prefix: string): string {
  return process.platform === 'win32' ? path.join(prefix, 'hadara.cmd') : path.join(prefix, 'bin', 'hadara');
}

function installPathEnv(prefix: string): NodeJS.ProcessEnv {
  const bin = process.platform === 'win32' ? prefix : path.join(prefix, 'bin');
  const env = { ...process.env };
  delete env.HADARA_PROJECT_ROOT;
  return {
    ...env,
    PATH: `${bin}${path.delimiter}${process.env.PATH ?? ''}`
  };
}

function parseJsonObject(stdout: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(stdout);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function packageNameFromSpecifier(specifier: string): string {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('@');
    return `@${parts[1]}`;
  }
  return specifier.split('@')[0] || 'hadara';
}

function parseJsonString(stdout: string): string | null {
  try {
    const parsed = JSON.parse(stdout);
    return typeof parsed === 'string' ? parsed : null;
  } catch {
    const trimmed = stdout.trim();
    return trimmed.length > 0 ? trimmed.replace(/^"|"$/g, '') : null;
  }
}

function parseDistTags(stdout: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const line of stdout.split(/\r?\n/)) {
    const match = line.trim().match(/^([^:]+):\s+(.+)$/);
    if (match) tags[match[1]] = match[2];
  }
  return tags;
}

function parsePackageVersion(stdout: string): string | null {
  try {
    const parsed = JSON.parse(stdout);
    return typeof parsed?.packageVersion === 'string' ? parsed.packageVersion : null;
  } catch {
    return null;
  }
}

function parseTaskId(stdout: string): string | null {
  try {
    const parsed = JSON.parse(stdout);
    return typeof parsed?.task?.id === 'string' ? parsed.task.id : typeof parsed?.id === 'string' ? parsed.id : null;
  } catch {
    return null;
  }
}

function parseInstalledCommandSurface(stdout: string): InstalledCommandSurface {
  const parsed = parseJsonObject(stdout);
  const commands = Array.isArray(parsed?.commands) ? parsed.commands : [];
  const commandIds = new Set<string>();
  const commandText = new Set<string>();
  for (const entry of commands) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    const record = entry as Record<string, unknown>;
    if (typeof record.id === 'string' && record.id.trim()) commandIds.add(record.id.trim());
    if (typeof record.command === 'string' && record.command.trim()) commandText.add(record.command.trim());
  }
  return {
    commandIds,
    commandText,
    available: commandIds.size > 0 || commandText.size > 0
  };
}

function emptyCommandSurface(): InstalledCommandSurface {
  return {
    commandIds: new Set(),
    commandText: new Set(),
    available: false
  };
}

function hasInstalledCommand(surface: InstalledCommandSurface, id: string, commandPrefix: string): boolean {
  if (surface.commandIds.has(id)) return true;
  for (const command of surface.commandText) {
    if (command === commandPrefix || command.startsWith(`${commandPrefix} `)) return true;
  }
  return false;
}

function isOkJson(result: PackageRecycleCommandResult): boolean {
  if (result.status !== 0) return false;
  try {
    const parsed = JSON.parse(result.stdout);
    return parsed?.ok !== false;
  } catch {
    return result.stdout.trim() === '';
  }
}

function hasError(issues: PackageRecycleIssue[]): boolean {
  return issues.some((issue) => issue.severity === 'error');
}
