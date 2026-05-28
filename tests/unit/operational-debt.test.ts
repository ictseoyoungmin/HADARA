import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleDebtCommand } from '../../src/cli/debt';
import { handleReleaseGateCommand } from '../../src/cli/release-gate';
import {
  createOperationalDebtReport,
  createOperationalDebtShowReport,
  createReleaseGateReport,
  OPERATIONAL_DEBT_RECORDS
} from '../../src/services/operational-debt';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-operational-debt-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  return dir;
}

function writeReleaseReadinessFiles(root: string): void {
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        name: 'hadara',
        version: '0.0.0-bootstrap',
        private: true,
        bin: {
          hadara: './dist/cli/main.js'
        },
        scripts: {
          build: 'tsc -p tsconfig.json',
          test: 'vitest run',
          'test:contract': 'vitest run tests/contract',
          'test:harness': 'vitest run tests/harness',
          check: 'npm run build && npm test'
        },
        devDependencies: {
          '@types/node': '^22.10.2'
        }
      },
      null,
      2
    ),
    'utf8'
  );
  fs.mkdirSync(path.join(root, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(
    path.join(root, '.github', 'workflows', 'ci.yml'),
    ['uses: actions/setup-node@v4', 'node-version: 22', 'run: npm ci', 'run: npm run check'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'V1_0_IMPLEMENTATION_SCHEMAS.md'),
    ['npm ci', 'npm run check', 'node dist/cli/main.js doctor --json', 'node dist/cli/main.js ops status --json'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'),
    ['clean checkout smoke', 'without writing generated context files'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'PROJECT_STATE.md'),
    ['contextPath: null', '.hadara/local/tui/', 'read-only local API routes'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'TEST_STRATEGY.md'),
    [
      'Clean Checkout Package Smoke Plan',
      'npm ci',
      'npm run build',
      'node dist/cli/main.js doctor --json',
      'node dist/cli/main.js ops status --json',
      'node dist/cli/main.js release gate --mode strict --json',
      'no packaging or release execution',
      'Executable Package Smoke Artifact Boundary',
      'Allowed workspace',
      '/tmp/hadara-package-smoke/<run-id>',
      'Package artifact paths',
      'tasks/<task-id>/artifacts/package-smoke/',
      'Redaction and audit handling',
      'Evidence/report shape',
      'hadara.packageSmoke.v1',
      'performs no package-smoke execution',
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
      'The release gate must not call `hadara package smoke`',
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
      'Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`',
      'Remote CI observation',
      'local Docker validation remains the primary reproducible check'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'RELEASE_READINESS.md'),
    [
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
      'Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`',
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
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'VALIDATION_HISTORY.md'),
    ['GitHub Actions CI run succeeded: https://github.com/example/project/actions/runs/123'].join('\n'),
    'utf8'
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('operational debt track', () => {
  it('converts known issue themes into structured debt records', () => {
    expect(OPERATIONAL_DEBT_RECORDS).toHaveLength(8);
    expect(OPERATIONAL_DEBT_RECORDS.map((record) => record.id)).toEqual([
      'OD-0001',
      'OD-0002',
      'OD-0003',
      'OD-0004',
      'OD-0005',
      'OD-0006',
      'OD-0007',
      'OD-0008'
    ]);
    expect(OPERATIONAL_DEBT_RECORDS.find((record) => record.id === 'OD-0008')).toMatchObject({
      category: 'validation',
      severity: 'high',
      status: 'mitigated',
      targetCapability: 'Premature acceptance guard and done-level harness validation'
    });
  });

  it('reports aggregate debt counts for operations and release gates', () => {
    const root = tempProject();

    const report = createOperationalDebtReport(root);

    expect(report.aggregate).toEqual({
      total: 8,
      open: 4,
      tracked: 2,
      mitigated: 4,
      candidate: 2,
      highOpen: 0,
      bySeverity: {
        high: 2,
        medium: 4,
        low: 2
      }
    });
  });

  it('shows one operational debt record by id', () => {
    const root = tempProject();

    expect(createOperationalDebtShowReport(root, 'OD-0008')).toMatchObject({
      schemaVersion: 'hadara.operational_debt.show.v1',
      command: 'operational-debt.show',
      ok: true,
      id: 'OD-0008',
      record: {
        id: 'OD-0008',
        severity: 'high'
      },
      issues: []
    });
  });

  it('returns a structured not-found report for unknown debt ids', () => {
    const root = tempProject();

    expect(createOperationalDebtShowReport(root, 'OD-9999')).toEqual({
      schemaVersion: 'hadara.operational_debt.show.v1',
      command: 'operational-debt.show',
      ok: false,
      id: 'OD-9999',
      record: null,
      issues: [
        {
          severity: 'error',
          code: 'OPERATIONAL_DEBT_NOT_FOUND',
          message: 'Operational debt record not found: OD-9999'
        }
      ]
    });
  });

  it('passes release gates when no high severity operational debt remains open', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);

    expect(createReleaseGateReport(root)).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'advisory',
      ok: true,
      issues: []
    });
    expect(createReleaseGateReport(root).checks).toEqual([
      {
        code: 'PACKAGE_BIN_MISSING',
        name: 'Package bin entry',
        status: 'passed',
        summary: 'package.json exposes hadara at ./dist/cli/main.js.'
      },
      {
        code: 'VALIDATION_SCRIPT_MISSING',
        name: 'Package validation scripts',
        status: 'passed',
        summary: 'build, test, test:contract, test:harness, check scripts are defined.'
      },
      {
        code: 'NODE_POLICY_UNCLEAR',
        name: 'Node version policy',
        status: 'passed',
        summary: 'Development typings and CI target Node 22.'
      },
      {
        code: 'CI_CLEAN_INSTALL_UNCLEAR',
        name: 'CI clean install check',
        status: 'passed',
        summary: 'CI installs dependencies cleanly and runs npm run check.'
      },
      {
        code: 'CLEAN_CHECKOUT_SMOKE_UNCLEAR',
        name: 'Clean checkout smoke policy',
        status: 'passed',
        summary: 'Release planning documents the clean-checkout package smoke sequence.'
      },
      {
        code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY',
        name: 'Package smoke artifact boundary',
        status: 'passed',
        summary: 'Executable package-smoke artifact and evidence boundaries are documented before implementation.'
      },
      {
        code: 'PACKAGE_SMOKE_COMMAND_SURFACE',
        name: 'Package smoke command surface',
        status: 'passed',
        summary: '`hadara package smoke` command naming, flags, approval, cleanup, failure, evidence, and MCP boundaries are documented.'
      },
      {
        code: 'PACKAGE_METADATA_RELEASE_READINESS',
        name: 'Package metadata release readiness',
        status: 'passed',
        summary:
          'Package name, bootstrap version, private transition, files target, license path, publish target, and installed CLI verification decisions are documented without publishing.'
      },
      {
        code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA',
        name: 'Installer script surface and schema',
        status: 'passed',
        summary:
          'Installer script paths, portable launchers, install locations, Node/WSL checks, and install plan schema are documented without install mutation.'
      },
      {
        code: 'GENERATED_ARTIFACT_POLICY_UNCLEAR',
        name: 'Generated artifact policy',
        status: 'passed',
        summary: 'Context export, dashboard APIs, and TUI cache boundaries are documented as non-committed/generated or read-only surfaces.'
      },
      {
        code: 'REMOTE_CI_OBSERVATION',
        name: 'Remote CI observation evidence',
        status: 'passed',
        summary: 'Remote GitHub Actions status is recorded separately from local release-gate checks.'
      },
      {
        code: 'OPEN_HIGH_OPERATIONAL_DEBT',
        name: 'No high severity operational debt',
        status: 'passed',
        summary: 'No open high-severity operational debt records.'
      }
    ]);
  });

  it('passes release gates in strict mode when no high severity operational debt remains open', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);

    expect(createReleaseGateReport(root, 'strict')).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'strict',
      ok: true,
      issues: []
    });
    expect(createReleaseGateReport(root, 'strict').checks.at(-1)).toEqual({
      code: 'OPEN_HIGH_OPERATIONAL_DEBT',
      name: 'No high severity operational debt',
      status: 'passed',
      summary: 'No open high-severity operational debt records.'
    });
  });

  it('reports release readiness warnings in advisory mode and errors in strict mode', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ scripts: { build: 'tsc' } }), 'utf8');

    const report = createReleaseGateReport(root);
    const strictReport = createReleaseGateReport(root, 'strict');

    expect(report.ok).toBe(true);
    expect(report.checks).toContainEqual({
      code: 'PACKAGE_BIN_MISSING',
      name: 'Package bin entry',
      status: 'warning',
      summary: 'package.json must expose bin.hadara as ./dist/cli/main.js.'
    });
    expect(report.checks).toContainEqual({
      code: 'VALIDATION_SCRIPT_MISSING',
      name: 'Package validation scripts',
      status: 'warning',
      summary: 'Missing package scripts: test, test:contract, test:harness, check.'
    });
    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PACKAGE_BIN_MISSING',
      message: 'Package bin entry: package.json must expose bin.hadara as ./dist/cli/main.js.'
    });
    expect(strictReport.ok).toBe(false);
    expect(strictReport.checks).toContainEqual({
      code: 'PACKAGE_BIN_MISSING',
      name: 'Package bin entry',
      status: 'error',
      summary: 'package.json must expose bin.hadara as ./dist/cli/main.js.'
    });
    expect(strictReport.issues).toContainEqual({
      severity: 'error',
      code: 'PACKAGE_BIN_MISSING',
      message: 'Package bin entry: package.json must expose bin.hadara as ./dist/cli/main.js.'
    });
  });

  it('keeps release readiness issue codes stable across advisory and strict mode', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ scripts: { build: 'tsc' } }), 'utf8');

    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');
    const readinessCodes = [
      'PACKAGE_BIN_MISSING',
      'VALIDATION_SCRIPT_MISSING',
      'NODE_POLICY_UNCLEAR',
      'CI_CLEAN_INSTALL_UNCLEAR',
      'CLEAN_CHECKOUT_SMOKE_UNCLEAR',
      'GENERATED_ARTIFACT_POLICY_UNCLEAR'
    ];

    for (const code of readinessCodes) {
      expect(advisory.issues).toContainEqual(expect.objectContaining({ code, severity: 'warning' }));
      expect(strict.issues).toContainEqual(expect.objectContaining({ code, severity: 'error' }));
    }
    expect(advisory.checks).toContainEqual(expect.objectContaining({ code: 'REMOTE_CI_OBSERVATION', status: 'warning' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'REMOTE_CI_OBSERVATION', status: 'error' }));
    expect(advisory.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY', status: 'warning' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY', status: 'error' }));
    expect(advisory.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE', status: 'warning' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE', status: 'error' }));
    expect(advisory.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS', status: 'warning' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS', status: 'error' }));
    expect(advisory.checks).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA', status: 'warning' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA', status: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'REMOTE_CI_OBSERVATION_UNRECORDED', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'REMOTE_CI_OBSERVATION_UNRECORDED', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).not.toContainEqual(expect.objectContaining({ code: 'OPEN_HIGH_OPERATIONAL_DEBT' }));
    expect(strict.issues).not.toContainEqual(expect.objectContaining({ code: 'OPEN_HIGH_OPERATIONAL_DEBT' }));
  });

  it('requires executable package-smoke artifact boundary documentation before release readiness passes', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'TEST_STRATEGY.md'),
      [
        'Clean Checkout Package Smoke Plan',
        'npm ci',
        'npm run build',
        'node dist/cli/main.js doctor --json',
        'node dist/cli/main.js ops status --json',
        'node dist/cli/main.js release gate --mode strict --json',
        'no packaging or release execution',
        'Remote CI observation',
        'local Docker validation remains the primary reproducible check'
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), 'Installer Script Surface and Schema\n', 'utf8');

    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');

    expect(advisory.ok).toBe(true);
    expect(advisory.checks).toContainEqual({
      code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY',
      name: 'Package smoke artifact boundary',
      status: 'warning',
      summary: 'Executable package-smoke workspace, artifact, redaction/audit, and evidence boundaries must be documented before implementation.'
    });
    expect(advisory.issues).toContainEqual({
      severity: 'warning',
      code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY_UNCLEAR',
      message:
        'Package smoke artifact boundary: Executable package-smoke workspace, artifact, redaction/audit, and evidence boundaries must be documented before implementation.'
    });
    expect(strict.ok).toBe(false);
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY', status: 'error' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY_UNCLEAR', severity: 'error' }));
  });

  it('requires package-smoke command surface documentation before release readiness passes', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'TEST_STRATEGY.md'),
      [
        'Clean Checkout Package Smoke Plan',
        'npm ci',
        'npm run build',
        'node dist/cli/main.js doctor --json',
        'node dist/cli/main.js ops status --json',
        'node dist/cli/main.js release gate --mode strict --json',
        'no packaging or release execution',
        'Executable Package Smoke Artifact Boundary',
        'Allowed workspace',
        '/tmp/hadara-package-smoke/<run-id>',
        'Package artifact paths',
        'tasks/<task-id>/artifacts/package-smoke/',
        'Redaction and audit handling',
        'Evidence/report shape',
        'hadara.packageSmoke.v1',
        'performs no package-smoke execution',
        'Remote CI observation',
        'local Docker validation remains the primary reproducible check'
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), 'Installer Script Surface and Schema\n', 'utf8');

    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');

    expect(advisory.ok).toBe(true);
    expect(advisory.checks).toContainEqual({
      code: 'PACKAGE_SMOKE_COMMAND_SURFACE',
      name: 'Package smoke command surface',
      status: 'warning',
      summary: 'Package-smoke command naming, flags, approval, cleanup, failure, evidence, and MCP boundaries must be documented before implementation.'
    });
    expect(advisory.issues).toContainEqual({
      severity: 'warning',
      code: 'PACKAGE_SMOKE_COMMAND_SURFACE_UNCLEAR',
      message:
        'Package smoke command surface: Package-smoke command naming, flags, approval, cleanup, failure, evidence, and MCP boundaries must be documented before implementation.'
    });
    expect(strict.ok).toBe(false);
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE', status: 'error' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE_UNCLEAR', severity: 'error' }));
  });

  it('requires package metadata release-readiness documentation before release readiness passes', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'TEST_STRATEGY.md'),
      [
        'Clean Checkout Package Smoke Plan',
        'npm ci',
        'npm run build',
        'node dist/cli/main.js doctor --json',
        'node dist/cli/main.js ops status --json',
        'node dist/cli/main.js release gate --mode strict --json',
        'no packaging or release execution',
        'Executable Package Smoke Artifact Boundary',
        'Allowed workspace',
        '/tmp/hadara-package-smoke/<run-id>',
        'Package artifact paths',
        'tasks/<task-id>/artifacts/package-smoke/',
        'Redaction and audit handling',
        'Evidence/report shape',
        'hadara.packageSmoke.v1',
        'performs no package-smoke execution',
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
        'The release gate must not call `hadara package smoke`',
        'Remote CI observation',
        'local Docker validation remains the primary reproducible check'
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), 'Installer Script Surface and Schema\n', 'utf8');

    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');

    expect(advisory.ok).toBe(true);
    expect(advisory.checks).toContainEqual({
      code: 'PACKAGE_METADATA_RELEASE_READINESS',
      name: 'Package metadata release readiness',
      status: 'warning',
      summary: 'Package metadata release-readiness decisions must be documented while keeping the package private and non-publishable.'
    });
    expect(advisory.issues).toContainEqual({
      severity: 'warning',
      code: 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR',
      message:
        'Package metadata release readiness: Package metadata release-readiness decisions must be documented while keeping the package private and non-publishable.'
    });
    expect(strict.ok).toBe(false);
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS', status: 'error' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR', severity: 'error' }));
  });

  it('requires installer surface and schema documentation before release readiness passes', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'RELEASE_READINESS.md'),
      [
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
      ].join('\n'),
      'utf8'
    );

    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');

    expect(advisory.ok).toBe(true);
    expect(advisory.checks).toContainEqual({
      code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA',
      name: 'Installer script surface and schema',
      status: 'warning',
      summary: 'Installer script paths, portable launchers, install locations, Node/WSL checks, and install plan schema must be documented before implementation.'
    });
    expect(advisory.issues).toContainEqual({
      severity: 'warning',
      code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA_UNCLEAR',
      message:
        'Installer script surface and schema: Installer script paths, portable launchers, install locations, Node/WSL checks, and install plan schema must be documented before implementation.'
    });
    expect(strict.ok).toBe(false);
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA', status: 'error' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA_UNCLEAR', severity: 'error' }));
  });

  it('allows package metadata release-candidate mode when release artifacts are still checked read-only', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify(
        {
          name: 'hadara',
          version: '0.1.0-rc.0',
          private: false,
          license: 'MIT',
          bin: {
            hadara: './dist/cli/main.js'
          },
          files: ['dist/', 'README.md', 'LICENSE', 'package.json'],
          scripts: {
            build: 'tsc -p tsconfig.json',
            test: 'vitest run',
            'test:contract': 'vitest run tests/contract',
            'test:harness': 'vitest run tests/harness',
            check: 'npm run build && npm test'
          },
          devDependencies: {
            '@types/node': '^22.10.2'
          }
        },
        null,
        2
      ),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'LICENSE'), 'MIT License\n\nCopyright (c) test\n', 'utf8');
    fs.writeFileSync(
      path.join(root, 'docs', 'VALIDATION_HISTORY.md'),
      ['GitHub Actions CI run succeeded: https://github.com/example/project/actions/runs/123', 'hadara.packageSmoke.v1 evidence recorded'].join('\n'),
      'utf8'
    );

    const strict = createReleaseGateReport(root, 'strict');

    expect(strict.ok).toBe(true);
    expect(strict.checks).toContainEqual({
      code: 'PACKAGE_METADATA_RELEASE_READINESS',
      name: 'Package metadata release readiness',
      status: 'passed',
      summary:
        'Package name, bootstrap version, private transition, files target, license path, publish target, and installed CLI verification decisions are documented without publishing.'
    });
  });

  it('prints JSON through debt and release-gate CLI handlers', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(handleDebtCommand({ args: ['debt', 'list', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleDebtCommand({ args: ['debt', 'show', 'OD-0008', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleReleaseGateCommand({ args: ['release', 'gate', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleReleaseGateCommand({ args: ['release', 'gate', '--mode', 'strict', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.operational_debt.v1',
      command: 'operational-debt.report'
    });
    expect(JSON.parse(String(log.mock.calls[1]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.operational_debt.show.v1',
      command: 'operational-debt.show',
      id: 'OD-0008'
    });
    expect(JSON.parse(String(log.mock.calls[2]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'advisory',
      ok: true
    });
    expect(JSON.parse(String(log.mock.calls[3]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'strict',
      ok: true
    });
  });

  it('sets exit code 6 for strict release gate CLI readiness failures', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ scripts: { build: 'tsc' } }), 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(handleReleaseGateCommand({ args: ['release', 'gate', '--mode', 'strict', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.releaseGate.v1',
      command: 'release.gate',
      mode: 'strict',
      ok: false
    });
    expect(process.exitCode).toBe(6);
  });

  it('rejects unsupported release gate modes instead of silently falling back', () => {
    const root = tempProject();

    expect(() => handleReleaseGateCommand({ args: ['release', 'gate', '--mode', 'blocking', '--json'], projectRoot: root, jsonOutput: true })).toThrow(
      'unsupported release gate mode: blocking'
    );
  });

  it('reports capsule size indicators', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Large capsule');
    fs.writeFileSync(path.join(task.dir, 'CONTEXT.md'), Array.from({ length: 720 }, (_, index) => `line ${index + 1}`).join('\n'), 'utf8');

    const report = createOperationalDebtReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.operational_debt.v1',
      command: 'operational-debt.report',
      ok: true
    });
    expect(report.capsuleSizeIndicators).toContainEqual(
      expect.objectContaining({
        taskId: task.id,
        capsule: 'tasks/T-0001-large-capsule',
        size: 'large'
      })
    );
  });

  it('warns when acceptance is checked before evidence exists', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Premature acceptance');
    const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
    fs.writeFileSync(acceptancePath, fs.readFileSync(acceptancePath, 'utf8').replace(/- \[ \]/g, '- [x]'), 'utf8');

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-premature-acceptance/ACCEPTANCE.md'
    });
  });

  it('warns when Done acceptance has no valid evidence record', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Done without evidence');
    fs.writeFileSync(path.join(task.dir, 'TASK.md'), fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8').replace('Draft', 'Done'), 'utf8');
    fs.writeFileSync(path.join(task.dir, 'ACCEPTANCE.md'), '- [x] Complete\n', 'utf8');
    fs.writeFileSync(path.join(task.dir, 'evidence.jsonl'), 'not json\n', 'utf8');

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-done-without-evidence/ACCEPTANCE.md'
    });
  });

  it('warns when non-Done acceptance is checked even with valid evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Draft with evidence');
    fs.writeFileSync(path.join(task.dir, 'ACCEPTANCE.md'), '- [x] Complete\n', 'utf8');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T02:20:00Z","taskId":"T-0001","kind":"note","summary":"valid","result":"passed","visibility":"public"}\n',
      'utf8'
    );

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-draft-with-evidence/ACCEPTANCE.md'
    });
  });

  it('does not warn when Done acceptance has a valid evidence record', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Done with evidence');
    fs.writeFileSync(path.join(task.dir, 'TASK.md'), fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8').replace('Draft', 'Done'), 'utf8');
    fs.writeFileSync(path.join(task.dir, 'ACCEPTANCE.md'), '- [x] Complete\n', 'utf8');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T02:21:00Z","taskId":"T-0001","kind":"note","summary":"valid","result":"passed","visibility":"public"}\n',
      'utf8'
    );

    const report = createOperationalDebtReport(root);

    expect(report.issues).toEqual([]);
  });
});
