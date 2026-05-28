import fs from 'node:fs';
import path from 'node:path';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';

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
  const projectState = readOptionalText(path.join(projectRoot, 'docs', 'PROJECT_STATE.md'));
  const testStrategy = readOptionalText(path.join(projectRoot, 'docs', 'TEST_STRATEGY.md'));
  const releaseReadiness = readOptionalText(path.join(projectRoot, 'docs', 'RELEASE_READINESS.md'));
  const validationHistory = readOptionalText(path.join(projectRoot, 'docs', 'VALIDATION_HISTORY.md'));
  const licenseText = readOptionalText(path.join(projectRoot, 'LICENSE'));

  const checks: ReleaseGateReport['checks'] = [
    checkPackageBin(packageJson, mode),
    checkPackageScripts(packageJson, mode),
    checkNodePolicy(packageJson, ciWorkflow, mode),
    checkCiWorkflow(ciWorkflow, mode),
    checkCleanCheckoutPolicy(v1Schemas, developmentSlices, testStrategy, mode),
    checkPackageSmokeArtifactBoundary(testStrategy, mode),
    checkPackageSmokeCommandSurface(testStrategy, mode),
    checkPackageMetadataReadiness(packageJson, licenseText, testStrategy, releaseReadiness, validationHistory, mode),
    checkInstallerSurfaceAndSchema(releaseReadiness, mode),
    checkGeneratedArtifactPolicy(projectState, developmentSlices, mode),
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
  if (checkCode === 'INSTALLER_SCRIPT_SURFACE_SCHEMA') return 'INSTALLER_SCRIPT_SURFACE_SCHEMA_UNCLEAR';
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
  const ok =
    includesAll(v1Schemas, ['npm ci', 'npm run check', 'doctor --json', 'ops status --json']) &&
    includesAny(developmentSlices, ['clean checkout smoke', 'clean-checkout smoke']) &&
    includesAll(testStrategy, [
      'Clean Checkout Package Smoke Plan',
      'npm ci',
      'npm run build',
      'node dist/cli/main.js doctor --json',
      'node dist/cli/main.js ops status --json',
      'node dist/cli/main.js release gate --mode strict --json',
      'no packaging or release execution'
    ]);
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
  const ok = includesAll(testStrategy, [
    'Package Smoke Command Surface',
    'hadara package smoke --dry-run --json',
    'hadara package smoke --task <task-id> --json',
    'hadara package smoke --workspace /tmp/hadara-package-smoke/<run-id> --json',
    'hadara package smoke --from ./dist-release/hadara-0.1.0-rc.0.tgz --json',
    'hadara package smoke --keep-temp --json',
    'Do not use `hadara release smoke` as the primary command surface',
    '`--timeout <seconds>`',
    '`--attach-evidence`',
    '`--private-logs`',
    'Package smoke must not be callable from MCP by default',
    'The release gate must not call `hadara package smoke`'
  ]);
  return {
    code: 'PACKAGE_SMOKE_COMMAND_SURFACE',
    name: 'Package smoke command surface',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? '`hadara package smoke` command naming, flags, approval, cleanup, failure, evidence, and MCP boundaries are documented.'
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
  const bootstrapMetadataOk =
    packageJson?.name === 'hadara' &&
    packageJson?.version === '0.0.0-bootstrap' &&
    packageJson?.private === true &&
    bin.hadara === './dist/cli/main.js';
  const releaseCandidateMetadataOk =
    packageJson?.name === 'hadara' &&
    /^0\.1\.0-rc\.\d+$/.test(String(packageJson?.version ?? '')) &&
    packageJson?.private === false &&
    packageJson?.license === 'MIT' &&
    bin.hadara === './dist/cli/main.js' &&
    includesAll(files.join('\n'), ['dist/', 'README.md', 'LICENSE', 'package.json']) &&
    licenseText !== null &&
    includesAny(validationHistory, ['hadara.packageSmoke.v1', 'PACKAGE_SMOKE_EVIDENCE']);
  const metadataMarkers = [
    'Package Metadata Release Readiness',
    'Package name decision: `hadara`',
    'npm registry observation: `npm view hadara name version --registry=https://registry.npmjs.org` returned 404 on 2026-05-28',
    'Current version remains `0.0.0-bootstrap`',
    'Current package remains `private: true`',
    'Current binary remains `bin.hadara` at `./dist/cli/main.js`',
    'Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability',
    'Release-candidate metadata mode: version `0.1.0-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present',
    'Scoped fallback decision: do not silently switch names',
    'Version policy: first release-candidate target is `0.1.0-rc.0`; first stable target is `0.1.0`',
    '`private: true` remains until the package files whitelist, root README, license decision, and package-smoke dry-run evidence are complete',
    'Final `files` whitelist target: `dist/`, `README.md`, `LICENSE`, `package.json`, plus installer and portable files only after those files exist',
    'Do not add `files` entries for missing installer or portable paths in T-0127',
    'MIT license decision: adopt MIT; package remains private until owner-approved `LICENSE` text exists',
    'Publish target decision: npm package first, GitHub Release second, Docker image deferred',
    'Installed CLI verification must use `hadara doctor --json`',
    'T-0127 performs no publish, no `npm pack`, no install smoke, no release artifact build, no GitHub Release, no Docker image build, and no registry mutation',
    'Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`'
  ];
  const docsOk = includesAll(testStrategy, metadataMarkers) || includesAll(releaseReadiness, metadataMarkers);
  const ok = (bootstrapMetadataOk || releaseCandidateMetadataOk) && docsOk;
  return {
    code: 'PACKAGE_METADATA_RELEASE_READINESS',
    name: 'Package metadata release readiness',
    status: ok ? 'passed' : readinessFailureStatus(mode),
    summary: ok
      ? 'Package name, bootstrap version, private transition, files target, license path, publish target, and installed CLI verification decisions are documented without publishing.'
      : 'Package metadata release-readiness decisions must be documented while keeping the package private and non-publishable.'
  };
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
    'POSIX prefix: `~/.local/share/hadara`',
    'POSIX bin link: `~/.local/bin/hadara`',
    'Windows prefix: `%LOCALAPPDATA%\\HADARA`',
    'Windows cmd launcher: `%LOCALAPPDATA%\\HADARA\\bin\\hadara.cmd`',
    'Windows PowerShell launcher: `%LOCALAPPDATA%\\HADARA\\bin\\hadara.ps1`',
    'Windows USB portable root: `L:\\HADARA`',
    'WSL USB portable root: `/mnt/l/HADARA`',
    'Installer plans must validate Node 22',
    'WSL install plans must reject Windows `node.exe` shims',
    'Schema id: `hadara.install.plan.v1`',
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

function checkGeneratedArtifactPolicy(projectState: string | null, developmentSlices: string | null, mode: ReleaseGateReport['mode']): ReleaseGateReport['checks'][number] {
  const ok = includesAll(projectState, ['contextPath: null', '.hadara/local/tui/', 'read-only local API routes']) && includesAll(developmentSlices, ['without writing generated context files']);
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
  if (!fs.existsSync(taskPath) || !fs.existsSync(acceptancePath)) return [];
  const taskStatus = readTaskStatus(taskPath);
  const acceptance = fs.readFileSync(acceptancePath, 'utf8');
  const checkedCount = acceptance.match(/-\s+\[[xX]\]/g)?.length ?? 0;
  const evidenceCount = countValidEvidenceRecords(evidencePath);
  if (checkedCount > 0 && (taskStatus !== 'Done' || evidenceCount === 0)) {
    return [
      {
        severity: 'warning',
        code: 'PREMATURE_ACCEPTANCE_CHECKED',
        message: `${task.id} has checked acceptance boxes before Done status or evidence records.`,
        path: toPortablePath(path.relative(projectRoot, acceptancePath))
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
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
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
