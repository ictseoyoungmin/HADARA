import fs from 'node:fs';
import path from 'node:path';
import {
  isStrictReleaseEvidenceProof,
  readReleaseEvidenceRecords,
  ReleaseEvidenceRecord,
  validateReleaseEvidenceArtifact
} from './release-evidence';
import { analyzeAcceptanceReadiness } from '../task/acceptance';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';
import { readMarkdownSection } from './markdown-table';

export interface OperationalDebtRecord {
  id: string;
  title: string;
  source: string;
  category: 'continuity' | 'validation' | 'scope-control' | 'complexity' | 'visibility' | 'environment';
  status: 'tracked' | 'mitigated' | 'candidate';
  severity: 'low' | 'medium' | 'high';
  targetCapability: string;
}

export interface OperationalDebtAggregate {
  total: number;
  open: number;
  tracked: number;
  mitigated: number;
  candidate: number;
  highOpen: number;
  bySeverity: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface CapsuleSizeIndicator {
  taskId: string;
  capsule: string;
  fileCount: number;
  lineCount: number;
  byteCount: number;
  size: 'tiny' | 'standard' | 'large';
}

export interface OperationalDebtReport {
  schemaVersion: 'hadara.operational_debt.v1';
  command: 'operational-debt.report';
  ok: true;
  records: OperationalDebtRecord[];
  aggregate: OperationalDebtAggregate;
  capsuleSizeIndicators: CapsuleSizeIndicator[];
  issues: Array<{
    severity: 'warning';
    code: string;
    message: string;
    path?: string;
  }>;
}

export interface OperationalDebtShowReport {
  schemaVersion: 'hadara.operational_debt.show.v1';
  command: 'operational-debt.show';
  ok: boolean;
  id: string;
  record: OperationalDebtRecord | null;
  issues: Array<{
    severity: 'error';
    code: string;
    message: string;
  }>;
}

export interface ReleaseGateReport {
  schemaVersion: 'hadara.releaseGate.v1';
  command: 'release.gate';
  mode: 'advisory' | 'strict';
  ok: boolean;
  checks: Array<{
    code: string;
    name: string;
    status: 'passed' | 'warning' | 'error';
    summary: string;
  }>;
  issues: Array<{
    severity: 'warning' | 'error';
    code: string;
    message: string;
  }>;
}

interface ReleaseEvidenceMatch {
  record: ReleaseEvidenceRecord;
  artifactSchemaValid?: boolean;
}

export const OPERATIONAL_DEBT_RECORDS: OperationalDebtRecord[] = [
  {
    id: 'OD-0001',
    title: 'Task Capsule Markdown consistency can drift after context compaction',
    source: 'known_issue.log#1',
    category: 'validation',
    status: 'mitigated',
    severity: 'medium',
    targetCapability: 'Task Capsule format validation'
  },
  {
    id: 'OD-0002',
    title: 'New sessions may miss Docker-based validation environment details',
    source: 'known_issue.log#2',
    category: 'environment',
    status: 'mitigated',
    severity: 'medium',
    targetCapability: 'Validation environment handoff'
  },
  {
    id: 'OD-0003',
    title: 'Agents can overfit to the last capsule and miss broader roadmap state',
    source: 'known_issue.log#3',
    category: 'continuity',
    status: 'mitigated',
    severity: 'high',
    targetCapability: 'Required-reading protocol and roadmap-aware handoff guidance'
  },
  {
    id: 'OD-0004',
    title: 'Long-running capsule work can concentrate too many features in one file',
    source: 'known_issue.log#4',
    category: 'complexity',
    status: 'tracked',
    severity: 'medium',
    targetCapability: 'LOC and complexity risk indicators'
  },
  {
    id: 'OD-0005',
    title: 'LOC calculation utility is needed for complexity management',
    source: 'known_issue.log#5',
    category: 'complexity',
    status: 'candidate',
    severity: 'low',
    targetCapability: 'Changed LOC utility'
  },
  {
    id: 'OD-0006',
    title: 'Capsule size should scale with task complexity',
    source: 'known_issue.log#6',
    category: 'scope-control',
    status: 'tracked',
    severity: 'medium',
    targetCapability: 'Capsule size indicator'
  },
  {
    id: 'OD-0007',
    title: 'Task change size should be visible in dashboard or TUI surfaces',
    source: 'known_issue.log#7',
    category: 'visibility',
    status: 'candidate',
    severity: 'low',
    targetCapability: 'Changed-size dashboard signal'
  },
  {
    id: 'OD-0008',
    title: 'ACCEPTANCE.md checkboxes can be marked before implementation evidence exists',
    source: 'known_issue.log#8',
    category: 'validation',
    status: 'mitigated',
    severity: 'high',
    targetCapability: 'Premature acceptance guard and done-level harness validation'
  }
];

export function createOperationalDebtReport(projectRoot: string): OperationalDebtReport {
  const tasks = listTaskCapsules(projectRoot);
  return {
    schemaVersion: 'hadara.operational_debt.v1',
    command: 'operational-debt.report',
    ok: true,
    records: OPERATIONAL_DEBT_RECORDS,
    aggregate: createOperationalDebtAggregate(OPERATIONAL_DEBT_RECORDS),
    capsuleSizeIndicators: tasks.map((task) => measureCapsuleSize(projectRoot, task)),
    issues: tasks.flatMap((task) => detectPrematureAcceptance(projectRoot, task))
  };
}

export function createOperationalDebtShowReport(projectRoot: string, id: string): OperationalDebtShowReport {
  const record = createOperationalDebtReport(projectRoot).records.find((candidate) => candidate.id === id) ?? null;
  return {
    schemaVersion: 'hadara.operational_debt.show.v1',
    command: 'operational-debt.show',
    ok: record !== null,
    id,
    record,
    issues: record
      ? []
      : [
          {
            severity: 'error',
            code: 'OPERATIONAL_DEBT_NOT_FOUND',
            message: `Operational debt record not found: ${id}`
          }
        ]
  };
}

export function createReleaseGateReport(projectRoot: string, mode: ReleaseGateReport['mode'] = 'advisory'): ReleaseGateReport {
  const debt = createOperationalDebtReport(projectRoot);
  const highOpen = debt.records.filter((record) => isOpenDebt(record) && record.severity === 'high');
  const blocking = mode === 'strict' && highOpen.length > 0;
  const readiness = createReleaseReadinessChecks(projectRoot, mode);
  const debtIssues: ReleaseGateReport['issues'] =
    highOpen.length > 0
      ? [
          {
            severity: blocking ? 'error' : 'warning',
            code: 'OPEN_HIGH_OPERATIONAL_DEBT',
            message: `${highOpen.length} open high-severity operational debt record(s) remain.`
          }
        ]
      : [];
  const issues = [...readiness.issues, ...debtIssues];
  return {
    schemaVersion: 'hadara.releaseGate.v1',
    command: 'release.gate',
    mode,
    ok: !blocking && readiness.checks.every((check) => check.status !== 'error'),
    checks: [
      ...readiness.checks,
      {
        code: 'OPEN_HIGH_OPERATIONAL_DEBT',
        name: 'No high severity operational debt',
        status: highOpen.length > 0 ? (blocking ? 'error' : 'warning') : 'passed',
        summary: highOpen.length > 0 ? `${highOpen.map((record) => record.id).join(', ')} remain open.` : 'No open high-severity operational debt records.'
      }
    ],
    issues
  };
}

function createReleaseReadinessChecks(projectRoot: string, mode: ReleaseGateReport['mode']): Pick<ReleaseGateReport, 'checks' | 'issues'> {
  const packageJson = readJsonObject(path.join(projectRoot, 'package.json'));
  const ciWorkflow = readOptionalText(path.join(projectRoot, '.github', 'workflows', 'ci.yml'));
  const v1Schemas = readOptionalText(path.join(projectRoot, 'docs', 'V1_0_IMPLEMENTATION_SCHEMAS.md'));
  const developmentSlices = readOptionalText(path.join(projectRoot, 'docs', 'DEVELOPMENT_SLICES.md'));
  const architecture = readOptionalText(path.join(projectRoot, 'docs', 'ARCHITECTURE.md'));
  const dashboardDesign = readOptionalText(path.join(projectRoot, 'docs', 'design', 'DASHBOARD_DESIGN_NOTES.md'));
  const testStrategy = readOptionalText(path.join(projectRoot, 'docs', 'TEST_STRATEGY.md'));
  const releaseReadiness = readOptionalText(path.join(projectRoot, 'docs', 'RELEASE_READINESS.md'));
  const validationHistory = readOptionalText(path.join(projectRoot, 'docs', 'VALIDATION_HISTORY.md'));
  const licenseText = readOptionalText(path.join(projectRoot, 'LICENSE'));
  const evidence = readReleaseEvidenceRecords(projectRoot);

  const checks: ReleaseGateReport['checks'] = [
    checkPackageBin(packageJson, mode),
    checkPackageScripts(packageJson, mode),
    checkNodePolicy(packageJson, ciWorkflow, mode),
    checkCiWorkflow(ciWorkflow, mode),
    checkCleanCheckoutPolicy(v1Schemas, developmentSlices, testStrategy, mode),
    checkPackageSmokeArtifactBoundary(testStrategy, mode),
    checkPackageSmokeCommandSurface(testStrategy, mode),
    checkPackageMetadataReadiness(packageJson, licenseText, testStrategy, releaseReadiness, validationHistory, mode),
    checkReleaseWorkflowTargetDecision(releaseReadiness, mode),
    checkInstallerSurfaceAndSchema(releaseReadiness, mode),
    checkInstallMatrixSmokePlan(releaseReadiness, mode),
    checkPackageSmokeEvidence(evidence, mode),
    checkCleanCheckoutSmokeEvidence(evidence, mode),
    checkReleaseArtifactEvidence(evidence, mode),
    checkInstallMatrixSmokeEvidence(),
    checkGeneratedArtifactPolicy(architecture, developmentSlices, dashboardDesign, mode),
    checkRemoteCiObservation(testStrategy, validationHistory, mode)
  ];
  const issues = checks
    .filter((check) => check.status !== 'passed')
    .map((check) => ({
      severity: check.status === 'error' ? ('error' as const) : ('warning' as const),
      code: releaseReadinessIssueCode(check.code),
      message: `${check.name}: ${check.summary}`
    }));
  return { checks, issues };
}

function releaseReadinessIssueCode(checkCode: string): string {
  if (checkCode === 'REMOTE_CI_OBSERVATION') return 'REMOTE_CI_OBSERVATION_UNRECORDED';
  if (checkCode === 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY') return 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY_UNCLEAR';
  if (checkCode === 'PACKAGE_SMOKE_COMMAND_SURFACE') return 'PACKAGE_SMOKE_COMMAND_SURFACE_UNCLEAR';
  if (checkCode === 'PACKAGE_METADATA_RELEASE_READINESS') return 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR';
  if (checkCode === 'CI_RELEASE_WORKFLOW_TARGET_DECISION') return 'CI_RELEASE_WORKFLOW_TARGET_DECISION_UNCLEAR';
  if (checkCode === 'INSTALLER_SCRIPT_SURFACE_SCHEMA') return 'INSTALLER_SCRIPT_SURFACE_SCHEMA_UNCLEAR';
  if (checkCode === 'INSTALL_MATRIX_SMOKE_PLAN') return 'INSTALL_MATRIX_SMOKE_PLAN_UNCLEAR';
  if (checkCode === 'PACKAGE_SMOKE_EVIDENCE') return 'PACKAGE_SMOKE_EVIDENCE_MISSING';
  if (checkCode === 'CLEAN_CHECKOUT_SMOKE_EVIDENCE') return 'CLEAN_CHECKOUT_SMOKE_EVIDENCE_MISSING';
  if (checkCode === 'RELEASE_ARTIFACT_EVIDENCE') return 'RELEASE_ARTIFACT_EVIDENCE_MISSING';
  if (checkCode === 'INSTALL_MATRIX_SMOKE_EVIDENCE') return 'INSTALL_MATRIX_SMOKE_EVIDENCE_MISSING';
  return checkCode;
}

function checkPackageBin(packageJson: Record<string, unknown> | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const bin = isRecord(packageJson?.bin) ? packageJson.bin : {};
  const ok = bin.hadara === './dist/cli/main.js';
  return {
    code: 'PACKAGE_BIN_MISSING',
    name: 'Package bin entry',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok ? 'package.json exposes hadara at ./dist/cli/main.js.' : 'package.json must expose bin.hadara as ./dist/cli/main.js.'
  };
}

function checkPackageScripts(packageJson: Record<string, unknown> | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const scripts = isRecord(packageJson?.scripts) ? packageJson.scripts : {};
  const required = ['build', 'test', 'test:contract', 'test:harness', 'check'];
  const missing = required.filter((script) => typeof scripts[script] !== 'string' || scripts[script].trim() === '');
  return {
    code: 'VALIDATION_SCRIPT_MISSING',
    name: 'Package validation scripts',
    status: missing.length === 0 ? 'passed' : readinessFailureStatus(mode),
    summary: missing.length === 0 ? `${required.join(', ')} scripts are defined.` : `Missing package scripts: ${missing.join(', ')}.`
  };
}

function checkNodePolicy(packageJson: Record<string, unknown> | null, ciWorkflow: string | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const devDependencies = isRecord(packageJson?.devDependencies) ? packageJson.devDependencies : {};
  const nodeTypes = String(devDependencies['@types/node'] ?? '');
  const ciUsesNode22 = ciWorkflow !== null && /node-version:\s*22\b/.test(ciWorkflow);
  const ok = nodeTypes.startsWith('^22') && ciUsesNode22;
  return {
    code: 'NODE_POLICY_UNCLEAR',
    name: 'Node version policy',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok ? 'Development typings and CI target Node 22.' : 'Node 22 must be reflected in dev dependencies and CI.'
  };
}

function checkCiWorkflow(ciWorkflow: string | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const missing = [
    ['actions/setup-node@v4', ciWorkflow?.includes('actions/setup-node@v4')],
    ['npm ci', ciWorkflow?.includes('npm ci')],
    ['npm run check', ciWorkflow?.includes('npm run check')]
  ]
    .filter(([, present]) => !present)
    .map(([name]) => name);
  return {
    code: 'CI_CLEAN_INSTALL_UNCLEAR',
    name: 'CI clean install check',
    status: missing.length === 0 ? 'passed' : readinessFailureStatus(mode),
    summary: missing.length === 0 ? 'CI installs dependencies cleanly and runs npm run check.' : `CI workflow is missing: ${missing.join(', ')}.`
  };
}

function checkCleanCheckoutPolicy(
  v1Schemas: string | null,
  developmentSlices: string | null,
  testStrategy: string | null,
  mode: ReleaseGateReport['mode']
): ReleaseGateReport['checks'][number] {
  const strictGateCommandDocumented = includesAny(testStrategy, [
    'node --import tsx tools/dev-surfaces.ts release gate --mode strict --json',
    'node dist/cli/main.js release gate --mode strict --json'
  ]);
  const ok =
    includesAll(v1Schemas, ['npm ci', 'npm run check', 'doctor --json', 'status --json']) &&
    includesAny(developmentSlices, ['clean checkout smoke', 'clean-checkout smoke']) &&
    includesAll(testStrategy, [
      'Clean Checkout Package Smoke Plan',
      'npm ci',
      'npm run build',
      'node dist/cli/main.js doctor --json',
      'node dist/cli/main.js status --json',
      'no packaging or release execution'
    ]) &&
    strictGateCommandDocumented;
  return {
    code: 'CLEAN_CHECKOUT_SMOKE_UNCLEAR',
    name: 'Clean checkout smoke policy',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Release planning documents the clean-checkout package smoke sequence.'
      : 'Release planning must document clean-checkout package smoke expectations.'
  };
}

function checkPackageSmokeArtifactBoundary(testStrategy: string | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const ok = includesAll(testStrategy, [
    'Executable Package Smoke Artifact Boundary',
    'Allowed workspace',
    '/tmp/hadara-package-smoke/<run-id>',
    'Package artifact paths',
    'tasks/<task-id>/artifacts/package-smoke/',
    'Redaction and audit handling',
    'Evidence/report shape',
    'hadara.packageSmoke.v1',
    'performs no package-smoke execution'
  ]);
  return {
    code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY',
    name: 'Package smoke artifact boundary',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Executable package-smoke artifact and evidence boundaries are documented before implementation.'
      : 'Executable package-smoke workspace, artifact, redaction/audit, and evidence boundaries must be documented before implementation.'
  };
}

function checkPackageSmokeCommandSurface(testStrategy: string | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const dryRunCommandDocumented = includesAny(testStrategy, [
    'node --import tsx tools/dev-surfaces.ts smoke package --dry-run --json',
    'hadara smoke package --dry-run --json'
  ]);
  const taskCommandDocumented = includesAny(testStrategy, [
    'node --import tsx tools/dev-surfaces.ts smoke package --task <task-id> --json',
    'hadara smoke package --task <task-id> --json'
  ]);
  const workspaceCommandDocumented = includesAny(testStrategy, [
    'node --import tsx tools/dev-surfaces.ts smoke package --workspace /tmp/hadara-package-smoke/<run-id> --json',
    'hadara smoke package --workspace /tmp/hadara-package-smoke/<run-id> --json'
  ]);
  const keepTempCommandDocumented = includesAny(testStrategy, [
    'node --import tsx tools/dev-surfaces.ts smoke package --keep-temp --json',
    'hadara smoke package --keep-temp --json'
  ]);
  const releaseSmokeWarningDocumented = includesAny(testStrategy, [
    'Do not use `release smoke` as the primary command surface',
    'Do not use `hadara release smoke` as the primary command surface'
  ]);
  const noReleaseGateExecutionDocumented = includesAny(testStrategy, [
    'The release gate must not call `node --import tsx tools/dev-surfaces.ts smoke package`',
    'The release gate must not call `hadara smoke package`'
  ]);
  const ok =
    includesAll(testStrategy, [
      'Package Smoke Command Surface',
      '`--timeout <seconds>`',
      '`--attach-evidence`',
      '`--private-logs`',
      'Package smoke must not be callable from MCP by default'
    ]) &&
    dryRunCommandDocumented &&
    taskCommandDocumented &&
    workspaceCommandDocumented &&
    keepTempCommandDocumented &&
    releaseSmokeWarningDocumented &&
    noReleaseGateExecutionDocumented &&
    hasVersionedHadaraTarballExample(testStrategy);
  return {
    code: 'PACKAGE_SMOKE_COMMAND_SURFACE',
    name: 'Package smoke command surface',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Package-smoke command naming, flags, approval, cleanup, failure, evidence, and MCP boundaries are documented.'
      : 'Package-smoke command naming, flags, approval, cleanup, failure, evidence, and MCP boundaries must be documented before implementation.'
  };
}

function checkPackageMetadataReadiness(
  packageJson: Record<string, unknown> | null,
  licenseText: string | null,
  testStrategy: string | null,
  releaseReadiness: string | null,
  validationHistory: string | null,
  mode: ReleaseGateReport['mode']
): ReleaseGateReport['checks'][number] {
  const bin = isRecord(packageJson?.bin) ? packageJson.bin : {};
  const files = Array.isArray(packageJson?.files) ? packageJson.files.filter((entry): entry is string => typeof entry === 'string') : [];
  const currentVersion = typeof packageJson?.version === 'string' ? packageJson.version : 'unknown';
  const bootstrapMetadataOk =
    packageJson?.name === 'hadara' &&
    packageJson?.version === '0.0.0-bootstrap' &&
    packageJson?.private === true &&
    bin.hadara === './dist/cli/main.js';
  const publishablePackageMetadataOk =
    packageJson?.name === 'hadara' &&
    /^0\.\d+\.\d+(?:-rc\.\d+)?$/.test(String(packageJson?.version ?? '')) &&
    packageJson?.private === false &&
    packageJson?.license === 'MIT' &&
    bin.hadara === './dist/cli/main.js' &&
    includesAll(files.join('\n'), ['dist/', 'README.md', 'LICENSE', 'package.json']) &&
    licenseText !== null &&
    includesAny(validationHistory, ['hadara.packageSmoke.v1', 'PACKAGE_SMOKE_EVIDENCE']);
  const metadataMarkers = [
    'Package Metadata Release Readiness',
    'Package name decision: `hadara`',
    'npm registry observation:',
    `Current version is \`${currentVersion}\``,
    'Current package is `private: false`',
    'Current binary remains `bin.hadara` at `./dist/cli/main.js`',
    'Current `files` whitelist is `dist/`, `README.md`, `LICENSE`, and `package.json`',
    'Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability',
    'Release-candidate metadata mode: version `0.x.y-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present',
    'Scoped fallback decision: do not silently switch names',
    'Version policy:',
    'T-0142 transitions `private` to false only after the package files whitelist, root README, license decision, and package-smoke evidence gates exist',
    'Final `files` whitelist target: `dist/`, `README.md`, `LICENSE`, `package.json`, plus installer and portable files only after those files exist',
    'Do not add `files` entries for missing installer or portable paths in T-0127',
    'MIT license decision: adopt MIT; `LICENSE` exists and is included in the package whitelist',
    'Publish target decision: npm package first, GitHub Release second, Docker image deferred',
    'Installed CLI verification must use `hadara doctor --json`',
    'T-0142 performs no publish, no GitHub Release creation, no Docker image build, and no registry mutation; it transitions metadata and regenerates reduced release evidence only',
    'Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`'
  ];
  const docsOk = includesAll(testStrategy, metadataMarkers) || includesAll(releaseReadiness, metadataMarkers);
  const ok = (bootstrapMetadataOk || publishablePackageMetadataOk) && docsOk;
  return {
    code: 'PACKAGE_METADATA_RELEASE_READINESS',
    name: 'Package metadata release readiness',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Package name, publishable version, private transition, files target, license path, publish target, and installed CLI verification decisions are documented without publishing.'
      : 'Package metadata release-readiness decisions must be documented before publishability is accepted.'
  };
}

function hasVersionedHadaraTarballExample(text: string | null): boolean {
  return text !== null && (
    /node --import tsx tools\/dev-surfaces\.ts smoke package --from \.\/dist-release\/hadara-[^\s/]+\.tgz --json/.test(text) ||
    /hadara smoke package --from \.\/dist-release\/hadara-[^\s/]+\.tgz --json/.test(text)
  );
}

function checkInstallerSurfaceAndSchema(releaseReadiness: string | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const ok = includesAll(releaseReadiness, [
    'Installer Script Surface and Schema',
    '`scripts/install.sh`',
    '`scripts/install.ps1`',
    '`portable/bin/hadara`',
    '`portable/bin/hadara.cmd`',
    '`portable/bin/hadara.ps1`',
    'Installer scripts install or plan installation from a tarball or directory',
    'Installer scripts must support dry-run planning before mutation',
    'Installer scripts must emit `hadara.install.plan.v1` JSON for dry-run planning',
    'Installer scripts must not use `sudo` by default',
    'Installer scripts must not force `npm install -g`',
    'Installer scripts must not mutate shell profiles or PATH by default',
    'Portable launchers invoke an installed or portable HADARA bundle',
    'Portable launchers do not install dependencies',
    'Portable launchers do not mutate PATH',
    'Portable launchers do not modify project files',
    'Linux/POSIX/WSL prefix suggestion: `~/.local/share/hadara`',
    'Linux/POSIX/WSL bin link suggestion: `~/.local/bin/hadara`',
    'Windows prefix suggestion: `%LOCALAPPDATA%\\HADARA`',
    'Windows cmd launcher suggestion: `%LOCALAPPDATA%\\HADARA\\bin\\hadara.cmd`',
    'Windows PowerShell launcher suggestion: `%LOCALAPPDATA%\\HADARA\\bin\\hadara.ps1`',
    'Default POSIX/WSL/Windows install paths are suggestions, not silent decisions',
    'Windows USB portable root: user-selected removable drive, for example `L:\\HADARA`',
    'WSL USB portable root for `--platform usb`: user-selected mounted removable drive, for example `/mnt/l/HADARA`',
    'The drive letter or mount path must not be assumed',
    'USB install roots must be explicitly provided',
    '`--platform wsl` uses Linux-style default install suggestions',
    'Installer plans must validate Node 22',
    'WSL install plans must reject Windows `node.exe` shims',
    'Schema id: `hadara.install.plan.v1`',
    'Target paths must be public path references, not raw absolute path strings',
    '`target.prefix.pathRedacted: true` is required for public install-plan output',
    '`target.launcher.pathRedacted: true` is required for public install-plan output',
    '`source.pathRedacted: true` is required when source path details appear in public install-plan output',
    '`execution.executeEnabled` must state whether mutation is available to the current command implementation',
    '`mode: execute` is schema-reserved only until an explicit later capsule implements mutation',
    'T-0129 dry-run implementation must reject execute mode or return `INSTALL_EXECUTION_DISABLED`',
    'The schema fixture documents a future execute mode but does not authorize installer execution',
    'The release gate checks installer surface and schema markers only',
    'The release gate must not execute `scripts/install.sh`',
    'The release gate must not execute `scripts/install.ps1`'
  ]);
  return {
    code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA',
    name: 'Installer script surface and schema',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Installer script paths, portable launchers, install locations, Node/WSL checks, and install plan schema are documented without install mutation.'
      : 'Installer script paths, portable launchers, install locations, Node/WSL checks, and install plan schema must be documented before implementation.'
  };
}

function checkReleaseWorkflowTargetDecision(releaseReadiness: string | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const ok =
    includesAll(releaseReadiness, [
    'CI Release Workflow Target Decision',
    'Primary release target: npm package',
    'Secondary release target: GitHub Release with tarball, checksum, and manifest',
    'Deferred release target: Docker image',
    'npm publish token name: `NPM_TOKEN`',
    'GitHub Release token name: `GITHUB_TOKEN` or `HADARA_GITHUB_RELEASE_TOKEN`',
    'Token values must never be written to repository files, public evidence, release artifacts, logs, manifests, or context export',
    'Publish/deploy remains explicit approval only',
    'T-0139 performs no publish, no GitHub Release creation, no Docker image build, no registry mutation, no GitHub API call, and no token loading',
    'Evidence freshness must compare evidence to the release candidate window',
    'Evidence cross-check should follow this order: record exists, artifact exists, artifact schema valid, `sourceReport.ok` true when present, category/mode/result match the expected check'
    ]) &&
    includesAny(releaseReadiness, [
      'Release artifact evidence flow must be explicit: run `node --import tsx tools/dev-surfaces.ts release artifact --execute --json --output dist-release`',
      'Release artifact evidence flow must be explicit: run `hadara release artifact --execute --json --output dist-release`',
      'Release artifact evidence flow is explicit and must avoid self-invalidating clean-tree loops.'
    ]);
  return {
    code: 'CI_RELEASE_WORKFLOW_TARGET_DECISION',
    name: 'CI/release workflow target decision',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Release targets, token names, approval boundary, and T-0140 evidence hardening requirements are documented.'
      : 'Release workflow targets, token names, approval boundary, and evidence hardening requirements must be documented before release scripts.'
  };
}

function checkInstallMatrixSmokePlan(releaseReadiness: string | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const ok = includesAll(releaseReadiness, [
    'Install Matrix Smoke Plan',
    'T-0130 defines install-matrix smoke planning only',
    'Matrix row: Linux source checkout',
    'Matrix row: Linux package install',
    'Matrix row: WSL source checkout',
    'Matrix row: Windows source checkout',
    'Matrix row: Windows package install',
    'Matrix row: USB portable on Windows',
    'Matrix row: USB portable on WSL',
    'Matrix row: installed CLI major-feature smoke',
    'Docker/Linux validation does not replace real Windows validation',
    'USB rows must require explicit user-selected USB roots',
    'Package-install rows are blocked until package smoke and release artifacts exist',
    'Matrix evidence must record platform, source kind, installer/package form, command form, and reduced public result',
    'Raw logs and private paths must stay temporary or private/local',
    'The release gate must not execute install matrix smoke'
  ]);
  return {
    code: 'INSTALL_MATRIX_SMOKE_PLAN',
    name: 'Install matrix smoke plan',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Install matrix rows, platform boundaries, evidence shape, and non-execution release-gate behavior are documented.'
      : 'Install matrix smoke rows and evidence boundaries must be documented before execution.'
  };
}

function checkPackageSmokeEvidence(evidence: ReleaseEvidenceRecord[], mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const match = findLatestEvidence(evidence, (record) => isStrictReleaseEvidenceProof(record, { category: 'package-smoke', mode: 'local' }));
  return createEvidenceCheck(
    'PACKAGE_SMOKE_EVIDENCE',
    'Package smoke evidence',
    match,
    mode,
    'Latest package-smoke evidence is recorded',
    'Record passed public package-smoke execution evidence before release readiness is frozen.'
  );
}

function checkCleanCheckoutSmokeEvidence(evidence: ReleaseEvidenceRecord[], mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const match = findLatestEvidence(evidence, (record) => isStrictReleaseEvidenceProof(record, { category: 'clean-checkout-smoke', mode: 'execute' }));
  return createEvidenceCheck(
    'CLEAN_CHECKOUT_SMOKE_EVIDENCE',
    'Clean checkout smoke evidence',
    match,
    mode,
    'Latest clean-checkout smoke evidence is recorded',
    'Record passed public clean-checkout smoke evidence before release readiness is frozen.'
  );
}

function checkReleaseArtifactEvidence(evidence: ReleaseEvidenceRecord[], mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const match = findLatestEvidence(evidence, (record) => isStrictReleaseEvidenceProof(record, { category: 'release-artifact', mode: 'execute' }));
  return createEvidenceCheck(
    'RELEASE_ARTIFACT_EVIDENCE',
    'Release artifact evidence',
    match,
    mode,
    'Latest release artifact build evidence is recorded',
    'Record passed public release artifact build evidence before release readiness is frozen.'
  );
}

function checkInstallMatrixSmokeEvidence(): ReleaseGateReport['checks'][number] {
  return {
    code: 'INSTALL_MATRIX_SMOKE_EVIDENCE',
    name: 'Install matrix smoke evidence',
    status: 'passed',
    summary: 'Install-matrix evidence enforcement is deferred until an executable install-matrix smoke surface exists.'
  };
}

function createEvidenceCheck(
  code: string,
  name: string,
  match: ReleaseEvidenceMatch | null,
  mode: ReleaseGateReport['mode'],
  passedSummary: string,
  missingSummary: string
): ReleaseGateReport['checks'][number] {
  if (!match) {
    return {
      code,
      name,
      status: readinessFailureStatus(mode),
      summary: missingSummary
    };
  }
  const artifactNote =
    match.artifactSchemaValid === undefined ? '' : match.artifactSchemaValid ? '; linked summary artifact is schema-valid' : '; linked summary artifact was not schema-valid';
  return {
    code,
    name,
    status: match.artifactSchemaValid === false ? readinessFailureStatus(mode) : 'passed',
    summary: `${passedSummary}: ${match.record.taskId} at ${match.record.time}${artifactNote}.`
  };
}

function checkGeneratedArtifactPolicy(
  architecture: string | null,
  developmentSlices: string | null,
  dashboardDesign: string | null,
  mode: ReleaseGateReport['mode']
): ReleaseGateReport['checks'][number] {
  const ok =
    includesAll(developmentSlices, ['contextPath: null', 'without writing generated context files']) &&
    includesAll(architecture, ['.hadara/local/tui/']) &&
    includesAll(dashboardDesign, ['read-only local API routes']);
  return {
    code: 'GENERATED_ARTIFACT_POLICY_UNCLEAR',
    name: 'Generated artifact policy',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Context export, dashboard APIs, and TUI cache boundaries are documented as non-committed/generated or read-only surfaces.'
      : 'Generated context/dashboard/cache artifact boundaries must be documented before release.'
  };
}

function checkRemoteCiObservation(
  testStrategy: string | null,
  validationHistory: string | null,
  mode: ReleaseGateReport['mode']
): ReleaseGateReport['checks'][number] {
  const ok =
    includesAll(testStrategy, ['Remote CI observation', 'local Docker validation remains the primary reproducible check']) &&
    includesAll(validationHistory, ['GitHub Actions CI run', 'actions/runs/']);
  return {
    code: 'REMOTE_CI_OBSERVATION',
    name: 'Remote CI observation evidence',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Remote GitHub Actions status is recorded separately from local release-gate checks.'
      : 'Record a recent remote GitHub Actions observation and keep it distinct from local Docker validation.'
  };
}

function findLatestEvidence(evidence: ReleaseEvidenceRecord[], predicate: (record: ReleaseEvidenceRecord) => boolean): ReleaseEvidenceMatch | null {
  const matches = evidence.filter(predicate).sort((a, b) => b.time.localeCompare(a.time));
  const record = matches[0];
  if (!record) return null;
  return {
    record,
    ...validateLinkedEvidenceArtifact(record)
  };
}

function validateLinkedEvidenceArtifact(record: ReleaseEvidenceRecord): { artifactSchemaValid?: boolean } {
  const validation = validateReleaseEvidenceArtifact(record);
  return validation.exists ? { artifactSchemaValid: validation.schemaValid === true } : {};
}

function readinessFailureStatus(mode: ReleaseGateReport['mode']): 'warning' | 'error' {
  return mode === 'strict' ? 'error' : 'warning';
}

function readJsonObject(filePath: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readOptionalText(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function includesAll(text: string | null, needles: string[]): boolean {
  return text !== null && needles.every((needle) => text.includes(needle));
}

function includesAny(text: string | null, needles: string[]): boolean {
  return text !== null && needles.some((needle) => text.includes(needle));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function createOperationalDebtAggregate(records: OperationalDebtRecord[]): OperationalDebtAggregate {
  const aggregate: OperationalDebtAggregate = {
    total: records.length,
    open: 0,
    tracked: 0,
    mitigated: 0,
    candidate: 0,
    highOpen: 0,
    bySeverity: {
      high: 0,
      medium: 0,
      low: 0
    }
  };
  for (const record of records) {
    aggregate[record.status] += 1;
    aggregate.bySeverity[record.severity] += 1;
    if (isOpenDebt(record)) aggregate.open += 1;
    if (isOpenDebt(record) && record.severity === 'high') aggregate.highOpen += 1;
  }
  return aggregate;
}

function isOpenDebt(record: OperationalDebtRecord): boolean {
  return record.status !== 'mitigated';
}

function measureCapsuleSize(projectRoot: string, task: TaskCapsule): CapsuleSizeIndicator {
  const files = fs
    .readdirSync(task.dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(task.dir, entry.name));
  const totals = files.reduce(
    (acc, filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        bytes: acc.bytes + Buffer.byteLength(content, 'utf8'),
        lines: acc.lines + countLines(content)
      };
    },
    { bytes: 0, lines: 0 }
  );
  return {
    taskId: task.id,
    capsule: toPortablePath(path.relative(projectRoot, task.dir)),
    fileCount: files.length,
    lineCount: totals.lines,
    byteCount: totals.bytes,
    size: classifyCapsuleSize(totals.lines)
  };
}

function detectPrematureAcceptance(
  projectRoot: string,
  task: TaskCapsule
): OperationalDebtReport['issues'] {
  const taskPath = path.join(task.dir, 'TASK.md');
  const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
  const evidencePath = path.join(task.dir, 'evidence.jsonl');
  if (!fs.existsSync(taskPath)) return [];
  const usesLegacyAcceptance = fs.existsSync(acceptancePath);
  const sourcePath = usesLegacyAcceptance ? acceptancePath : taskPath;
  const taskStatus = readTaskStatus(taskPath);
  const acceptance = usesLegacyAcceptance ? fs.readFileSync(acceptancePath, 'utf8') : readMarkdownSection(fs.readFileSync(taskPath, 'utf8'), '## Acceptance');
  const checkedCount = countCompletedAcceptanceItems(acceptance);
  const evidenceCount = countValidEvidenceRecords(evidencePath);
  if (checkedCount > 0 && (taskStatus !== 'Done' || evidenceCount === 0)) {
    return [
      {
        severity: 'warning',
        code: 'PREMATURE_ACCEPTANCE_CHECKED',
        message: `${task.id} has checked acceptance boxes before Done status or evidence records.`,
        path: toPortablePath(path.relative(projectRoot, sourcePath))
      }
    ];
  }
  return [];
}

function classifyCapsuleSize(lineCount: number): CapsuleSizeIndicator['size'] {
  if (lineCount < 80) return 'tiny';
  if (lineCount > 700) return 'large';
  return 'standard';
}

function readTaskStatus(taskPath: string): string {
  const content = fs.readFileSync(taskPath, 'utf8');
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  const sectionStatus = match?.[1]?.trim().split(/\r?\n/)[0]?.trim();
  if (sectionStatus === 'Done') return sectionStatus;
  const metadataStatus = content.match(/^\|\s*Status\s*\|\s*([^|]+?)\s*\|$/m)?.[1]?.trim();
  return metadataStatus || sectionStatus || 'Unknown';
}

function countCompletedAcceptanceItems(content: string): number {
  const checklistCount = content.match(/-\s+\[[xX]\]/g)?.length ?? 0;
  const tableCount = analyzeAcceptanceReadiness(content).rows.filter((row) => row.status === 'Met').length;
  return checklistCount + tableCount;
}

function countValidEvidenceRecords(evidencePath: string): number {
  if (!fs.existsSync(evidencePath)) return 0;
  return fs
    .readFileSync(evidencePath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => {
      try {
        const record = JSON.parse(line);
        return (
          record &&
          typeof record === 'object' &&
          record.schemaVersion === 'hadara.evidence.v1' &&
          typeof record.time === 'string' &&
          typeof record.taskId === 'string' &&
          typeof record.summary === 'string' &&
          typeof record.visibility === 'string'
        );
      } catch {
        return false;
      }
    }).length;
}

function countLines(content: string): number {
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
