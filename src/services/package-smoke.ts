import fs from 'node:fs';
import path from 'node:path';
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
  mode: 'dry-run';
  readOnly: true;
  execution: {
    npmPackExecuted: false;
    packageInstallExecuted: false;
    featureSmokeExecuted: false;
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
    status: 'planned' | 'skipped';
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

function createDryRunSteps(sourceKind: PackageSmokeReport['source']['kind'], options: PackageSmokeDryRunOptions): PackageSmokeReport['steps'] {
  const packStatus = sourceKind === 'source-checkout' ? 'planned' : 'skipped';
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
      status: options.attachEvidence === true && options.taskId ? 'planned' : 'skipped',
      summary:
        options.attachEvidence === true && options.taskId
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
