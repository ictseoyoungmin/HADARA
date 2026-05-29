import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createReleaseDryRunReport } from '../../src/services/release-dry-run';
import { validateSchema } from '../../src/core/schema';

const roots: string[] = [];
const commit = '0123456789abcdef0123456789abcdef01234567';

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-dry-run-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(root, '.git', 'refs', 'heads'), { recursive: true });
  fs.writeFileSync(path.join(root, '.git', 'HEAD'), 'ref: refs/heads/main\n', 'utf8');
  fs.writeFileSync(path.join(root, '.git', 'refs', 'heads', 'main'), `${commit}\n`, 'utf8');
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('release dry-run', () => {
  it('cross-checks linked evidence artifacts before reporting release readiness', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root);

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(true);
    expect(report.schemaVersion).toBe('hadara.releaseDryRun.v1');
    expect(report.current.gitCommit).toBe(commit);
    expect(report.releaseTargets).toEqual({
      primary: 'npm-package',
      secondary: 'github-release',
      dockerImage: 'deferred'
    });
    expect(report.evidence).toContainEqual(
      expect.objectContaining({
        code: 'RELEASE_ARTIFACT_EVIDENCE',
        artifactExists: true,
        artifactSchemaValid: true,
        sourceOk: true,
        category: 'release-artifact',
        mode: 'execute',
        packageVersion: '0.1.0-rc.0',
        gitCommit: commit,
        manifestHash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      })
    );
    expect(report.privacy).toMatchObject({
      tokenValuesIncluded: false,
      publishExecuted: false,
      githubReleaseCreated: false,
      dockerImageBuilt: false
    });
    expect(validateSchema('hadara.releaseDryRun.v1', report).ok).toBe(true);
  });

  it('fails when release evidence records do not link schema-valid artifacts', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);

    const taskDir = path.join(root, 'tasks', 'T-0001-weak-evidence');
    fs.mkdirSync(taskDir, { recursive: true });
    fs.writeFileSync(
      path.join(taskDir, 'evidence.jsonl'),
      JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-05-28T10:00:00Z',
        taskId: 'T-0001',
        kind: 'command-log',
        summary: 'hadara package smoke --execute --attach-evidence hadara.packageSmoke.v1',
        result: 'passed',
        visibility: 'public'
      }) + '\n',
      'utf8'
    );

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(false);
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_SMOKE_EVIDENCE',
        status: 'error',
        summary: 'No matching passed public evidence record was found.'
      })
    );
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE_NOT_READY', severity: 'error' }));
  });
});

function writeStrongEvidence(root: string): void {
  const taskDir = path.join(root, 'tasks', 'T-0001-release-evidence');
  const artifactDir = path.join(taskDir, 'artifacts');
  fs.mkdirSync(path.join(artifactDir, 'package-smoke'), { recursive: true });
  fs.mkdirSync(path.join(artifactDir, 'clean-checkout-smoke'), { recursive: true });
  fs.mkdirSync(path.join(artifactDir, 'release-artifact'), { recursive: true });

  writeJson(path.join(artifactDir, 'package-smoke', 'summary.json'), smokeSummary('package-smoke', 'package.smoke', 'local'));
  writeJson(path.join(artifactDir, 'clean-checkout-smoke', 'summary.json'), smokeSummary('clean-checkout-smoke', 'smoke.clean-checkout', 'execute'));
  writeJson(path.join(artifactDir, 'release-artifact', 'report.json'), releaseArtifactReport());

  const records = [
    evidenceRecord(
      '2026-05-28T10:00:00Z',
      'hadara package smoke --execute --attach-evidence wrote artifacts/package-smoke summary hadara.packageSmoke.v1',
      'artifacts/package-smoke/summary.json'
    ),
    evidenceRecord(
      '2026-05-28T10:01:00Z',
      'hadara smoke clean-checkout --execute --attach-evidence wrote artifacts/clean-checkout-smoke summary hadara.cleanCheckoutSmoke.v1',
      'artifacts/clean-checkout-smoke/summary.json'
    ),
    evidenceRecord(
      '2026-05-28T10:02:00Z',
      'hadara release artifact --execute --attach-evidence generated tarball/checksum/manifest artifacts/release-artifact hadara.releaseArtifact.v1',
      'artifacts/release-artifact/report.json'
    )
  ];
  fs.writeFileSync(path.join(taskDir, 'evidence.jsonl'), records.map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');
}

function evidenceRecord(time: string, summary: string, evidencePath: string): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.evidence.v1',
    time,
    taskId: 'T-0001',
    kind: 'command-log',
    summary,
    result: 'passed',
    visibility: 'public',
    evidencePath
  };
}

function smokeSummary(category: 'package-smoke' | 'clean-checkout-smoke', command: string, mode: string): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.smokeEvidenceSummary.v1',
    time: '2026-05-28T10:00:00Z',
    taskId: 'T-0001',
    category,
    gitCommit: commit,
    sourceReport: {
      schemaVersion: category === 'package-smoke' ? 'hadara.packageSmoke.v1' : 'hadara.cleanCheckoutSmoke.v1',
      command,
      mode,
      ok: true
    },
    execution: {},
    steps: [{ id: 'step', label: 'Step', status: 'passed', summary: 'passed' }],
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
  };
}

function releaseArtifactReport(): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.releaseArtifact.v1',
    command: 'release.artifact',
    ok: true,
    mode: 'execute',
    execution: {
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
      displayPath: './dist-release',
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
        fileName: 'hadara.tgz.manifest.json',
        relativePath: 'dist-release/hadara.tgz.manifest.json',
        pathRedacted: true,
        byteLength: 100,
        hash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        rawContentIncluded: false
      }
    ],
    packageContents: {
      verified: true,
      fileCount: 4,
      allowedRoots: ['dist/', 'README.md', 'LICENSE', 'package.json'],
      requiredFiles: ['package.json', 'README.md', 'LICENSE', 'dist/cli/main.js'],
      forbiddenMatches: []
    },
    privacy: {
      rawLogsIncluded: false,
      packageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    evidence: {
      gitCommit: commit
    },
    issues: []
  };
}

function writeJson(filePath: string, value: Record<string, unknown>): void {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeReleaseReadinessFiles(root: string): void {
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({
      name: 'hadara',
      version: '0.1.0-rc.0',
      private: false,
      license: 'MIT',
      bin: { hadara: './dist/cli/main.js' },
      files: ['dist/', 'README.md', 'LICENSE', 'package.json'],
      scripts: {
        build: 'tsc -p tsconfig.json',
        test: 'vitest run',
        'test:contract': 'vitest run tests/contract',
        'test:harness': 'vitest run tests/harness',
        check: 'npm run build && npm test'
      },
      devDependencies: { '@types/node': '^22.10.2' }
    }),
    'utf8'
  );
  fs.mkdirSync(path.join(root, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(path.join(root, '.github', 'workflows', 'ci.yml'), 'uses: actions/setup-node@v4\nnode-version: 22\nrun: npm ci\nrun: npm run check\n', 'utf8');
  fs.writeFileSync(path.join(root, 'LICENSE'), 'MIT\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'V1_0_IMPLEMENTATION_SCHEMAS.md'), 'npm ci\nnpm run check\nnode dist/cli/main.js doctor --json\nnode dist/cli/main.js ops status --json\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), 'clean checkout smoke\nwithout writing generated context files\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), 'contextPath: null\n.hadara/local/tui/\nread-only local API routes\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'docs', 'VALIDATION_HISTORY.md'),
    'GitHub Actions CI run succeeded: https://github.com/example/project/actions/runs/123\nhadara.packageSmoke.v1 evidence recorded\n',
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
      'Current version is `0.1.0-rc.0`',
      'Current package is `private: false`',
      'Current binary remains `bin.hadara` at `./dist/cli/main.js`',
      'Current `files` whitelist is `dist/`, `README.md`, `LICENSE`, and `package.json`',
      'Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability',
      'Release-candidate metadata mode: version `0.1.0-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present',
      'Scoped fallback decision: do not silently switch names',
      'Version policy: first release-candidate target is `0.1.0-rc.0`; first stable target is `0.1.0`',
      'T-0142 transitions `private` to false only after the package files whitelist, root README, license decision, and package-smoke evidence gates exist',
      'Final `files` whitelist target: `dist/`, `README.md`, `LICENSE`, `package.json`, plus installer and portable files only after those files exist',
      'Do not add `files` entries for missing installer or portable paths in T-0127',
      'MIT license decision: adopt MIT; `LICENSE` exists and is included in the package whitelist',
      'Publish target decision: npm package first, GitHub Release second, Docker image deferred',
      'Installed CLI verification must use `hadara doctor --json`',
      'T-0142 performs no publish, no GitHub Release creation, no Docker image build, and no registry mutation; it transitions metadata and regenerates reduced release evidence only',
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
      'Current version is `0.1.0-rc.0`',
      'Current package is `private: false`',
      'Current binary remains `bin.hadara` at `./dist/cli/main.js`',
      'Current `files` whitelist is `dist/`, `README.md`, `LICENSE`, and `package.json`',
      'Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability',
      'Release-candidate metadata mode: version `0.1.0-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present',
      'Scoped fallback decision: do not silently switch names',
      'Version policy: first release-candidate target is `0.1.0-rc.0`; first stable target is `0.1.0`',
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
}
