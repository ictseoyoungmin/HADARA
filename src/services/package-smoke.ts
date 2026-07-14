import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { HadaraPaths } from '../core/paths';
import { assertSchema } from '../core/schema';
import { startMonotonicTimer } from '../core/timing';
import { attachReducedSmokeEvidence } from './smoke-evidence';
import { readPythonProjectPreview } from './release-targets';
import { listCommandRegistryEntries } from './capability-registry';
import {
  diffCommandIds,
  diffRoutingParity,
  extractDispatcherCaseTokens,
  extractRegistryTopLevelVerbs,
  findInstalledPackageRoot
} from './command-surface-drift';

export interface PackageSmokeIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  stepId?: string;
}

export interface PackageSmokeReport {
  schemaVersion: 'hadara.packageSmoke.v1';
  command: 'package.smoke';
  ok: boolean;
  taskId?: string;
  mode: 'dry-run' | 'local';
  readOnly: boolean;
  provider: {
    ecosystem: 'npm' | 'python';
    smokeProfile: 'npm-package-smoke' | 'python-package-smoke';
    command: 'package.smoke';
  };
  networkPolicy: PackageSmokeNetworkPolicy;
  execution: {
    npmPackExecuted: boolean;
    pythonBuildExecuted?: boolean;
    twineCheckExecuted?: boolean;
    pipInstallExecuted?: boolean;
    packageInstallExecuted: boolean;
    featureSmokeExecuted: boolean;
    releaseMutationExecuted: false;
    publishExecuted: false;
  };
  workspace: {
    kind: 'disposable';
    displayPath: string;
    pathRedacted: true;
    relativePath?: string;
    retention: 'deleted' | 'kept-temporary';
  };
  source: {
    kind: 'source-checkout' | 'tarball' | 'release-artifact';
    displayPath: string;
    pathRedacted: true;
    relativePath?: string;
  };
  steps: Array<{
    id: string;
    label: string;
    command?: string;
    status: 'planned' | 'passed' | 'failed' | 'skipped';
    exitCode?: number | null;
    elapsedMs?: number;
    summary: string;
    fallbackUsed?: boolean;
    fallbackReason?: string;
  }>;
  artifacts: Array<{
    kind: 'summary' | 'command-log' | 'package-artifact' | 'install-tree';
    visibility: 'public' | 'private' | 'temporary';
    evidencePath?: string;
    relativePath?: string;
    pathRedacted?: true;
    rawContentIncluded: false;
    byteLength?: number;
    hash?: string;
  }>;
  privacy: {
    rawLogsIncluded: false;
    rawPackageContentsIncluded: false;
    privatePathsIncluded: false;
    environmentSecretsIncluded: false;
    privateStorePathsIncluded: false;
  };
  issues: PackageSmokeIssue[];
}

export interface PackageSmokeNetworkPolicy {
  mode: 'environment-inherited' | 'offline-requested' | 'offline-best-effort';
  enforced: boolean;
  notes: string[];
}

export interface PackageSmokeDryRunOptions {
  paths: HadaraPaths;
  dryRun?: boolean;
  provider?: string;
  networkPolicy?: string;
  from?: string;
  workspace?: string;
  taskId?: string;
  attachEvidence?: boolean;
  noEvidence?: boolean;
  keepTemp?: boolean;
  privateLogs?: boolean;
  timeoutSeconds?: number;
}

export interface PackageSmokeLocalOptions extends PackageSmokeDryRunOptions {
  runner?: PackageSmokeCommandRunner;
}

export interface PackageSmokeCommandResult {
  status: number | null;
  signal?: string | null;
  stdout: string;
  stderr: string;
  elapsedMs: number;
  timedOut?: boolean;
}

export type PackageSmokeCommandRunner = (command: string, args: string[], options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }) => PackageSmokeCommandResult;

export function createPackageSmokeDryRunReport(options: PackageSmokeDryRunOptions): PackageSmokeReport {
  if (normalizePackageSmokeProvider(options.provider) === 'python') {
    return createPythonPackageSmokeDryRunReport(options);
  }

  const issues: PackageSmokeIssue[] = [];
  if (options.dryRun === false) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_EXECUTION_DISABLED',
      message: 'Only package-smoke dry-run planning is implemented in this capsule.'
    });
  }

  validateTaskId(options.taskId, issues);
  validateTimeout(options.timeoutSeconds, issues);
  const source = createSource(options.paths.projectRoot, options.from, issues);
  const workspace = createWorkspace(options.workspace, options.keepTemp === true);
  const steps = createDryRunSteps(source.kind, options);
  const artifacts = createPlannedArtifacts(options);
  const networkPolicy = createNetworkPolicy(options.networkPolicy, 'npm', issues);

  const report: PackageSmokeReport = {
    schemaVersion: 'hadara.packageSmoke.v1',
    command: 'package.smoke',
    ok: false,
    ...(options.taskId ? { taskId: options.taskId } : {}),
    mode: 'dry-run',
    readOnly: true,
    provider: {
      ecosystem: 'npm',
      smokeProfile: 'npm-package-smoke',
      command: 'package.smoke'
    },
    networkPolicy,
    execution: {
      npmPackExecuted: false,
      packageInstallExecuted: false,
      featureSmokeExecuted: false,
      releaseMutationExecuted: false,
      publishExecuted: false
    },
    workspace,
    source,
    steps,
    artifacts,
    privacy: {
      rawLogsIncluded: false,
      rawPackageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues
  };

  report.ok = issues.every((issue) => issue.severity !== 'error');
  assertSchema('hadara.packageSmoke.v1', report);
  return report;
}

export function createPackageSmokeLocalReport(options: PackageSmokeLocalOptions): PackageSmokeReport {
  if (normalizePackageSmokeProvider(options.provider) === 'python') {
    return createPythonPackageSmokeLocalReport(options);
  }

  const issues: PackageSmokeIssue[] = [];
  validateTaskId(options.taskId, issues);
  validateTimeout(options.timeoutSeconds, issues);

  const source = createSource(options.paths.projectRoot, options.from, issues);
  const workspaceSetup = prepareExecutionWorkspace(options.paths.projectRoot, options.workspace, options.keepTemp === true, issues);
  const networkPolicy = createNetworkPolicy(options.networkPolicy, 'npm', issues);
  const steps: PackageSmokeReport['steps'] = [
    {
      id: 'validate-source',
      label: 'Validate package source',
      status: issues.some((issue) => issue.stepId === 'validate-source' || issue.code.startsWith('PACKAGE_SMOKE_SOURCE') || issue.code === 'PACKAGE_SMOKE_BIN_MISSING')
        ? 'failed'
        : 'passed',
      summary: 'Package source metadata was checked without exposing package contents.'
    },
    {
      id: 'plan-workspace',
      label: 'Prepare disposable workspace',
      status: workspaceSetup.ok ? 'passed' : 'failed',
      summary: workspaceSetup.ok ? 'Disposable package-smoke workspace was prepared outside the project source.' : 'Disposable package-smoke workspace could not be prepared safely.'
    }
  ];

  const execution = {
    npmPackExecuted: false,
    packageInstallExecuted: false,
    featureSmokeExecuted: false,
    releaseMutationExecuted: false as const,
    publishExecuted: false as const
  };
  const artifacts: PackageSmokeReport['artifacts'] = [
    {
      kind: 'summary',
      visibility: 'temporary',
      pathRedacted: true,
      rawContentIncluded: false
    }
  ];

  let tarballPath = source.kind === 'source-checkout' ? undefined : resolveInputPath(options.paths.projectRoot, options.from);
  const runner = options.runner ?? runCommand;
  const timeoutMs = (options.timeoutSeconds ?? 120) * 1000;
  const npmEnv = workspaceNpmEnv(workspaceSetup.path);

  try {
    if (issues.some((issue) => issue.severity === 'error') || !workspaceSetup.ok) {
      pushSkippedExecutionSteps(steps);
    } else {
      if (source.kind === 'source-checkout') {
        execution.npmPackExecuted = true;
        const pack = runner(npmCommand(), ['pack', '--json', '--pack-destination', workspaceSetup.path], {
          cwd: options.paths.projectRoot,
          timeoutMs,
          env: npmEnv
        });
        const packStep = commandStep('npm-pack', 'npm pack', 'npm pack --json --pack-destination <redacted-workspace>', pack);
        tarballPath = parsePackTarball(pack.stdout, workspaceSetup.path);
        if (pack.status !== 0 || !tarballPath) {
          packStep.status = 'failed';
          packStep.summary = pack.timedOut ? 'npm pack timed out.' : 'npm pack did not produce a reduced tarball result.';
          issues.push({
            severity: 'error',
            code: pack.timedOut ? 'PACKAGE_SMOKE_NPM_PACK_TIMEOUT' : 'PACKAGE_SMOKE_NPM_PACK_FAILED',
            message: pack.timedOut ? 'npm pack timed out during package smoke.' : 'npm pack failed or did not report a tarball.',
            stepId: 'npm-pack'
          });
        } else {
          packStep.summary = 'npm pack produced a temporary package tarball.';
          const byteLength = safeFileSize(tarballPath);
          artifacts.push({
            kind: 'package-artifact',
            visibility: 'temporary',
            relativePath: path.basename(tarballPath),
            pathRedacted: true,
            rawContentIncluded: false,
            ...(byteLength === undefined ? {} : { byteLength })
          });
        }
        steps.push(packStep);
      } else {
        steps.push({
          id: 'npm-pack',
          label: 'npm pack',
          status: 'skipped',
          summary: 'Skipped because a package artifact source was provided.'
        });
      }

      if (tarballPath && !issues.some((issue) => issue.severity === 'error')) {
        execution.packageInstallExecuted = true;
        const installPrefix = path.join(workspaceSetup.path, 'prefix');
        fs.mkdirSync(installPrefix, { recursive: true });
        const install = runner(npmCommand(), ['install', '-g', '--prefix', installPrefix, '--no-audit', '--no-fund', tarballPath], {
          cwd: workspaceSetup.path,
          timeoutMs,
          env: npmEnv
        });
        const installStep = commandStep('install-cli', 'Install package into isolated prefix', 'npm install -g --prefix <redacted-prefix> <redacted-package-source>', install);
        if (install.status !== 0) {
          installStep.status = 'failed';
          installStep.summary = install.timedOut ? 'Isolated package install timed out.' : 'Isolated package install failed.';
          issues.push({
            severity: 'error',
            code: install.timedOut ? 'PACKAGE_SMOKE_INSTALL_TIMEOUT' : 'PACKAGE_SMOKE_INSTALL_FAILED',
            message: install.timedOut ? 'Package install timed out in the isolated prefix.' : 'Package install failed in the isolated prefix.',
            stepId: 'install-cli'
          });
        } else {
          installStep.summary = 'Package installed into an isolated temporary prefix.';
          artifacts.push({
            kind: 'install-tree',
            visibility: 'temporary',
            relativePath: 'prefix',
            pathRedacted: true,
            rawContentIncluded: false
          });
        }
        steps.push(installStep);

        const installedBin = installedHadaraCommand(installPrefix);
        if (install.status === 0) {
          const commandEnv = installPathEnv(installPrefix, options.paths.projectRoot);
          const doctor = runner(installedBin, ['doctor', '--json'], {
            cwd: workspaceSetup.path,
            timeoutMs,
            env: commandEnv
          });
          const doctorStep = commandStep('doctor', 'Installed HADARA doctor', 'hadara doctor --json', doctor);
          if (!isOkOrEmptyCapturedJsonReport(doctor)) {
            doctorStep.status = 'failed';
            doctorStep.summary = doctor.timedOut ? 'Installed doctor timed out.' : 'Installed doctor did not return an ok JSON report.';
            issues.push({
              severity: 'error',
              code: doctor.timedOut ? 'PACKAGE_SMOKE_DOCTOR_TIMEOUT' : 'PACKAGE_SMOKE_DOCTOR_FAILED',
              message: doctor.timedOut ? 'Installed hadara doctor timed out.' : 'Installed hadara doctor failed or returned non-ok JSON.',
              stepId: 'doctor'
            });
          } else {
            doctorStep.summary = doctor.stdout.trim() === ''
              ? 'Installed hadara doctor exited successfully; stdout capture was empty in this environment.'
              : 'Installed hadara doctor returned an ok reduced JSON report.';
            if (doctor.stdout.trim() === '') {
              markEmptyStdoutFallback(doctorStep, issues, 'doctor', 'Installed doctor exited successfully but stdout capture was empty.');
            }
          }
          steps.push(doctorStep);

          // FD-011: command-surface drift gate. Compares the installed
          // artifact's own registry projection against the in-process
          // source-of-truth registry, and the installed registry's
          // top-level verbs against routing case tokens parsed from the
          // installed dispatcher.
          let surface = runner(installedBin, ['commands', '--json'], {
            cwd: workspaceSetup.path,
            timeoutMs,
            env: commandEnv
          });
          let surfaceCommand = 'hadara commands --json (installed) + installed dist routing parse';
          if (surface.status === 0 && !surface.timedOut && surface.stdout.trim() === '') {
            const installedMain = installedMainJsPath(installPrefix);
            if (installedMain) {
              surface = runner(process.execPath, [installedMain, 'commands', '--json'], {
                cwd: workspaceSetup.path,
                timeoutMs,
                env: commandEnv
              });
              surfaceCommand = 'node <installed-package>/dist/cli/main.js commands --json + installed dist routing parse';
            }
          }
          const surfaceStep = commandStep(
            'command-surface-drift',
            'Command surface drift vs source registry',
            surfaceCommand,
            surface
          );
          const drift = evaluateInstalledCommandSurface(surface, installPrefix);
          surfaceStep.status = drift.ok ? 'passed' : 'failed';
          surfaceStep.summary = drift.summary;
          if (drift.fallbackUsed) {
            surfaceStep.fallbackUsed = true;
            surfaceStep.fallbackReason = drift.fallbackReason;
          }
          for (const issue of drift.issues) issues.push(issue);
          steps.push(surfaceStep);

          const initDocsWorkspace = path.join(workspaceSetup.path, 'init-docs-project');
          fs.mkdirSync(initDocsWorkspace, { recursive: true });
          const initDocs = runner(installedBin, ['init', '--profile', 'standard', '--json'], {
            cwd: initDocsWorkspace,
            timeoutMs,
            env: installPathEnv(installPrefix)
          });
          const initDocsStep = commandStep(
            'generated-init-docs',
            'Generated init docs current UX check',
            'hadara init --profile standard --json + generated docs sanity checks',
            initDocs
          );
          const initDocsEvaluation = evaluateGeneratedInitDocs(initDocs, initDocsWorkspace, installPrefix);
          initDocsStep.status = initDocsEvaluation.ok ? 'passed' : 'failed';
          initDocsStep.summary = initDocsEvaluation.summary;
          if (initDocsEvaluation.fallbackUsed) {
            initDocsStep.fallbackUsed = true;
            initDocsStep.fallbackReason = initDocsEvaluation.fallbackReason;
          }
          for (const issue of initDocsEvaluation.issues) issues.push(issue);
          steps.push(initDocsStep);

          execution.featureSmokeExecuted = true;
          const smoke = runner(installedBin, ['smoke', 'run', '--profile', 'core', '--json'], {
            cwd: workspaceSetup.path,
            timeoutMs,
            env: commandEnv
          });
          const smokeStep = commandStep('feature-smoke-core', 'Core feature smoke via installed command', 'hadara smoke run --profile core --json', smoke);
          if (!isOkOrEmptyCapturedJsonReport(smoke)) {
            smokeStep.status = 'failed';
            smokeStep.summary = smoke.timedOut ? 'Installed core feature smoke timed out.' : 'Installed core feature smoke did not return an ok JSON report.';
            issues.push({
              severity: 'error',
              code: smoke.timedOut ? 'PACKAGE_SMOKE_FEATURE_SMOKE_TIMEOUT' : 'PACKAGE_SMOKE_FEATURE_SMOKE_FAILED',
              message: smoke.timedOut ? 'Installed core feature smoke timed out.' : 'Installed core feature smoke failed or returned non-ok JSON.',
              stepId: 'feature-smoke-core'
            });
          } else {
            smokeStep.summary = smoke.stdout.trim() === ''
              ? 'Installed command-form core feature smoke exited successfully; stdout capture was empty in this environment.'
              : 'Installed command-form core feature smoke returned an ok reduced JSON report.';
            if (smoke.stdout.trim() === '') {
              markEmptyStdoutFallback(smokeStep, issues, 'feature-smoke-core', 'Installed core feature smoke exited successfully but stdout capture was empty.');
            }
          }
          steps.push(smokeStep);
        } else {
          steps.push(
            {
              id: 'doctor',
              label: 'Installed HADARA doctor',
              command: 'hadara doctor --json',
              status: 'skipped',
              summary: 'Skipped because isolated package install failed.'
            },
            {
              id: 'command-surface-drift',
              label: 'Command surface drift vs source registry',
              command: 'hadara commands --json (installed) + installed dist routing parse',
              status: 'skipped',
              summary: 'Skipped because isolated package install failed.'
            },
            {
              id: 'generated-init-docs',
              label: 'Generated init docs current UX check',
              command: 'hadara init --profile standard --json + generated docs sanity checks',
              status: 'skipped',
              summary: 'Skipped because isolated package install failed.'
            },
            {
              id: 'feature-smoke-core',
              label: 'Core feature smoke via installed command',
              command: 'hadara smoke run --profile core --json',
              status: 'skipped',
              summary: 'Skipped because isolated package install failed.'
            }
          );
        }
      } else if (!steps.some((step) => step.id === 'install-cli')) {
        steps.push(
          {
            id: 'install-cli',
            label: 'Install package into isolated prefix',
            command: 'npm install -g --prefix <redacted-prefix> <redacted-package-source>',
            status: 'skipped',
            summary: 'Skipped because no package tarball was available.'
          },
          {
            id: 'doctor',
            label: 'Installed HADARA doctor',
            command: 'hadara doctor --json',
            status: 'skipped',
            summary: 'Skipped because no package tarball was available.'
          },
          {
            id: 'command-surface-drift',
            label: 'Command surface drift vs source registry',
            command: 'hadara commands --json (installed) + installed dist routing parse',
            status: 'skipped',
            summary: 'Skipped because no package tarball was available.'
          },
          {
            id: 'generated-init-docs',
            label: 'Generated init docs current UX check',
            command: 'hadara init --profile standard --json + generated docs sanity checks',
            status: 'skipped',
            summary: 'Skipped because no package tarball was available.'
          },
          {
            id: 'feature-smoke-core',
            label: 'Core feature smoke via installed command',
            command: 'hadara smoke run --profile core --json',
            status: 'skipped',
            summary: 'Skipped because no package tarball was available.'
          }
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
        code: 'PACKAGE_SMOKE_CLEANUP_FAILED',
        message: 'Package-smoke cleanup could not remove the disposable workspace.',
        stepId: 'cleanup'
      });
    }
  }

  const report: PackageSmokeReport = {
    schemaVersion: 'hadara.packageSmoke.v1',
    command: 'package.smoke',
    ok: issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status !== 'failed'),
    ...(options.taskId ? { taskId: options.taskId } : {}),
    mode: 'local',
    readOnly: false,
    provider: {
      ecosystem: 'npm',
      smokeProfile: 'npm-package-smoke',
      command: 'package.smoke'
    },
    networkPolicy,
    execution,
    workspace: {
      kind: 'disposable',
      displayPath: workspaceSetup.displayPath,
      pathRedacted: true,
      ...(workspaceSetup.relativePath ? { relativePath: workspaceSetup.relativePath } : {}),
      retention: options.keepTemp === true ? 'kept-temporary' : 'deleted'
    },
    source,
    steps,
    artifacts,
    privacy: {
      rawLogsIncluded: false,
      rawPackageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues
  };

  if (options.attachEvidence === true && options.taskId && options.noEvidence !== true) {
    const evidence = attachReducedSmokeEvidence({
      projectRoot: options.paths.projectRoot,
      taskId: options.taskId,
      category: 'package-smoke',
      kind: 'command-log',
      summary: `Package smoke ${report.mode} ${report.ok ? 'passed' : 'failed'} with reduced public evidence.`,
      result: report.ok ? 'passed' : 'failed',
      report
    });
    report.artifacts.push(evidence.artifact);
    report.steps.push({
      id: 'evidence',
      label: 'Attach reduced public evidence',
      status: 'passed',
      summary: 'Reduced package-smoke summary was attached as public evidence after redaction checks.'
    });
  }

  assertSchema('hadara.packageSmoke.v1', report);
  return report;
}

function createPythonPackageSmokeDryRunReport(options: PackageSmokeDryRunOptions): PackageSmokeReport {
  const issues: PackageSmokeIssue[] = [];
  validateTaskId(options.taskId, issues);
  validateTimeout(options.timeoutSeconds, issues);
  const preview = readPythonProjectPreview(options.paths.projectRoot);
  if (!preview.detected) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_PYPROJECT_MISSING',
      message: 'Python package smoke requires pyproject.toml in the project root.',
      stepId: 'validate-source'
    });
  }
  const workspace = createWorkspace(options.workspace, options.keepTemp === true);
  const evidencePlanned = options.attachEvidence === true && options.taskId !== undefined && options.noEvidence !== true;
  const networkPolicy = createNetworkPolicy(options.networkPolicy, 'python', issues);
  const offline = networkPolicy.mode === 'offline-best-effort';
  const report: PackageSmokeReport = {
    schemaVersion: 'hadara.packageSmoke.v1',
    command: 'package.smoke',
    ok: issues.every((issue) => issue.severity !== 'error'),
    ...(options.taskId ? { taskId: options.taskId } : {}),
    mode: 'dry-run',
    readOnly: true,
    provider: {
      ecosystem: 'python',
      smokeProfile: 'python-package-smoke',
      command: 'package.smoke'
    },
    networkPolicy,
    execution: {
      npmPackExecuted: false,
      pythonBuildExecuted: false,
      twineCheckExecuted: false,
      pipInstallExecuted: false,
      packageInstallExecuted: false,
      featureSmokeExecuted: false,
      releaseMutationExecuted: false,
      publishExecuted: false
    },
    workspace,
    source: {
      kind: 'source-checkout',
      displayPath: '.',
      relativePath: '.',
      pathRedacted: true
    },
    steps: [
      {
        id: 'validate-source',
        label: 'Validate Python package source',
        status: preview.detected ? 'planned' : 'failed',
        summary: preview.detected
          ? `Would use pyproject.toml metadata${preview.packageName ? ` for ${preview.packageName}` : ''}; backend ${preview.buildBackend}.`
          : 'pyproject.toml was not found.'
      },
      {
        id: 'plan-workspace',
        label: 'Plan disposable workspace',
        status: 'planned',
        summary: 'Plan isolated Python package-smoke output and install target without creating directories.'
      },
      {
        id: 'python-build',
        label: 'Build Python distributions',
        command: offline ? 'python -m build --no-isolation' : 'python -m build',
        status: 'planned',
        summary: offline ? 'Would build wheel and sdist with best-effort offline build isolation disabled.' : 'Would build wheel and sdist into the disposable workspace.'
      },
      {
        id: 'twine-check',
        label: 'Check Python distributions',
        command: 'twine check',
        status: 'planned',
        summary: 'Would run twine check against built distributions without uploading.'
      },
      {
        id: 'pip-install-wheel',
        label: 'Install Python wheel',
        command: offline ? 'pip install --no-index --no-deps wheel' : 'pip install wheel',
        status: 'planned',
        summary: offline ? 'Would install the built wheel into an isolated target with best-effort offline pip flags.' : 'Would install the built wheel into an isolated target for local smoke.'
      },
      {
        id: 'evidence',
        label: 'Evidence handling',
        status: evidencePlanned ? 'planned' : 'skipped',
        summary:
          evidencePlanned
            ? 'Would attach a reduced public summary after redaction checks.'
            : 'No public evidence attachment is planned by default.'
      }
    ],
    artifacts: createPlannedArtifacts(options),
    privacy: {
      rawLogsIncluded: false,
      rawPackageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues
  };

  assertSchema('hadara.packageSmoke.v1', report);
  return report;
}

function createPythonPackageSmokeLocalReport(options: PackageSmokeLocalOptions): PackageSmokeReport {
  const issues: PackageSmokeIssue[] = [];
  validateTaskId(options.taskId, issues);
  validateTimeout(options.timeoutSeconds, issues);
  const preview = readPythonProjectPreview(options.paths.projectRoot);
  const networkPolicy = createNetworkPolicy(options.networkPolicy, 'python', issues);
  const offline = networkPolicy.mode === 'offline-best-effort';
  if (!preview.detected) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_PYPROJECT_MISSING',
      message: 'Python package smoke requires pyproject.toml in the project root.',
      stepId: 'validate-source'
    });
  }
  const workspaceSetup = prepareExecutionWorkspace(options.paths.projectRoot, options.workspace, options.keepTemp === true, issues);
  const runner = options.runner ?? runCommand;
  const timeoutMs = (options.timeoutSeconds ?? 120) * 1000;
  const steps: PackageSmokeReport['steps'] = [
    {
      id: 'validate-source',
      label: 'Validate Python package source',
      status: preview.detected ? 'passed' : 'failed',
      summary: preview.detected
        ? `pyproject.toml metadata was checked without executing package code; backend ${preview.buildBackend}.`
        : 'pyproject.toml was not found.'
    },
    {
      id: 'plan-workspace',
      label: 'Prepare disposable workspace',
      status: workspaceSetup.ok ? 'passed' : 'failed',
      summary: workspaceSetup.ok ? 'Disposable Python package-smoke workspace was prepared outside the project source.' : 'Disposable Python package-smoke workspace could not be prepared safely.'
    }
  ];
  const execution = {
    npmPackExecuted: false,
    pythonBuildExecuted: false,
    twineCheckExecuted: false,
    pipInstallExecuted: false,
    packageInstallExecuted: false,
    featureSmokeExecuted: false,
    releaseMutationExecuted: false as const,
    publishExecuted: false as const
  };
  const artifacts: PackageSmokeReport['artifacts'] = [
    {
      kind: 'summary',
      visibility: 'temporary',
      pathRedacted: true,
      rawContentIncluded: false
    }
  ];

  try {
    if (issues.some((issue) => issue.severity === 'error') || !workspaceSetup.ok) {
      steps.push(
        skippedPythonStep('python-build', 'Build Python distributions', offline ? 'python -m build --no-isolation' : 'python -m build'),
        skippedPythonStep('twine-check', 'Check Python distributions', 'twine check'),
        skippedPythonStep('pip-install-wheel', 'Install Python wheel', offline ? 'pip install --no-index --no-deps wheel' : 'pip install wheel')
      );
    } else {
      const distDir = path.join(workspaceSetup.path, 'dist');
      fs.mkdirSync(distDir, { recursive: true });
      execution.pythonBuildExecuted = true;
      const buildArgs = offline ? ['-m', 'build', '--no-isolation', '--outdir', distDir] : ['-m', 'build', '--outdir', distDir];
      const build = runner(pythonCommand(), buildArgs, {
        cwd: options.paths.projectRoot,
        timeoutMs
      });
      const buildStep = commandStep(
        'python-build',
        'Build Python distributions',
        offline ? 'python -m build --no-isolation --outdir <redacted-workspace>' : 'python -m build --outdir <redacted-workspace>',
        build
      );
      if (build.status !== 0) {
        buildStep.status = 'failed';
        buildStep.summary = build.timedOut ? 'Python build timed out.' : 'Python build failed.';
        issues.push({
          severity: 'error',
          code: build.timedOut ? 'PACKAGE_SMOKE_PYTHON_BUILD_TIMEOUT' : 'PACKAGE_SMOKE_PYTHON_BUILD_FAILED',
          message: build.timedOut ? 'Python build timed out during package smoke.' : 'Python build failed during package smoke.',
          stepId: 'python-build'
        });
      } else {
        buildStep.summary = 'Python build produced temporary distribution artifacts.';
        for (const artifactPath of listPythonDistributionArtifacts(distDir)) {
          const byteLength = safeFileSize(artifactPath);
          artifacts.push({
            kind: 'package-artifact',
            visibility: 'temporary',
            relativePath: path.join('dist', path.basename(artifactPath)),
            pathRedacted: true,
            rawContentIncluded: false,
            ...(byteLength === undefined ? {} : { byteLength })
          });
        }
      }
      steps.push(buildStep);

      const distributionArtifacts = listPythonDistributionArtifacts(distDir);
      const wheelPath = distributionArtifacts.find((item) => item.endsWith('.whl'));
      if (distributionArtifacts.length > 0 && !issues.some((issue) => issue.severity === 'error')) {
        execution.twineCheckExecuted = true;
        const twine = runner(twineCommand(), ['check', ...distributionArtifacts], {
          cwd: workspaceSetup.path,
          timeoutMs
        });
        const twineStep = commandStep('twine-check', 'Check Python distributions', 'twine check <redacted-distributions>', twine);
        if (twine.status !== 0) {
          twineStep.status = 'failed';
          twineStep.summary = twine.timedOut ? 'twine check timed out.' : 'twine check failed.';
          issues.push({
            severity: 'error',
            code: twine.timedOut ? 'PACKAGE_SMOKE_TWINE_CHECK_TIMEOUT' : 'PACKAGE_SMOKE_TWINE_CHECK_FAILED',
            message: twine.timedOut ? 'twine check timed out during package smoke.' : 'twine check failed during package smoke.',
            stepId: 'twine-check'
          });
        } else {
          twineStep.summary = 'twine check passed for temporary distributions.';
        }
        steps.push(twineStep);
      } else {
        steps.push(skippedPythonStep('twine-check', 'Check Python distributions', 'twine check'));
      }

      if (wheelPath && !issues.some((issue) => issue.severity === 'error')) {
        execution.pipInstallExecuted = true;
        execution.packageInstallExecuted = true;
        const installTarget = path.join(workspaceSetup.path, 'python-install');
        fs.mkdirSync(installTarget, { recursive: true });
        const pipArgs = offline
          ? ['-m', 'pip', 'install', '--no-index', '--no-deps', '--target', installTarget, wheelPath]
          : ['-m', 'pip', 'install', '--target', installTarget, wheelPath];
        const pip = runner(pythonCommand(), pipArgs, {
          cwd: workspaceSetup.path,
          timeoutMs
        });
        const pipStep = commandStep(
          'pip-install-wheel',
          'Install Python wheel',
          offline ? 'pip install --no-index --no-deps wheel --target <redacted-target>' : 'pip install wheel --target <redacted-target>',
          pip
        );
        if (pip.status !== 0) {
          pipStep.status = 'failed';
          pipStep.summary = pip.timedOut ? 'pip install timed out.' : 'pip install failed.';
          issues.push({
            severity: 'error',
            code: pip.timedOut ? 'PACKAGE_SMOKE_PIP_INSTALL_TIMEOUT' : 'PACKAGE_SMOKE_PIP_INSTALL_FAILED',
            message: pip.timedOut ? 'pip install timed out during package smoke.' : 'pip install failed during package smoke.',
            stepId: 'pip-install-wheel'
          });
        } else {
          pipStep.summary = 'Built wheel installed into an isolated temporary target.';
          artifacts.push({
            kind: 'install-tree',
            visibility: 'temporary',
            relativePath: 'python-install',
            pathRedacted: true,
            rawContentIncluded: false
          });
        }
        steps.push(pipStep);
      } else {
        steps.push(skippedPythonStep('pip-install-wheel', 'Install Python wheel', 'pip install wheel'));
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
        code: 'PACKAGE_SMOKE_CLEANUP_FAILED',
        message: 'Package-smoke cleanup could not remove the disposable workspace.',
        stepId: 'cleanup'
      });
    }
  }

  const report: PackageSmokeReport = {
    schemaVersion: 'hadara.packageSmoke.v1',
    command: 'package.smoke',
    ok: issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status !== 'failed'),
    ...(options.taskId ? { taskId: options.taskId } : {}),
    mode: 'local',
    readOnly: false,
    provider: {
      ecosystem: 'python',
      smokeProfile: 'python-package-smoke',
      command: 'package.smoke'
    },
    networkPolicy,
    execution,
    workspace: {
      kind: 'disposable',
      displayPath: workspaceSetup.displayPath,
      pathRedacted: true,
      ...(workspaceSetup.relativePath ? { relativePath: workspaceSetup.relativePath } : {}),
      retention: options.keepTemp === true ? 'kept-temporary' : 'deleted'
    },
    source: {
      kind: 'source-checkout',
      displayPath: '.',
      relativePath: '.',
      pathRedacted: true
    },
    steps,
    artifacts,
    privacy: {
      rawLogsIncluded: false,
      rawPackageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues
  };

  if (options.attachEvidence === true && options.taskId && options.noEvidence !== true) {
    const evidence = attachReducedSmokeEvidence({
      projectRoot: options.paths.projectRoot,
      taskId: options.taskId,
      category: 'package-smoke',
      kind: 'command-log',
      summary: `Python package smoke ${report.mode} ${report.ok ? 'passed' : 'failed'} with reduced public evidence.`,
      result: report.ok ? 'passed' : 'failed',
      report
    });
    report.artifacts.push(evidence.artifact);
    report.steps.push({
      id: 'evidence',
      label: 'Attach reduced public evidence',
      status: 'passed',
      summary: 'Reduced Python package-smoke summary was attached as public evidence after redaction checks.'
    });
  }

  assertSchema('hadara.packageSmoke.v1', report);
  return report;
}

function createNetworkPolicy(networkPolicy: string | undefined, provider: 'npm' | 'python', issues: PackageSmokeIssue[]): PackageSmokeNetworkPolicy {
  if (!networkPolicy) {
    return {
      mode: 'environment-inherited',
      enforced: false,
      notes: [
        'Package-smoke commands inherit the current environment network behavior.',
        'HADARA does not enforce OS-level network isolation for local package tooling.'
      ]
    };
  }
  if (networkPolicy !== 'offline') {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_NETWORK_POLICY_UNSUPPORTED',
      message: 'Unsupported package-smoke network policy. Supported value: offline.'
    });
    return {
      mode: 'environment-inherited',
      enforced: false,
      notes: ['Unsupported network policy was ignored; package-smoke remains environment-inherited.']
    };
  }
  return {
    mode: provider === 'python' ? 'offline-best-effort' : 'offline-requested',
    enforced: false,
    notes:
      provider === 'python'
        ? [
            'Best-effort Python offline flags are applied to build and pip install commands.',
            'No OS-level network isolation is enforced by HADARA.'
          ]
        : [
            'Offline network policy was requested, but npm package-smoke does not enforce offline flags in this capsule.',
            'No OS-level network isolation is enforced by HADARA.'
          ]
  };
}

function skippedPythonStep(id: string, label: string, command: string): PackageSmokeReport['steps'][number] {
  return {
    id,
    label,
    command,
    status: 'skipped',
    summary: 'Skipped because a prior Python package-smoke step did not produce the required temporary artifact.'
  };
}

function createDryRunSteps(sourceKind: PackageSmokeReport['source']['kind'], options: PackageSmokeDryRunOptions): PackageSmokeReport['steps'] {
  const packStatus = sourceKind === 'source-checkout' ? 'planned' : 'skipped';
  const evidencePlanned = options.attachEvidence === true && options.taskId !== undefined && options.noEvidence !== true;
  return [
    {
      id: 'validate-source',
      label: 'Validate package source',
      status: 'planned',
      summary: 'Check package source metadata without reading package contents into the public report.'
    },
    {
      id: 'plan-workspace',
      label: 'Plan disposable workspace',
      status: 'planned',
      summary: 'Plan an isolated package-smoke workspace without creating directories.'
    },
    {
      id: 'npm-pack',
      label: 'npm pack',
      ...(sourceKind === 'source-checkout' ? { command: 'npm pack --json' } : {}),
      status: packStatus,
      summary:
        sourceKind === 'source-checkout'
          ? 'Would create a package tarball in the disposable workspace during a later execution capsule.'
          : 'Skipped because a package artifact source was provided.'
    },
    {
      id: 'install-cli',
      label: 'Install package into isolated prefix',
      command: 'npm install <redacted-package-source>',
      status: 'planned',
      summary: 'Would install into an isolated temporary prefix during a later execution capsule.'
    },
    {
      id: 'command-surface-drift',
      label: 'Command surface drift vs source registry',
      command: 'hadara commands --json (installed) + installed dist routing parse',
      status: 'planned',
      summary: 'Would compare the installed registry projection against the source registry and check installed routing parity.'
    },
    {
      id: 'generated-init-docs',
      label: 'Generated init docs current UX check',
      command: 'hadara init --profile standard --json + generated docs sanity checks',
      status: 'planned',
      summary: 'Would initialize a disposable project and verify generated workflow docs expose current lifecycle and slice commands.'
    },
    {
      id: 'feature-smoke-core',
      label: 'Core feature smoke via installed command',
      command: 'hadara smoke run --profile core --json',
      status: 'planned',
      summary:
        'Would run core smoke through the package-installed command form; current dry-run does not execute an installed binary or subprocess.'
    },
    {
      id: 'evidence',
      label: 'Evidence handling',
      status: evidencePlanned ? 'planned' : 'skipped',
      summary:
        evidencePlanned
          ? 'Would attach a reduced public summary after redaction checks in a later evidence integration capsule.'
          : 'No public evidence attachment is planned by default.'
    }
  ];
}

function createPlannedArtifacts(options: PackageSmokeDryRunOptions): PackageSmokeReport['artifacts'] {
  const artifacts: PackageSmokeReport['artifacts'] = [
    {
      kind: 'summary',
      visibility: 'temporary',
      pathRedacted: true,
      rawContentIncluded: false
    }
  ];

  if (options.privateLogs === true) {
    artifacts.push({
      kind: 'command-log',
      visibility: 'private',
      pathRedacted: true,
      rawContentIncluded: false
    });
  }

  if (options.attachEvidence === true && options.taskId && options.noEvidence !== true) {
    artifacts.push({
      kind: 'summary',
      visibility: 'public',
      evidencePath: `${resolveTaskCapsulePath(options.paths.projectRoot, options.taskId)}/artifacts/package-smoke/dry-run-summary.json`,
      rawContentIncluded: false
    });
  }

  return artifacts;
}

function createSource(projectRoot: string, from: string | undefined, issues: PackageSmokeIssue[]): PackageSmokeReport['source'] {
  if (!from) {
    validateProjectPackageMetadata(projectRoot, issues);
    return {
      kind: 'source-checkout',
      displayPath: '.',
      pathRedacted: true,
      relativePath: '.'
    };
  }

  const relativePath = safeRelativePath(from);
  const absolutePath = path.isAbsolute(from) ? from : path.resolve(projectRoot, from);
  if (!fs.existsSync(absolutePath)) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_SOURCE_MISSING',
      message: 'Package-smoke source path does not exist.'
    });
  }

  return {
    kind: inferSourceKind(from),
    displayPath: relativePath ? `./${relativePath}` : '<redacted-package-source>',
    pathRedacted: true,
    ...(relativePath ? { relativePath } : {})
  };
}

function createWorkspace(workspace: string | undefined, keepTemp: boolean): PackageSmokeReport['workspace'] {
  const relativePath = safeRelativePath(workspace);
  return {
    kind: 'disposable',
    displayPath: relativePath ? `./${relativePath}` : '<redacted-disposable-workspace>',
    pathRedacted: true,
    ...(relativePath ? { relativePath } : {}),
    retention: keepTemp ? 'kept-temporary' : 'deleted'
  };
}

function prepareExecutionWorkspace(
  projectRoot: string,
  workspace: string | undefined,
  keepTemp: boolean,
  issues: PackageSmokeIssue[]
): { ok: boolean; path: string; displayPath: string; relativePath?: string; created: boolean; cleanupAllowed: boolean } {
  const resolved = workspace ? path.resolve(projectRoot, workspace) : fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-package-smoke-'));
  const relativePath = safeRelativePath(workspace);
  if (isInsideProject(projectRoot, resolved)) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_WORKSPACE_INSIDE_PROJECT',
      message: 'Package-smoke execution workspace must be outside the project source tree.'
    });
    return {
      ok: false,
      path: resolved,
      displayPath: relativePath ? `./${relativePath}` : '<redacted-disposable-workspace>',
      ...(relativePath ? { relativePath } : {}),
      created: false,
      cleanupAllowed: false
    };
  }

  try {
    fs.mkdirSync(resolved, { recursive: true });
    return {
      ok: true,
      path: resolved,
      displayPath: relativePath ? `./${relativePath}` : '<redacted-disposable-workspace>',
      ...(relativePath ? { relativePath } : {}),
      created: true,
      cleanupAllowed: !keepTemp
    };
  } catch {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_WORKSPACE_CREATE_FAILED',
      message: 'Package-smoke execution workspace could not be created.'
    });
    return {
      ok: false,
      path: resolved,
      displayPath: relativePath ? `./${relativePath}` : '<redacted-disposable-workspace>',
      ...(relativePath ? { relativePath } : {}),
      created: false,
      cleanupAllowed: false
    };
  }
}

function pushSkippedExecutionSteps(steps: PackageSmokeReport['steps']): void {
  steps.push(
    {
      id: 'npm-pack',
      label: 'npm pack',
      command: 'npm pack --json --pack-destination <redacted-workspace>',
      status: 'skipped',
      summary: 'Skipped because package-smoke setup failed.'
    },
    {
      id: 'install-cli',
      label: 'Install package into isolated prefix',
      command: 'npm install -g --prefix <redacted-prefix> <redacted-package-source>',
      status: 'skipped',
      summary: 'Skipped because package-smoke setup failed.'
    },
    {
      id: 'doctor',
      label: 'Installed HADARA doctor',
      command: 'hadara doctor --json',
      status: 'skipped',
      summary: 'Skipped because package-smoke setup failed.'
    },
    {
      id: 'generated-init-docs',
      label: 'Generated init docs current UX check',
      command: 'hadara init --profile standard --json + generated docs sanity checks',
      status: 'skipped',
      summary: 'Skipped because package-smoke setup failed.'
    },
    {
      id: 'feature-smoke-core',
      label: 'Core feature smoke via installed command',
      command: 'hadara smoke run --profile core --json',
      status: 'skipped',
      summary: 'Skipped because package-smoke setup failed.'
    }
  );
}

function commandStep(id: string, label: string, command: string, result: PackageSmokeCommandResult): PackageSmokeReport['steps'][number] {
  return {
    id,
    label,
    command,
    status: result.status === 0 && !result.timedOut ? 'passed' : 'failed',
    exitCode: result.status,
    elapsedMs: result.elapsedMs,
    summary: result.status === 0 && !result.timedOut ? `${label} completed successfully.` : `${label} failed with a reduced exit summary.`
  };
}

interface InstalledSurfaceEvaluation {
  ok: boolean;
  summary: string;
  issues: PackageSmokeIssue[];
  fallbackUsed?: boolean;
  fallbackReason?: string;
}

interface GeneratedInitDocsEvaluation {
  ok: boolean;
  summary: string;
  issues: PackageSmokeIssue[];
  fallbackUsed?: boolean;
  fallbackReason?: string;
}

/**
 * FD-011 drift gate evaluation. Comparison baseline for registry ids is the
 * in-process source registry, so a self-consistent stale artifact still
 * fails against current source; routing parity is checked within the
 * installed artifact (its registry verbs vs its dispatcher case tokens).
 */
function evaluateInstalledCommandSurface(surface: PackageSmokeCommandResult, installPrefix: string): InstalledSurfaceEvaluation {
  const issues: PackageSmokeIssue[] = [];
  let fallbackUsed = false;
  let fallbackReason: string | undefined;
  if (surface.status !== 0 || surface.timedOut) {
    issues.push({
      severity: 'error',
      code: surface.timedOut ? 'PACKAGE_SMOKE_SURFACE_PROBE_TIMEOUT' : 'PACKAGE_SMOKE_SURFACE_PROBE_FAILED',
      message: 'Installed `hadara commands --json` did not return a usable registry projection.',
      stepId: 'command-surface-drift'
    });
    return { ok: false, summary: 'Installed command registry projection could not be captured.', issues };
  }

  let installedEntries: Array<{ id: string; command: string }> = [];
  const sourceEntries = listCommandRegistryEntries().map((entry) => ({ id: entry.id, command: entry.command }));
  if (surface.stdout.trim() === '') {
    fallbackUsed = true;
    fallbackReason = 'Installed command registry stdout capture was empty; source registry ids were used while installed dispatcher routing parity was still checked.';
    issues.push(emptyStdoutFallbackIssue('command-surface-drift', fallbackReason));
    installedEntries = sourceEntries;
  } else {
    try {
      const parsed = JSON.parse(surface.stdout) as { commands?: unknown };
      if (Array.isArray(parsed.commands)) {
        installedEntries = parsed.commands
          .filter((entry): entry is { id: string; command: string } =>
            typeof (entry as { id?: unknown }).id === 'string' && typeof (entry as { command?: unknown }).command === 'string')
          .map((entry) => ({ id: entry.id, command: entry.command }));
      }
    } catch {
      installedEntries = [];
    }
  }
  if (installedEntries.length === 0) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_SURFACE_PROBE_FAILED',
      message: 'Installed `hadara commands --json` output could not be parsed into registry entries.',
      stepId: 'command-surface-drift'
    });
    return { ok: false, summary: 'Installed command registry projection could not be parsed.', issues };
  }

  const sourceIds = sourceEntries.map((entry) => entry.id);
  const idDiff = diffCommandIds(sourceIds, installedEntries.map((entry) => entry.id));
  if (!idDiff.ok) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_SURFACE_REGISTRY_DRIFT',
      message: `Installed registry command ids differ from the source registry. missingFromInstalled: [${idDiff.missingFromInstalled.join(', ')}]; extraInInstalled: [${idDiff.extraInInstalled.join(', ')}].`,
      stepId: 'command-surface-drift'
    });
  }

  const packageRoot = findInstalledPackageRoot(installPrefix);
  const mainJsPath = packageRoot ? path.join(packageRoot, 'dist', 'cli', 'main.js') : null;
  if (!mainJsPath || !fs.existsSync(mainJsPath)) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_SURFACE_PROBE_FAILED',
      message: 'Installed package dispatcher dist/cli/main.js could not be located for routing parity.',
      stepId: 'command-surface-drift'
    });
  } else {
    const dispatcherTokens = extractDispatcherCaseTokens(fs.readFileSync(mainJsPath, 'utf8'));
    const registryVerbs = extractRegistryTopLevelVerbs(installedEntries.map((entry) => entry.command));
    const parity = diffRoutingParity(registryVerbs, dispatcherTokens);
    if (!parity.ok) {
      issues.push({
        severity: 'error',
        code: 'PACKAGE_SMOKE_SURFACE_ROUTING_DRIFT',
        message: `Installed registry top-level verbs and dispatcher routing tokens differ. registryVerbsWithoutRouting: [${parity.registryVerbsWithoutRouting.join(', ')}]; routedVerbsWithoutRegistry: [${parity.routedVerbsWithoutRegistry.join(', ')}].`,
        stepId: 'command-surface-drift'
      });
    }
  }

  const ok = issues.every((issue) => issue.severity !== 'error');
  return {
    ok,
    summary: ok
      ? surface.stdout.trim() === ''
        ? 'Installed command surface stdout capture was empty; source registry ids and installed routing parity hold.'
        : 'Installed command surface matches the source registry and installed routing parity holds.'
      : 'Installed command surface drift detected; see command-surface-drift issues.',
    issues,
    fallbackUsed,
    fallbackReason
  };
}

function evaluateGeneratedInitDocs(initResult: PackageSmokeCommandResult, workspace: string, installPrefix: string): GeneratedInitDocsEvaluation {
  const issues: PackageSmokeIssue[] = [];
  const stepId = 'generated-init-docs';
  let fallbackUsed = false;
  let fallbackReason: string | undefined;
  if (initResult.status !== 0 || initResult.timedOut || !isOkOrEmptyCapturedJsonReport(initResult)) {
    issues.push({
      severity: 'error',
      code: initResult.timedOut ? 'PACKAGE_SMOKE_INIT_DOCS_TIMEOUT' : 'PACKAGE_SMOKE_INIT_DOCS_FAILED',
      message: initResult.timedOut ? 'Installed `hadara init` timed out.' : 'Installed `hadara init --profile standard --json` failed or did not return an ok JSON report.',
      stepId
    });
    return { ok: false, summary: 'Generated init docs could not be created for inspection.', issues };
  }

  const workflowPath = path.join(workspace, 'docs', 'HADARA_WORKFLOW.md');
  let workflow = '';
  try {
    workflow = fs.readFileSync(workflowPath, 'utf8');
  } catch {
    const templateFallback = readInstalledInitTemplateBundle(installPrefix);
    if (initResult.stdout.trim() === '' && templateFallback) {
      fallbackUsed = true;
      fallbackReason = 'Installed init stdout capture was empty; installed template bundle was inspected instead of generated docs.';
      issues.push(emptyStdoutFallbackIssue(stepId, fallbackReason));
      workflow = templateFallback;
    } else {
      issues.push({
        severity: 'error',
        code: 'PACKAGE_SMOKE_INIT_WORKFLOW_MISSING',
        message: 'Generated docs/HADARA_WORKFLOW.md was missing after installed init.',
        stepId
      });
      return { ok: false, summary: 'Generated workflow document was missing after init.', issues };
    }
  }

  const requiredSnippets = [
    'hadara task finalize --task T-XXXX --execute --auto --json',
    '## Slice State',
    'hadara slice add --id M1',
    'hadara slice render --json'
  ];
  for (const snippet of requiredSnippets) {
    if (workflow.includes(snippet)) continue;
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_INIT_DOCS_MISSING_CURRENT_GUIDANCE',
      message: `Generated workflow docs are missing current guidance snippet: ${snippet}.`,
      stepId
    });
  }

  const staleSnippets = [
    'Low-level lifecycle commands are for debugging',
    'hadara task audit-close --task T-XXXX --json'
  ];
  for (const snippet of staleSnippets) {
    if (!workflow.includes(snippet)) continue;
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_INIT_DOCS_STALE_LIFECYCLE_GUIDANCE',
      message: `Generated workflow docs still contain stale lifecycle guidance snippet: ${snippet}.`,
      stepId
    });
  }

  const ok = issues.every((issue) => issue.severity !== 'error');
  return {
    ok,
    summary: ok
      ? fs.existsSync(workflowPath)
        ? 'Generated init workflow docs expose current finalize --auto and slice guidance without stale removed command instructions.'
        : 'Installed init stdout capture was empty; installed template bundle exposes current finalize --auto and slice guidance without stale removed command instructions.'
      : 'Generated init docs drift detected; see generated-init-docs issues.',
    issues,
    fallbackUsed,
    fallbackReason
  };
}

function markEmptyStdoutFallback(
  step: PackageSmokeReport['steps'][number],
  issues: PackageSmokeIssue[],
  stepId: string,
  reason: string
): void {
  step.fallbackUsed = true;
  step.fallbackReason = reason;
  issues.push(emptyStdoutFallbackIssue(stepId, reason));
}

function emptyStdoutFallbackIssue(stepId: string, reason: string): PackageSmokeIssue {
  return {
    severity: 'warning',
    code: 'PACKAGE_SMOKE_EMPTY_STDOUT_FALLBACK_USED',
    message: reason,
    stepId
  };
}

function readInstalledInitTemplateBundle(installPrefix: string): string | null {
  const packageRoot = findInstalledPackageRoot(installPrefix);
  if (!packageRoot) return null;
  const templatePath = path.join(packageRoot, 'dist', 'init', 'templates.js');
  try {
    return fs.readFileSync(templatePath, 'utf8');
  } catch {
    return null;
  }
}

function parsePackTarball(stdout: string, workspace: string): string | undefined {
  try {
    const parsed = JSON.parse(stdout) as unknown;
    if (!Array.isArray(parsed)) return findSingleWorkspaceTarball(workspace);
    const filename = (parsed[0] as { filename?: unknown } | undefined)?.filename;
    if (typeof filename !== 'string' || filename.includes('/') || filename.includes('\\')) return findSingleWorkspaceTarball(workspace);
    return path.join(workspace, filename);
  } catch {
    return findSingleWorkspaceTarball(workspace);
  }
}

function findSingleWorkspaceTarball(workspace: string): string | undefined {
  try {
    const matches = fs.readdirSync(workspace).filter((entry) => entry.endsWith('.tgz'));
    return matches.length === 1 ? path.join(workspace, matches[0]) : undefined;
  } catch {
    return undefined;
  }
}

function isOkJsonReport(stdout: string): boolean {
  try {
    const parsed = JSON.parse(stdout) as { ok?: unknown };
    return parsed.ok === true;
  } catch {
    return false;
  }
}

function isOkOrEmptyCapturedJsonReport(result: PackageSmokeCommandResult): boolean {
  if (result.status !== 0 || result.timedOut) return false;
  return result.stdout.trim() === '' || isOkJsonReport(result.stdout);
}

function safeFileSize(filePath: string): number | undefined {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return undefined;
  }
}

function cleanupWorkspace(
  workspace: { ok: boolean; path: string; cleanupAllowed: boolean },
  keepTemp: boolean
): { ok: boolean; summary: string } {
  if (keepTemp) return { ok: true, summary: 'Disposable workspace retained because --keep-temp was set.' };
  if (!workspace.cleanupAllowed) return { ok: true, summary: 'No disposable workspace cleanup was required.' };
  try {
    fs.rmSync(workspace.path, { recursive: true, force: true });
    return { ok: true, summary: 'Disposable workspace was removed.' };
  } catch {
    return { ok: false, summary: 'Disposable workspace cleanup failed.' };
  }
}

function runCommand(command: string, args: string[], options: { cwd: string; timeoutMs: number; env?: NodeJS.ProcessEnv }): PackageSmokeCommandResult {
  const timer = startMonotonicTimer();
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    encoding: 'utf8',
    timeout: options.timeoutMs,
    maxBuffer: 1024 * 1024 * 4
  });
  const timedOut = result.error?.name === 'TimeoutError' || result.signal === 'SIGTERM';
  const hasNumericStatus = typeof result.status === 'number';
  const spawnFailed = Boolean(result.error) && !timedOut && !hasNumericStatus;
  return {
    status: spawnFailed ? null : (hasNumericStatus ? result.status : null),
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? (spawnFailed ? String(result.error?.message ?? result.error) : ''),
    elapsedMs: timer.elapsedMs(),
    timedOut
  };
}

function npmCommand(): string {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function pythonCommand(): string {
  return process.platform === 'win32' ? 'python.exe' : 'python';
}

function twineCommand(): string {
  return process.platform === 'win32' ? 'twine.exe' : 'twine';
}

function listPythonDistributionArtifacts(distDir: string): string[] {
  try {
    return fs
      .readdirSync(distDir)
      .filter((entry) => entry.endsWith('.whl') || entry.endsWith('.tar.gz') || entry.endsWith('.zip'))
      .map((entry) => path.join(distDir, entry))
      .sort();
  } catch {
    return [];
  }
}

function normalizePackageSmokeProvider(value: string | undefined): 'npm' | 'python' {
  return value === 'python' ? 'python' : 'npm';
}

function installedHadaraCommand(prefix: string): string {
  if (process.platform === 'win32') return path.join(prefix, 'hadara.cmd');
  return path.join(prefix, 'bin', 'hadara');
}

function installedMainJsPath(prefix: string): string | null {
  const packageRoot = findInstalledPackageRoot(prefix);
  if (!packageRoot) return null;
  const mainJsPath = path.join(packageRoot, 'dist', 'cli', 'main.js');
  return fs.existsSync(mainJsPath) ? mainJsPath : null;
}

function installPathEnv(prefix: string, projectRoot?: string): NodeJS.ProcessEnv {
  const binDir = process.platform === 'win32' ? prefix : path.join(prefix, 'bin');
  return {
    ...process.env,
    ...(projectRoot ? { HADARA_PROJECT_ROOT: projectRoot } : {}),
    PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ''}`
  };
}

function workspaceNpmEnv(workspace: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    NPM_CONFIG_CACHE: process.env.NPM_CONFIG_CACHE ?? path.join(workspace, 'npm-cache')
  };
}

function resolveInputPath(projectRoot: string, value: string | undefined): string | undefined {
  if (!value) return undefined;
  return path.isAbsolute(value) ? value : path.resolve(projectRoot, value);
}

function isInsideProject(projectRoot: string, child: string): boolean {
  const relative = path.relative(path.resolve(projectRoot), path.resolve(child));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function inferSourceKind(from: string): PackageSmokeReport['source']['kind'] {
  if (/\.tgz$/i.test(from)) return 'tarball';
  return 'release-artifact';
}

function validateProjectPackageMetadata(projectRoot: string, issues: PackageSmokeIssue[]): void {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>;
  } catch {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_PACKAGE_JSON_MISSING',
      message: 'Package-smoke dry-run requires readable project package.json metadata.'
    });
    return;
  }

  if (parsed.name !== 'hadara') {
    issues.push({
      severity: 'warning',
      code: 'PACKAGE_SMOKE_PACKAGE_NAME_UNEXPECTED',
      message: 'Package metadata name is not hadara.'
    });
  }
  if (!isRecord(parsed.bin) || parsed.bin.hadara !== './dist/cli/main.js') {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_BIN_MISSING',
      message: 'Package metadata must expose bin.hadara at ./dist/cli/main.js before package smoke.'
    });
  }
}

function validateTaskId(taskId: string | undefined, issues: PackageSmokeIssue[]): void {
  if (taskId !== undefined && !/^T-[0-9]{4}$/.test(taskId)) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_TASK_ID_INVALID',
      message: 'Package-smoke task id must look like T-0000.'
    });
  }
}

function validateTimeout(timeoutSeconds: number | undefined, issues: PackageSmokeIssue[]): void {
  if (timeoutSeconds !== undefined && (!Number.isSafeInteger(timeoutSeconds) || timeoutSeconds < 1)) {
    issues.push({
      severity: 'error',
      code: 'PACKAGE_SMOKE_TIMEOUT_INVALID',
      message: 'Package-smoke timeout must be a positive integer number of seconds.'
    });
  }
}

function resolveTaskCapsulePath(projectRoot: string, taskId: string): string {
  try {
    const entry = fs.readdirSync(path.join(projectRoot, 'tasks')).find((name) => name.startsWith(`${taskId}-`));
    if (entry) return `tasks/${entry}`;
  } catch {
    // Fall through to a redacted deterministic preview path.
  }
  return `tasks/${taskId}-package-smoke`;
}

function safeRelativePath(value: string | undefined): string | undefined {
  if (!value || path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value) || value.startsWith('~') || value.startsWith('<') || value.includes('%')) {
    return undefined;
  }
  const normalized = value.split(/[\\/]+/).filter(Boolean).join('/');
  if (!normalized || normalized === '.' || normalized.startsWith('..')) return undefined;
  return normalized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
