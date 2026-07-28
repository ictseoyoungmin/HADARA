import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleDebtCommand } from '../../tools/dev-surface/debt';
import { handleReleaseGateCommand } from '../../tools/dev-surface-handlers';
import {
  createOperationalDebtReport,
  createOperationalDebtShowReport,
  createReleaseGateReport,
  OPERATIONAL_DEBT_RECORDS
} from '../../tools/dev-surface/operational-debt';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-operational-debt-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  return dir;
}

function writeReleaseReadinessFiles(root: string, version = '0.2.0-rc.0'): void {
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        name: 'hadara',
        version,
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
  fs.mkdirSync(path.join(root, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(path.join(root, 'LICENSE'), 'MIT License\n\nCopyright (c) test\n', 'utf8');
  fs.writeFileSync(
    path.join(root, '.github', 'workflows', 'ci.yml'),
    ['uses: actions/setup-node@v4', 'node-version: 22', 'run: npm ci', 'run: npm run check'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'V1_0_IMPLEMENTATION_SCHEMAS.md'),
    ['npm ci', 'npm run check', 'node dist/cli/main.js doctor --json', 'node dist/cli/main.js status --json'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'),
    ['clean checkout smoke', 'contextPath: null', 'without writing generated context files'].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'PROJECT_STATE.md'),
    'Compact current release, task, intent, problem, and validation projection.\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'ARCHITECTURE.md'),
    'TUI cache is ignored machine-local state under .hadara/local/tui/.\n',
    'utf8'
  );
  fs.mkdirSync(path.join(root, 'docs', 'design'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'design', 'TUI_DESIGN_NOTES.md'),
    'The TUI cache and other generated operator artifacts remain machine-local and ignored.\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'RELEASE_READINESS.md'),
    [
      'Clean Checkout Package Smoke Plan',
      'npm ci',
      'npm run build',
      'node dist/cli/main.js doctor --json',
      'node dist/cli/main.js status --json',
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
      'hadara smoke package --dry-run --json',
      'hadara smoke package --task <task-id> --json',
      'hadara smoke package --workspace /tmp/hadara-package-smoke/<run-id> --json',
      `hadara smoke package --from ./dist-release/hadara-${version}.tgz --json`,
      'hadara smoke package --keep-temp --json',
      'Do not use `hadara release smoke` as the primary command surface',
      '`--timeout <seconds>`',
      '`--attach-evidence`',
      '`--private-logs`',
      'Package smoke must not be callable from MCP by default',
      'The release gate must not call `hadara smoke package`',
      'Remote CI observation',
      'local Docker validation remains the primary reproducible check',
      'Package Metadata Release Readiness',
      'Package name decision: `hadara`',
      'npm registry observation:',
      `Current version is \`${version}\``,
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
      'Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`',
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
      'Evidence cross-check should follow this order: record exists, artifact exists, artifact schema valid, `sourceReport.ok` true when present, category/mode/result match the expected check',
      'Release artifact evidence flow must be explicit: run `hadara release artifact --execute --json --output dist-release`',
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
      'The release gate must not execute `scripts/install.ps1`',
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
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'VALIDATION_HISTORY.md'),
    ['GitHub Actions CI run succeeded: https://github.com/example/project/actions/runs/123', 'hadara.packageSmoke.v1 evidence recorded'].join('\n'),
    'utf8'
  );
  writeReleaseEvidenceRecords(root);
}

function writeReleaseEvidenceRecords(root: string): void {
  const taskDir = path.join(root, 'tasks', 'T-0138-release-evidence-fixture');
  fs.mkdirSync(taskDir, { recursive: true });
  writeSmokeEvidenceSummary(taskDir, {
    filePath: 'artifacts/package-smoke/2026-05-28T12-52-58.000Z-summary.json',
    time: '2026-05-28T12:52:58Z',
    taskId: 'T-0138',
    category: 'package-smoke',
    mode: 'local',
    command: 'package.smoke'
  });
  writeSmokeEvidenceSummary(taskDir, {
    filePath: 'artifacts/clean-checkout-smoke/2026-05-28T12-53-26.000Z-summary.json',
    time: '2026-05-28T12:53:26Z',
    taskId: 'T-0138',
    category: 'clean-checkout-smoke',
    mode: 'execute',
    command: 'smoke.cleanCheckout'
  });
  writeReleaseArtifactEvidence(taskDir, 'artifacts/release-artifact/2026-05-28T13-15-03.000Z-report.json');
  const records = [
    {
      schemaVersion: 'hadara.evidence.v1',
      time: '2026-05-28T12:52:58Z',
      taskId: 'T-0138',
      kind: 'command-log',
      summary:
        'Docker built CLI package smoke --execute --attach-evidence --task T-0138 --json returned ok true, attached public artifacts/package-smoke summary JSON, and reported no issues.',
      result: 'passed',
      visibility: 'public',
      evidencePath: 'artifacts/package-smoke/2026-05-28T12-52-58.000Z-summary.json'
    },
    {
      schemaVersion: 'hadara.evidence.v1',
      time: '2026-05-28T12:53:26Z',
      taskId: 'T-0138',
      kind: 'command-log',
      summary:
        'Docker built CLI smoke clean-checkout --execute --attach-evidence --task T-0138 --json returned ok true, attached public artifacts/clean-checkout-smoke summary JSON, and reported no issues.',
      result: 'passed',
      visibility: 'public',
      evidencePath: 'artifacts/clean-checkout-smoke/2026-05-28T12-53-26.000Z-summary.json'
    },
    {
      schemaVersion: 'hadara.evidence.v1',
      time: '2026-05-28T13:15:03Z',
      taskId: 'T-0138',
      kind: 'command-log',
      summary:
        'Docker built CLI release artifact --execute --json returned ok true, generated tarball/checksum/manifest metadata, verified package files, and reported no issues.',
      result: 'passed',
      visibility: 'public',
      evidencePath: 'artifacts/release-artifact/2026-05-28T13-15-03.000Z-report.json'
    }
  ];
  fs.writeFileSync(path.join(taskDir, 'evidence.jsonl'), records.map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');
}

function writeSmokeEvidenceSummary(
  taskDir: string,
  options: {
    filePath: string;
    time: string;
    taskId: string;
    category: 'package-smoke' | 'clean-checkout-smoke';
    mode: 'local' | 'execute';
    command: string;
  }
): void {
  writeJsonArtifact(taskDir, options.filePath, {
    schemaVersion: 'hadara.smokeEvidenceSummary.v1',
    time: options.time,
    taskId: options.taskId,
    category: options.category,
    sourceReport: {
      schemaVersion: options.category === 'package-smoke' ? 'hadara.packageSmoke.v1' : 'hadara.cleanCheckoutSmoke.v1',
      command: options.command,
      mode: options.mode,
      ok: true
    },
    execution: {},
    steps: [{ id: 'run', label: 'Run smoke', status: 'passed', summary: 'Smoke passed.' }],
    privacy: {
      rawLogsIncluded: false,
      rawPackageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues: [],
    rawLogsIncluded: false,
    privatePathsIncluded: false,
    rawPackageContentsIncluded: false
  });
}

function writeReleaseArtifactEvidence(taskDir: string, filePath: string): void {
  writeJsonArtifact(taskDir, filePath, {
    schemaVersion: 'hadara.releaseArtifact.v1',
    command: 'release.artifact',
    ok: true,
    mode: 'execute',
    execution: {
      sourceBuildExecuted: true,
      builtCliVersionVerified: true,
      stagingCreated: true,
      npmPackExecuted: true,
      checksumGenerated: true,
      manifestGenerated: true,
      packageContentsVerified: true,
      publishExecuted: false,
      githubReleaseCreated: false,
      dockerImageBuilt: false
    },
    output: {
      kind: 'explicit',
      displayPath: 'dist-release',
      pathRedacted: true,
      relativePath: 'dist-release',
      retention: 'explicit-output'
    },
    package: {
      name: 'hadara',
      version: '0.1.0-rc.0',
      private: false,
      filesWhitelistApplied: true
    },
    artifacts: [
      {
        kind: 'manifest',
        visibility: 'local',
        fileName: 'hadara-0.1.0-rc.0.manifest.json',
        pathRedacted: true,
        byteLength: 128,
        hash: `sha256:${'a'.repeat(64)}`,
        rawContentIncluded: false
      }
    ],
    packageContents: {
      verified: true,
      fileCount: 12,
      allowedRoots: ['dist/'],
      requiredFiles: ['package.json', 'README.md', 'LICENSE'],
      forbiddenMatches: []
    },
    privacy: {
      rawLogsIncluded: false,
      packageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues: []
  });
}

function writeJsonArtifact(taskDir: string, relativePath: string, content: unknown): void {
  const artifactPath = path.join(taskDir, relativePath);
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, JSON.stringify(content, null, 2), 'utf8');
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
        summary: 'Package-smoke command naming, flags, approval, cleanup, failure, evidence, and MCP boundaries are documented.'
      },
      {
        code: 'PACKAGE_METADATA_RELEASE_READINESS',
        name: 'Package metadata release readiness',
        status: 'passed',
        summary:
          'Package name, publishable version, private transition, files target, license path, publish target, and installed CLI verification decisions are documented without publishing.'
      },
      {
        code: 'CI_RELEASE_WORKFLOW_TARGET_DECISION',
        name: 'CI/release workflow target decision',
        status: 'passed',
        summary: 'Release targets, token names, approval boundary, and T-0140 evidence hardening requirements are documented.'
      },
      {
        code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA',
        name: 'Installer script surface and schema',
        status: 'passed',
        summary:
          'Installer script paths, portable launchers, install locations, Node/WSL checks, and install plan schema are documented without install mutation.'
      },
      {
        code: 'INSTALL_MATRIX_SMOKE_PLAN',
        name: 'Install matrix smoke plan',
        status: 'passed',
        summary: 'Install matrix rows, platform boundaries, evidence shape, and non-execution release-gate behavior are documented.'
      },
      {
        code: 'PACKAGE_SMOKE_EVIDENCE',
        name: 'Package smoke evidence',
        status: 'passed',
        summary: 'Latest package-smoke evidence is recorded: T-0138 at 2026-05-28T12:52:58Z; linked summary artifact is schema-valid.'
      },
      {
        code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE',
        name: 'Clean checkout smoke evidence',
        status: 'passed',
        summary: 'Latest clean-checkout smoke evidence is recorded: T-0138 at 2026-05-28T12:53:26Z; linked summary artifact is schema-valid.'
      },
      {
        code: 'RELEASE_ARTIFACT_EVIDENCE',
        name: 'Release artifact evidence',
        status: 'passed',
        summary: 'Latest release artifact build evidence is recorded: T-0138 at 2026-05-28T13:15:03Z; linked summary artifact is schema-valid.'
      },
      {
        code: 'INSTALL_MATRIX_SMOKE_EVIDENCE',
        name: 'Install matrix smoke evidence',
        status: 'passed',
        summary: 'Install-matrix evidence enforcement is deferred until an executable install-matrix smoke surface exists.'
      },
      {
        code: 'GENERATED_ARTIFACT_POLICY_UNCLEAR',
        name: 'Generated artifact policy',
        status: 'passed',
        summary: 'Context export and TUI cache boundaries are documented as non-committed/generated or read-only surfaces.'
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

  it('accepts stable 0.x.y package metadata for release readiness', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root, '0.3.1');

    const report = createReleaseGateReport(root, 'strict');

    expect(report.ok).toBe(true);
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_METADATA_RELEASE_READINESS',
        status: 'passed',
        summary:
          'Package name, publishable version, private transition, files target, license path, publish target, and installed CLI verification decisions are documented without publishing.'
      })
    );
  });

  it('uses package metadata instead of a fixed RC version for release readiness markers', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root, '0.3.1-rc.1');

    const strict = createReleaseGateReport(root, 'strict');

    expect(strict.ok).toBe(true);
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE', status: 'passed' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS', status: 'passed' }));
    expect(strict.issues).not.toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR' }));
  });

  it('requires release evidence records without executing smoke or artifact commands', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.rmSync(path.join(root, 'tasks'), { recursive: true, force: true });

    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');

    expect(advisory.ok).toBe(true);
    expect(strict.ok).toBe(false);
    expect(advisory.checks).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_SMOKE_EVIDENCE',
        status: 'warning',
        summary: 'Record passed public package-smoke execution evidence before release readiness is frozen.'
      })
    );
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE', status: 'error' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE_MISSING', severity: 'error' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE_MISSING', severity: 'error' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'RELEASE_ARTIFACT_EVIDENCE_MISSING', severity: 'error' }));
    expect(strict.checks).toContainEqual(
      expect.objectContaining({
        code: 'INSTALL_MATRIX_SMOKE_EVIDENCE',
        status: 'passed',
        summary: 'Install-matrix evidence enforcement is deferred until an executable install-matrix smoke surface exists.'
      })
    );
    expect(strict.issues).not.toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_EVIDENCE_MISSING' }));
  });

  it('rejects release evidence records that only match summary wording', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.rmSync(path.join(root, 'tasks'), { recursive: true, force: true });
    const taskDir = path.join(root, 'tasks', 'T-0142-summary-only-release-evidence');
    fs.mkdirSync(taskDir, { recursive: true });
    fs.writeFileSync(
      path.join(taskDir, 'evidence.jsonl'),
      [
        {
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-05-29T00:56:41.077Z',
          taskId: 'T-0142',
          kind: 'command-log',
          summary:
            'Docker built CLI package smoke --execute --attach-evidence --task T-0142 --json returned ok true, attached public artifacts/package-smoke summary JSON, and reported no issues.',
          result: 'passed',
          visibility: 'public'
        },
        {
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-05-29T01:01:42.779Z',
          taskId: 'T-0142',
          kind: 'command-log',
          summary:
            'Docker built CLI smoke clean-checkout --execute --attach-evidence --task T-0142 --json returned ok true, attached public artifacts/clean-checkout-smoke summary JSON, and reported no issues.',
          result: 'passed',
          visibility: 'public'
        },
        {
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-05-29T01:15:03Z',
          taskId: 'T-0142',
          kind: 'command-log',
          summary:
            'Docker built CLI release artifact --execute --json returned ok true, generated tarball/checksum/manifest metadata, verified package files, and reported no issues.',
          result: 'passed',
          visibility: 'public'
        }
      ]
        .map((record) => JSON.stringify(record))
        .join('\n') + '\n',
      'utf8'
    );

    const strict = createReleaseGateReport(root, 'strict');

    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE', status: 'error' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE', status: 'error' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'RELEASE_ARTIFACT_EVIDENCE', status: 'error' }));
  });

  it('accepts reduced smoke evidence records by task artifact path', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    const taskDir = path.join(root, 'tasks', 'T-0142-package-metadata-transition-plan');
    fs.mkdirSync(taskDir, { recursive: true });
    writeSmokeEvidenceSummary(taskDir, {
      filePath: 'artifacts/package-smoke/2026-05-29T00-56-41.077Z-summary.json',
      time: '2026-05-29T00:56:41.077Z',
      taskId: 'T-0142',
      category: 'package-smoke',
      mode: 'local',
      command: 'package.smoke'
    });
    writeSmokeEvidenceSummary(taskDir, {
      filePath: 'artifacts/clean-checkout-smoke/2026-05-29T01-01-42.779Z-summary.json',
      time: '2026-05-29T01:01:42.779Z',
      taskId: 'T-0142',
      category: 'clean-checkout-smoke',
      mode: 'execute',
      command: 'smoke.cleanCheckout'
    });
    fs.writeFileSync(
      path.join(taskDir, 'evidence.jsonl'),
      [
        {
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-05-29T00:56:41.077Z',
          taskId: 'T-0142',
          kind: 'command-log',
          summary: 'Package smoke local passed with reduced public evidence.',
          result: 'passed',
          visibility: 'public',
          evidencePath: 'artifacts/package-smoke/2026-05-29T00-56-41.077Z-summary.json'
        },
        {
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-05-29T01:01:42.779Z',
          taskId: 'T-0142',
          kind: 'command-log',
          summary: 'Clean-checkout smoke passed with reduced public evidence.',
          result: 'passed',
          visibility: 'public',
          evidencePath: 'artifacts/clean-checkout-smoke/2026-05-29T01-01-42.779Z-summary.json'
        }
      ]
        .map((record) => JSON.stringify(record))
        .join('\n') + '\n',
      'utf8'
    );

    const report = createReleaseGateReport(root, 'strict');

    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_SMOKE_EVIDENCE',
        status: 'passed',
        summary: 'Latest package-smoke evidence is recorded: T-0142 at 2026-05-29T00:56:41.077Z; linked summary artifact is schema-valid.'
      })
    );
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE',
        status: 'passed',
        summary: 'Latest clean-checkout smoke evidence is recorded: T-0142 at 2026-05-29T01:01:42.779Z; linked summary artifact is schema-valid.'
      })
    );
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
    expect(advisory.checks).toContainEqual(expect.objectContaining({ code: 'CI_RELEASE_WORKFLOW_TARGET_DECISION', status: 'warning' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'CI_RELEASE_WORKFLOW_TARGET_DECISION', status: 'error' }));
    expect(advisory.checks).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA', status: 'warning' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA', status: 'error' }));
    expect(advisory.checks).toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_PLAN', status: 'warning' }));
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_PLAN', status: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'REMOTE_CI_OBSERVATION_UNRECORDED', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'REMOTE_CI_OBSERVATION_UNRECORDED', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'CI_RELEASE_WORKFLOW_TARGET_DECISION_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'CI_RELEASE_WORKFLOW_TARGET_DECISION_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'INSTALLER_SCRIPT_SURFACE_SCHEMA_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_PLAN_UNCLEAR', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_PLAN_UNCLEAR', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE_MISSING', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE_MISSING', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE_MISSING', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE_MISSING', severity: 'error' }));
    expect(advisory.issues).toContainEqual(expect.objectContaining({ code: 'RELEASE_ARTIFACT_EVIDENCE_MISSING', severity: 'warning' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'RELEASE_ARTIFACT_EVIDENCE_MISSING', severity: 'error' }));
    expect(advisory.issues).not.toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_EVIDENCE_MISSING' }));
    expect(strict.issues).not.toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_EVIDENCE_MISSING' }));
    expect(advisory.issues).not.toContainEqual(expect.objectContaining({ code: 'OPEN_HIGH_OPERATIONAL_DEBT' }));
    expect(strict.issues).not.toContainEqual(expect.objectContaining({ code: 'OPEN_HIGH_OPERATIONAL_DEBT' }));
  });

  it('requires executable package-smoke artifact boundary documentation before release readiness passes', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'RELEASE_READINESS.md'),
      [
        'Clean Checkout Package Smoke Plan',
        'npm ci',
        'npm run build',
        'node dist/cli/main.js doctor --json',
        'node dist/cli/main.js status --json',
        'node dist/cli/main.js release gate --mode strict --json',
        'no packaging or release execution',
        'Remote CI observation',
        'local Docker validation remains the primary reproducible check'
      ].join('\n'),
      'utf8'
    );
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
      path.join(root, 'docs', 'RELEASE_READINESS.md'),
      [
        'Clean Checkout Package Smoke Plan',
        'npm ci',
        'npm run build',
        'node dist/cli/main.js doctor --json',
        'node dist/cli/main.js status --json',
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

  it('keeps release gate package-smoke handling read-only and report-only', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);

    const report = createReleaseGateReport(root, 'strict');
    const encoded = JSON.stringify(report);

    expect(report.command).toBe('release.gate');
    expect(report.ok).toBe(true);
    expect(report.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_ARTIFACT_BOUNDARY', status: 'passed' }));
    expect(report.checks).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_COMMAND_SURFACE', status: 'passed' }));
    expect(encoded).not.toContain('"command":"package.smoke"');
    expect(encoded).not.toContain('"schemaVersion":"hadara.packageSmoke.v1"');
  });

  it('requires package metadata release-readiness documentation before release readiness passes', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'RELEASE_READINESS.md'),
      [
        'Clean Checkout Package Smoke Plan',
        'npm ci',
        'npm run build',
        'node dist/cli/main.js doctor --json',
        'node dist/cli/main.js status --json',
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
        'hadara smoke package --dry-run --json',
        'hadara smoke package --task <task-id> --json',
        'hadara smoke package --workspace /tmp/hadara-package-smoke/<run-id> --json',
        'hadara smoke package --from ./dist-release/hadara-0.1.0-rc.0.tgz --json',
        'hadara smoke package --keep-temp --json',
        'Do not use `hadara release smoke` as the primary command surface',
        '`--timeout <seconds>`',
        '`--attach-evidence`',
        '`--private-logs`',
        'Package smoke must not be callable from MCP by default',
        'The release gate must not call `hadara smoke package`',
        'Remote CI observation',
        'local Docker validation remains the primary reproducible check'
      ].join('\n'),
      'utf8'
    );
    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');

    expect(advisory.ok).toBe(true);
    expect(advisory.checks).toContainEqual({
      code: 'PACKAGE_METADATA_RELEASE_READINESS',
      name: 'Package metadata release readiness',
      status: 'warning',
      summary: 'Package metadata release-readiness decisions must be documented before publishability is accepted.'
    });
    expect(advisory.issues).toContainEqual({
      severity: 'warning',
      code: 'PACKAGE_METADATA_RELEASE_READINESS_UNCLEAR',
      message:
        'Package metadata release readiness: Package metadata release-readiness decisions must be documented before publishability is accepted.'
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
        'npm registry observation:',
        'Current version is `0.2.0-rc.0`',
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

  it('requires install matrix smoke planning before release readiness passes', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    const releaseReadinessPath = path.join(root, 'docs', 'RELEASE_READINESS.md');
    fs.writeFileSync(
      releaseReadinessPath,
      fs.readFileSync(releaseReadinessPath, 'utf8').replace('Install Matrix Smoke Plan', 'Install Matrix Planning Missing'),
      'utf8'
    );

    const advisory = createReleaseGateReport(root);
    const strict = createReleaseGateReport(root, 'strict');

    expect(advisory.ok).toBe(true);
    expect(advisory.checks).toContainEqual({
      code: 'INSTALL_MATRIX_SMOKE_PLAN',
      name: 'Install matrix smoke plan',
      status: 'warning',
      summary: 'Install matrix smoke rows and evidence boundaries must be documented before execution.'
    });
    expect(advisory.issues).toContainEqual({
      severity: 'warning',
      code: 'INSTALL_MATRIX_SMOKE_PLAN_UNCLEAR',
      message: 'Install matrix smoke plan: Install matrix smoke rows and evidence boundaries must be documented before execution.'
    });
    expect(strict.ok).toBe(false);
    expect(strict.checks).toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_PLAN', status: 'error' }));
    expect(strict.issues).toContainEqual(expect.objectContaining({ code: 'INSTALL_MATRIX_SMOKE_PLAN_UNCLEAR', severity: 'error' }));
  });

  it('allows package metadata release-candidate mode when release artifacts are still checked read-only', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    fs.writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify(
        {
          name: 'hadara',
          version: '0.2.0-rc.0',
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
        'Package name, publishable version, private transition, files target, license path, publish target, and installed CLI verification decisions are documented without publishing.'
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
    fs.writeFileSync(
      acceptancePath,
      '- [x] Complete\n',
      'utf8'
    );

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-premature-acceptance/ACCEPTANCE.md'
    });
  });

  it('warns when current TASK.md acceptance is met before evidence exists', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Premature task acceptance');
    fs.writeFileSync(
      path.join(task.dir, 'TASK.md'),
      fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8').replace('| AC-1 | Scope is implemented. | Pending | TBD | TBD |', '| AC-1 | Scope is implemented. | Met | Premature evidence claim | TBD |'),
      'utf8'
    );

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-premature-task-acceptance/TASK.md'
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
