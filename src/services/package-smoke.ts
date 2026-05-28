import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { HadaraPaths } from '../core/paths';
import { assertSchema } from '../core/schema';

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
  mode: 'dry-run' | 'local';
  readOnly: boolean;
  execution: {
    npmPackExecuted: boolean;
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
  }>;
  artifacts: Array<{
    kind: 'summary' | 'command-log' | 'package-artifact' | 'install-tree';
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
  issues: PackageSmokeIssue[];
}

export interface PackageSmokeDryRunOptions {
  paths: HadaraPaths;
  dryRun?: boolean;
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

  const report: PackageSmokeReport = {
    schemaVersion: 'hadara.packageSmoke.v1',
    command: 'package.smoke',
    ok: false,
    mode: 'dry-run',
    readOnly: true,
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
  const issues: PackageSmokeIssue[] = [];
  validateTaskId(options.taskId, issues);
  validateTimeout(options.timeoutSeconds, issues);

  const source = createSource(options.paths.projectRoot, options.from, issues);
  const workspaceSetup = prepareExecutionWorkspace(options.paths.projectRoot, options.workspace, options.keepTemp === true, issues);
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

  try {
    if (issues.some((issue) => issue.severity === 'error') || !workspaceSetup.ok) {
      pushSkippedExecutionSteps(steps);
    } else {
      if (source.kind === 'source-checkout') {
        execution.npmPackExecuted = true;
        const pack = runner(npmCommand(), ['pack', '--json', '--pack-destination', workspaceSetup.path], {
          cwd: options.paths.projectRoot,
          timeoutMs
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
          timeoutMs
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
          const doctor = runner(installedBin, ['doctor', '--json', '--project', options.paths.projectRoot], {
            cwd: workspaceSetup.path,
            timeoutMs,
            env: installPathEnv(installPrefix)
          });
          const doctorStep = commandStep('doctor', 'Installed HADARA doctor', 'hadara doctor --json --project <redacted-project>', doctor);
          if (!isOkJsonReport(doctor.stdout) || doctor.status !== 0) {
            doctorStep.status = 'failed';
            doctorStep.summary = doctor.timedOut ? 'Installed doctor timed out.' : 'Installed doctor did not return an ok JSON report.';
            issues.push({
              severity: 'error',
              code: doctor.timedOut ? 'PACKAGE_SMOKE_DOCTOR_TIMEOUT' : 'PACKAGE_SMOKE_DOCTOR_FAILED',
              message: doctor.timedOut ? 'Installed hadara doctor timed out.' : 'Installed hadara doctor failed or returned non-ok JSON.',
              stepId: 'doctor'
            });
          } else {
            doctorStep.summary = 'Installed hadara doctor returned an ok reduced JSON report.';
          }
          steps.push(doctorStep);

          execution.featureSmokeExecuted = true;
          const smoke = runner(installedBin, ['smoke', 'run', '--profile', 'core', '--json', '--project', options.paths.projectRoot], {
            cwd: workspaceSetup.path,
            timeoutMs,
            env: installPathEnv(installPrefix)
          });
          const smokeStep = commandStep('feature-smoke-core', 'Core feature smoke via installed command', 'hadara smoke run --profile core --json --project <redacted-project>', smoke);
          if (!isOkJsonReport(smoke.stdout) || smoke.status !== 0) {
            smokeStep.status = 'failed';
            smokeStep.summary = smoke.timedOut ? 'Installed core feature smoke timed out.' : 'Installed core feature smoke did not return an ok JSON report.';
            issues.push({
              severity: 'error',
              code: smoke.timedOut ? 'PACKAGE_SMOKE_FEATURE_SMOKE_TIMEOUT' : 'PACKAGE_SMOKE_FEATURE_SMOKE_FAILED',
              message: smoke.timedOut ? 'Installed core feature smoke timed out.' : 'Installed core feature smoke failed or returned non-ok JSON.',
              stepId: 'feature-smoke-core'
            });
          } else {
            smokeStep.summary = 'Installed command-form core feature smoke returned an ok reduced JSON report.';
          }
          steps.push(smokeStep);
        } else {
          steps.push(
            {
              id: 'doctor',
              label: 'Installed HADARA doctor',
              command: 'hadara doctor --json --project <redacted-project>',
              status: 'skipped',
              summary: 'Skipped because isolated package install failed.'
            },
            {
              id: 'feature-smoke-core',
              label: 'Core feature smoke via installed command',
              command: 'hadara smoke run --profile core --json --project <redacted-project>',
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
            command: 'hadara doctor --json --project <redacted-project>',
            status: 'skipped',
            summary: 'Skipped because no package tarball was available.'
          },
          {
            id: 'feature-smoke-core',
            label: 'Core feature smoke via installed command',
            command: 'hadara smoke run --profile core --json --project <redacted-project>',
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

  if (options.attachEvidence === true && options.taskId && options.noEvidence !== true) {
    issues.push({
      severity: 'warning',
      code: 'PACKAGE_SMOKE_EVIDENCE_DEFERRED',
      message: 'Package-smoke evidence attachment remains deferred to the smoke evidence integration capsule.',
      stepId: 'evidence'
    });
  }

  const report: PackageSmokeReport = {
    schemaVersion: 'hadara.packageSmoke.v1',
    command: 'package.smoke',
    ok: issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status !== 'failed'),
    mode: 'local',
    readOnly: false,
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

  assertSchema('hadara.packageSmoke.v1', report);
  return report;
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
      command: 'hadara doctor --json --project <redacted-project>',
      status: 'skipped',
      summary: 'Skipped because package-smoke setup failed.'
    },
    {
      id: 'feature-smoke-core',
      label: 'Core feature smoke via installed command',
      command: 'hadara smoke run --profile core --json --project <redacted-project>',
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

function parsePackTarball(stdout: string, workspace: string): string | undefined {
  try {
    const parsed = JSON.parse(stdout) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    const filename = (parsed[0] as { filename?: unknown } | undefined)?.filename;
    if (typeof filename !== 'string' || filename.includes('/') || filename.includes('\\')) return undefined;
    return path.join(workspace, filename);
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
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    encoding: 'utf8',
    timeout: options.timeoutMs,
    maxBuffer: 1024 * 1024 * 4
  });
  return {
    status: typeof result.status === 'number' ? result.status : null,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    elapsedMs: Date.now() - started,
    timedOut: result.error?.name === 'TimeoutError' || result.signal === 'SIGTERM'
  };
}

function npmCommand(): string {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function installedHadaraCommand(prefix: string): string {
  if (process.platform === 'win32') return path.join(prefix, 'hadara.cmd');
  return path.join(prefix, 'bin', 'hadara');
}

function installPathEnv(prefix: string): NodeJS.ProcessEnv {
  const binDir = process.platform === 'win32' ? prefix : path.join(prefix, 'bin');
  return {
    ...process.env,
    PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ''}`
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
