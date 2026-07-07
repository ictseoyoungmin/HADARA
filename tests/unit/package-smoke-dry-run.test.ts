import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleSmokeCommand } from '../../src/cli/smoke';
import { resolveHadaraPaths } from '../../src/core/paths';
import { validateSchema } from '../../src/core/schema';
import { createPackageSmokeDryRunReport, createPackageSmokeLocalReport, PackageSmokeCommandRunner } from '../../src/services/package-smoke';
import { listCommandRegistryEntries } from '../../src/services/capability-registry';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-package-smoke-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'tasks', 'T-0133-package-smoke-dry-run-implementation'), { recursive: true });
  fs.mkdirSync(path.join(root, 'tasks', 'T-0136-smoke-evidence-integration'), { recursive: true });
  fs.writeFileSync(path.join(root, 'tasks', 'T-0136-smoke-evidence-integration', 'TASK.md'), '# T-0136 Smoke evidence integration\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        name: 'hadara',
        version: '0.0.0-bootstrap',
        private: true,
        bin: {
          hadara: './dist/cli/main.js'
        }
      },
      null,
      2
    ),
    'utf8'
  );
  return root;
}

function writePyproject(root: string): void {
  fs.writeFileSync(
    path.join(root, 'pyproject.toml'),
    ['[project]', 'name = "hadara-python-tools"', 'version = "0.0.1"', '[build-system]', 'requires = ["hatchling"]', ''].join('\n'),
    'utf8'
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function commandsRegistryStdout(overrides?: { extraId?: string; dropFirstId?: boolean }): string {
  let entries = listCommandRegistryEntries().map((entry) => ({ id: entry.id, command: entry.command }));
  if (overrides?.dropFirstId) entries = entries.slice(1);
  if (overrides?.extraId) entries = [...entries, { id: overrides.extraId, command: `hadara ${overrides.extraId}` }];
  return JSON.stringify({ commands: entries });
}

function installedFixtureFromArgs(args: string[], overrides?: { dropVerb?: string }): void {
  const prefix = String(args[args.indexOf('--prefix') + 1]);
  const pkgRoot = path.join(prefix, 'lib', 'node_modules', 'hadara');
  fs.mkdirSync(path.join(pkgRoot, 'dist', 'cli'), { recursive: true });
  fs.writeFileSync(path.join(pkgRoot, 'package.json'), JSON.stringify({ name: 'hadara' }), 'utf8');
  const verbs = new Set<string>();
  for (const entry of listCommandRegistryEntries()) {
    const match = /^hadara\s+([a-z][a-z0-9-]*)/.exec(entry.command.trim());
    if (match) verbs.add(match[1]);
  }
  if (overrides?.dropVerb) verbs.delete(overrides.dropVerb);
  fs.writeFileSync(
    path.join(pkgRoot, 'dist', 'cli', 'main.js'),
    [...verbs].map((verb) => `        case '${verb}': {`).join('\n'),
    'utf8'
  );
}

function writeGeneratedWorkflowFixture(cwd: string, options?: { stale?: boolean }): void {
  fs.mkdirSync(path.join(cwd, 'docs'), { recursive: true });
  const current = [
    '# HADARA_WORKFLOW',
    '',
    '## Task Capsule Lifecycle',
    'hadara task finalize --task T-XXXX --json',
    'hadara task finalize --task T-XXXX --execute --auto --json',
    '',
    '## Slice State',
    'hadara slice add --id M1 --title "First slice" --status not-started --json',
    'hadara slice render --json',
    ''
  ].join('\n');
  const stale = [
    '# HADARA_WORKFLOW',
    '',
    'Low-level lifecycle commands are for debugging, recovery, or command implementation work:',
    'hadara task audit-close --task T-XXXX --json',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(cwd, 'docs', 'HADARA_WORKFLOW.md'), options?.stale ? stale : current, 'utf8');
}

describe('package smoke dry-run', () => {
  it('creates a schema-valid dry-run report without package execution', () => {
    const root = tempProject();
    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      taskId: 'T-0133',
      attachEvidence: true,
      workspace: 'tmp/package-smoke',
      timeoutSeconds: 60
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.packageSmoke.v1',
      command: 'package.smoke',
      ok: true,
      mode: 'dry-run',
      readOnly: true,
      provider: {
        ecosystem: 'npm',
        smokeProfile: 'npm-package-smoke',
        command: 'package.smoke'
      },
      networkPolicy: {
        mode: 'environment-inherited',
        enforced: false
      },
      execution: {
        npmPackExecuted: false,
        packageInstallExecuted: false,
        featureSmokeExecuted: false,
        releaseMutationExecuted: false,
        publishExecuted: false
      },
      workspace: {
        kind: 'disposable',
        displayPath: './tmp/package-smoke',
        relativePath: 'tmp/package-smoke',
        pathRedacted: true,
        retention: 'deleted'
      },
      source: {
        kind: 'source-checkout',
        displayPath: '.',
        relativePath: '.',
        pathRedacted: true
      },
      privacy: {
        rawLogsIncluded: false,
        rawPackageContentsIncluded: false,
        privatePathsIncluded: false,
        environmentSecretsIncluded: false,
        privateStorePathsIncluded: false
      },
      issues: []
    });
    expect(report.steps.map((step) => step.id)).toEqual([
      'validate-source',
      'plan-workspace',
      'npm-pack',
      'install-cli',
      'command-surface-drift',
      'generated-init-docs',
      'feature-smoke-core',
      'evidence'
    ]);
    expect(report.steps.every((step) => step.status === 'planned' || step.status === 'skipped')).toBe(true);
    expect(report.artifacts).toContainEqual(
      expect.objectContaining({
        kind: 'summary',
        visibility: 'public',
        evidencePath: 'tasks/T-0133-package-smoke-dry-run-implementation/artifacts/package-smoke/dry-run-summary.json',
        rawContentIncluded: false
      })
    );
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('redacts absolute package source and workspace paths from public output', () => {
    const root = tempProject();
    const source = path.join(root, 'dist-release', 'hadara-0.1.0-rc.0.tgz');
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.writeFileSync(source, 'placeholder tarball bytes', 'utf8');

    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      from: source,
      workspace: path.join(root, 'tmp', 'package-smoke'),
      keepTemp: true,
      privateLogs: true
    });
    const encoded = JSON.stringify(report);

    expect(report.ok).toBe(true);
    expect(report.source).toMatchObject({
      kind: 'tarball',
      displayPath: '<redacted-package-source>',
      pathRedacted: true
    });
    expect(report.workspace).toMatchObject({
      displayPath: '<redacted-disposable-workspace>',
      pathRedacted: true,
      retention: 'kept-temporary'
    });
    expect(report.artifacts).toContainEqual(
      expect.objectContaining({
        kind: 'command-log',
        visibility: 'private',
        pathRedacted: true,
        rawContentIncluded: false
      })
    );
    expect(encoded).not.toContain(root);
    expect(encoded).not.toContain('placeholder tarball bytes');
  });

  it('lets --no-evidence override --attach-evidence in both steps and artifacts', () => {
    const root = tempProject();
    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      taskId: 'T-0133',
      attachEvidence: true,
      noEvidence: true
    });

    expect(report.steps).toContainEqual(
      expect.objectContaining({
        id: 'evidence',
        status: 'skipped',
        summary: 'No public evidence attachment is planned by default.'
      })
    );
    expect(report.artifacts).not.toContainEqual(expect.objectContaining({ visibility: 'public' }));
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('reports missing sources without leaking the missing path', () => {
    const root = tempProject();
    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      from: '/home/alice/private/hadara-0.1.0-rc.0.tgz'
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'PACKAGE_SMOKE_SOURCE_MISSING',
      message: 'Package-smoke source path does not exist.'
    });
    expect(JSON.stringify(report)).not.toContain('/home/alice');
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('prints JSON through the smoke package CLI handler', () => {
    const root = tempProject();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleSmokeCommand({
      args: ['smoke', 'package', '--dry-run', '--task', 'T-0133', '--json'],
      paths: resolveHadaraPaths({ projectRoot: root }),
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report).toMatchObject({
      schemaVersion: 'hadara.packageSmoke.v1',
      command: 'package.smoke',
      mode: 'dry-run',
      readOnly: true
    });
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('keeps the CLI default path in dry-run mode without --execute', () => {
    const root = tempProject();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleSmokeCommand({
      args: ['smoke', 'package', '--json'],
      paths: resolveHadaraPaths({ projectRoot: root }),
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report).toMatchObject({
      mode: 'dry-run',
      readOnly: true,
      execution: {
        npmPackExecuted: false,
        packageInstallExecuted: false,
        featureSmokeExecuted: false
      }
    });
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('creates a Python provider dry-run report without executing Python tooling', () => {
    const root = tempProject();
    writePyproject(root);

    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      provider: 'python',
      taskId: 'T-0133',
      attachEvidence: true
    });

    expect(report).toMatchObject({
      ok: true,
      mode: 'dry-run',
      readOnly: true,
      provider: {
        ecosystem: 'python',
        smokeProfile: 'python-package-smoke'
      },
      networkPolicy: {
        mode: 'environment-inherited',
        enforced: false
      },
      execution: {
        npmPackExecuted: false,
        pythonBuildExecuted: false,
        twineCheckExecuted: false,
        pipInstallExecuted: false,
        packageInstallExecuted: false,
        publishExecuted: false
      }
    });
    expect(report.steps.map((step) => step.id)).toEqual(['validate-source', 'plan-workspace', 'python-build', 'twine-check', 'pip-install-wheel', 'evidence']);
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'python-build', command: 'python -m build', status: 'planned' }));
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'twine-check', command: 'twine check', status: 'planned' }));
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'pip-install-wheel', command: 'pip install wheel', status: 'planned' }));
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('plans Python offline mode as non-enforced best-effort command flags', () => {
    const root = tempProject();
    writePyproject(root);

    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      provider: 'python',
      networkPolicy: 'offline'
    });

    expect(report.networkPolicy).toMatchObject({
      mode: 'offline-best-effort',
      enforced: false
    });
    expect(report.networkPolicy.notes.join(' ')).toContain('No OS-level network isolation');
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'python-build', command: 'python -m build --no-isolation' }));
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'pip-install-wheel', command: 'pip install --no-index --no-deps wheel' }));
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('prints Python provider dry-run JSON through the smoke package CLI handler', () => {
    const root = tempProject();
    writePyproject(root);
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleSmokeCommand({
      args: ['smoke', 'package', '--provider', 'python', '--json'],
      paths: resolveHadaraPaths({ projectRoot: root }),
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report).toMatchObject({
      mode: 'dry-run',
      provider: {
        ecosystem: 'python',
        smokeProfile: 'python-package-smoke'
      }
    });
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });
});

describe('package smoke local execution', () => {
  it('creates a reduced schema-valid local execution report with cleanup', () => {
    const root = tempProject();
    const calls: Array<{ command: string; args: string[]; cwd: string; env?: NodeJS.ProcessEnv }> = [];
    let workspace = '';
    const runner: PackageSmokeCommandRunner = (command, args, options) => {
      calls.push({ command, args, cwd: options.cwd, env: options.env });
      if (args[0] === 'pack') {
        workspace = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return {
          status: 0,
          stdout: JSON.stringify([{ filename: 'hadara-0.0.0-bootstrap.tgz' }]),
          stderr: 'npm notice private path would be here',
          elapsedMs: 11
        };
      }
      if (args[0] === 'install') {
        installedFixtureFromArgs(args);
        return { status: 0, stdout: 'added 1 package', stderr: '', elapsedMs: 12 };
      }
      if (args[0] === 'doctor') {
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 13 };
      }
      if (args[0] === 'commands') {
        return { status: 0, stdout: commandsRegistryStdout(), stderr: '', elapsedMs: 5 };
      }
      if (args[0] === 'init') {
        writeGeneratedWorkflowFixture(options.cwd);
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 6 };
      }
      if (args[0] === 'smoke') {
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 14 };
      }
      return { status: 1, stdout: '', stderr: 'unexpected', elapsedMs: 1 };
    };

    const report = createPackageSmokeLocalReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      runner,
      timeoutSeconds: 30
    });
    const encoded = JSON.stringify(report);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.packageSmoke.v1',
      command: 'package.smoke',
      ok: true,
      mode: 'local',
      readOnly: false,
      provider: {
        ecosystem: 'npm',
        smokeProfile: 'npm-package-smoke',
        command: 'package.smoke'
      },
      execution: {
        npmPackExecuted: true,
        packageInstallExecuted: true,
        featureSmokeExecuted: true,
        releaseMutationExecuted: false,
        publishExecuted: false
      },
      privacy: {
        rawLogsIncluded: false,
        rawPackageContentsIncluded: false,
        privatePathsIncluded: false,
        environmentSecretsIncluded: false,
        privateStorePathsIncluded: false
      },
      issues: []
    });
    expect(report.steps.map((step) => step.id)).toEqual([
      'validate-source',
      'plan-workspace',
      'npm-pack',
      'install-cli',
      'doctor',
      'command-surface-drift',
      'generated-init-docs',
      'feature-smoke-core',
      'cleanup'
    ]);
    expect(report.steps.every((step) => step.status === 'passed')).toBe(true);
    expect(report.artifacts).toContainEqual(
      expect.objectContaining({
        kind: 'package-artifact',
        visibility: 'temporary',
        relativePath: 'hadara-0.0.0-bootstrap.tgz',
        rawContentIncluded: false,
        byteLength: 13
      })
    );
    expect(fs.existsSync(workspace)).toBe(false);
    expect(encoded).not.toContain(root);
    expect(encoded).not.toContain(workspace);
    expect(encoded).not.toContain('npm notice');
    expect(calls.map((call) => call.args[0])).toEqual(['pack', 'install', 'doctor', 'commands', 'init', 'smoke']);
    expect(calls.find((call) => call.args[0] === 'doctor')?.args).toEqual(['doctor', '--json']);
    expect(calls.find((call) => call.args[0] === 'init')?.args).toEqual(['init', '--profile', 'standard', '--json']);
    expect(calls.find((call) => call.args[0] === 'smoke')?.args).toEqual(['smoke', 'run', '--profile', 'core', '--json']);
    expect(calls.find((call) => call.args[0] === 'doctor')?.env?.HADARA_PROJECT_ROOT).toBe(root);
    expect(calls.find((call) => call.args[0] === 'init')?.env?.HADARA_PROJECT_ROOT).toBeUndefined();
    expect(calls.find((call) => call.args[0] === 'smoke')?.env?.HADARA_PROJECT_ROOT).toBe(root);
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('returns reduced failure details when isolated install fails', () => {
    const root = tempProject();
    const runner: PackageSmokeCommandRunner = (_command, args, options) => {
      if (args[0] === 'pack') {
        const workspace = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return {
          status: 0,
          stdout: JSON.stringify([{ filename: 'hadara-0.0.0-bootstrap.tgz' }]),
          stderr: '',
          elapsedMs: 10
        };
      }
      if (args[0] === 'install') {
        return { status: 1, stdout: '', stderr: '/home/alice/private install failure log', elapsedMs: 20 };
      }
      return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 1 };
    };

    const report = createPackageSmokeLocalReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      runner
    });
    const encoded = JSON.stringify(report);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'PACKAGE_SMOKE_INSTALL_FAILED',
      message: 'Package install failed in the isolated prefix.',
      stepId: 'install-cli'
    });
    expect(report.steps).toContainEqual(
      expect.objectContaining({
        id: 'doctor',
        status: 'skipped'
      })
    );
    expect(report.steps).toContainEqual(
      expect.objectContaining({
        id: 'feature-smoke-core',
        status: 'skipped'
      })
    );
    expect(encoded).not.toContain('/home/alice/private');
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('uses the single workspace tarball when npm pack returns no JSON stdout', () => {
    const root = tempProject();
    const runner: PackageSmokeCommandRunner = (_command, args, options) => {
      if (args[0] === 'pack') {
        const workspace = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return {
          status: 0,
          stdout: '',
          stderr: '',
          elapsedMs: 10
        };
      }
      if (args[0] === 'install') {
        installedFixtureFromArgs(args);
        return { status: 0, stdout: 'added 1 package', stderr: '', elapsedMs: 12 };
      }
      if (args[0] === 'commands') {
        return { status: 0, stdout: commandsRegistryStdout(), stderr: '', elapsedMs: 5 };
      }
      if (args[0] === 'init') {
        writeGeneratedWorkflowFixture(options.cwd);
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 6 };
      }
      return { status: 0, stdout: '', stderr: '', elapsedMs: 1 };
    };

    const report = createPackageSmokeLocalReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      runner,
      timeoutSeconds: 30
    });

    expect(report.ok).toBe(true);
    expect(report.steps.find((step) => step.id === 'npm-pack')).toMatchObject({
      status: 'passed',
      summary: 'npm pack produced a temporary package tarball.'
    });
    expect(report.artifacts).toContainEqual(
      expect.objectContaining({
        kind: 'package-artifact',
        relativePath: 'hadara-0.0.0-bootstrap.tgz'
      })
    );
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('fails the command-surface-drift step when installed registry ids differ from source (FD-011)', () => {
    const root = tempProject();
    const runner: PackageSmokeCommandRunner = (_command, args, options) => {
      if (args[0] === 'pack') {
        const workspace = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return { status: 0, stdout: JSON.stringify([{ filename: 'hadara-0.0.0-bootstrap.tgz' }]), stderr: '', elapsedMs: 10 };
      }
      if (args[0] === 'install') {
        installedFixtureFromArgs(args);
        return { status: 0, stdout: 'installed', stderr: '', elapsedMs: 11 };
      }
      if (args[0] === 'commands') {
        return { status: 0, stdout: commandsRegistryStdout({ extraId: 'ghost.command', dropFirstId: true }), stderr: '', elapsedMs: 5 };
      }
      if (args[0] === 'init') {
        writeGeneratedWorkflowFixture(options.cwd);
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 6 };
      }
      return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 12 };
    };

    const report = createPackageSmokeLocalReport({ paths: resolveHadaraPaths({ projectRoot: root }), runner, timeoutSeconds: 30 });

    expect(report.ok).toBe(false);
    expect(report.steps.find((step) => step.id === 'command-surface-drift')).toMatchObject({ status: 'failed' });
    const drift = report.issues.find((issue) => issue.code === 'PACKAGE_SMOKE_SURFACE_REGISTRY_DRIFT');
    expect(drift).toBeDefined();
    expect(drift?.message).toContain('ghost.command');
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('falls back to the installed node entrypoint when shell wrapper stdout capture is empty', () => {
    const root = tempProject();
    let fallbackUsed = false;
    const runner: PackageSmokeCommandRunner = (command, args, options) => {
      if (args[0] === 'pack') {
        const workspace = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return { status: 0, stdout: JSON.stringify([{ filename: 'hadara-0.0.0-bootstrap.tgz' }]), stderr: '', elapsedMs: 10 };
      }
      if (args[0] === 'install') {
        installedFixtureFromArgs(args);
        return { status: 0, stdout: 'installed', stderr: '', elapsedMs: 11 };
      }
      if (args[0] === 'commands') {
        return { status: 0, stdout: '', stderr: '', elapsedMs: 5 };
      }
      if (command === process.execPath && args[1] === 'commands') {
        fallbackUsed = true;
        return { status: 0, stdout: commandsRegistryStdout(), stderr: '', elapsedMs: 5 };
      }
      if (args[0] === 'init') {
        writeGeneratedWorkflowFixture(options.cwd);
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 6 };
      }
      return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 12 };
    };

    const report = createPackageSmokeLocalReport({ paths: resolveHadaraPaths({ projectRoot: root }), runner, timeoutSeconds: 30 });

    expect(fallbackUsed).toBe(true);
    expect(report.ok).toBe(true);
    expect(report.steps.find((step) => step.id === 'command-surface-drift')).toMatchObject({
      status: 'passed',
      command: 'node <installed-package>/dist/cli/main.js commands --json + installed dist routing parse'
    });
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('fails the command-surface-drift step when installed routing loses a registry verb (FD-011)', () => {
    const root = tempProject();
    const runner: PackageSmokeCommandRunner = (_command, args, options) => {
      if (args[0] === 'pack') {
        const workspace = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return { status: 0, stdout: JSON.stringify([{ filename: 'hadara-0.0.0-bootstrap.tgz' }]), stderr: '', elapsedMs: 10 };
      }
      if (args[0] === 'install') {
        installedFixtureFromArgs(args, { dropVerb: 'doctor' });
        return { status: 0, stdout: 'installed', stderr: '', elapsedMs: 11 };
      }
      if (args[0] === 'commands') {
        return { status: 0, stdout: commandsRegistryStdout(), stderr: '', elapsedMs: 5 };
      }
      if (args[0] === 'init') {
        writeGeneratedWorkflowFixture(options.cwd);
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 6 };
      }
      return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 12 };
    };

    const report = createPackageSmokeLocalReport({ paths: resolveHadaraPaths({ projectRoot: root }), runner, timeoutSeconds: 30 });

    expect(report.ok).toBe(false);
    const drift = report.issues.find((issue) => issue.code === 'PACKAGE_SMOKE_SURFACE_ROUTING_DRIFT');
    expect(drift).toBeDefined();
    expect(drift?.message).toContain('doctor');
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('fails the generated-init-docs step when generated workflow guidance is stale', () => {
    const root = tempProject();
    const runner: PackageSmokeCommandRunner = (_command, args, options) => {
      if (args[0] === 'pack') {
        const workspace = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return { status: 0, stdout: JSON.stringify([{ filename: 'hadara-0.0.0-bootstrap.tgz' }]), stderr: '', elapsedMs: 10 };
      }
      if (args[0] === 'install') {
        installedFixtureFromArgs(args);
        return { status: 0, stdout: 'installed', stderr: '', elapsedMs: 11 };
      }
      if (args[0] === 'commands') {
        return { status: 0, stdout: commandsRegistryStdout(), stderr: '', elapsedMs: 5 };
      }
      if (args[0] === 'init') {
        writeGeneratedWorkflowFixture(options.cwd, { stale: true });
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 6 };
      }
      return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 12 };
    };

    const report = createPackageSmokeLocalReport({ paths: resolveHadaraPaths({ projectRoot: root }), runner, timeoutSeconds: 30 });

    expect(report.ok).toBe(false);
    expect(report.steps.find((step) => step.id === 'generated-init-docs')).toMatchObject({ status: 'failed' });
    expect(report.issues.some((issue) => issue.code === 'PACKAGE_SMOKE_INIT_DOCS_STALE_LIFECYCLE_GUIDANCE')).toBe(true);
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('rejects execution workspaces inside the project source tree', () => {
    const root = tempProject();
    const runner = vi.fn<PackageSmokeCommandRunner>();

    const report = createPackageSmokeLocalReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      workspace: 'tmp/package-smoke',
      runner
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'PACKAGE_SMOKE_WORKSPACE_INSIDE_PROJECT',
      message: 'Package-smoke execution workspace must be outside the project source tree.'
    });
    expect(runner).not.toHaveBeenCalled();
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('attaches reduced public package-smoke evidence when requested', () => {
    const root = tempProject();
    const runner: PackageSmokeCommandRunner = (_command, args, options) => {
      if (args[0] === 'pack') {
        const workspace = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return { status: 0, stdout: JSON.stringify([{ filename: 'hadara-0.0.0-bootstrap.tgz' }]), stderr: '/private/raw/path', elapsedMs: 10 };
      }
      if (args[0] === 'install') {
        installedFixtureFromArgs(args);
        return { status: 0, stdout: 'installed', stderr: '', elapsedMs: 11 };
      }
      if (args[0] === 'commands') return { status: 0, stdout: commandsRegistryStdout(), stderr: '', elapsedMs: 5 };
      if (args[0] === 'init') {
        writeGeneratedWorkflowFixture(options.cwd);
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 6 };
      }
      return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 12 };
    };

    const report = createPackageSmokeLocalReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      taskId: 'T-0136',
      attachEvidence: true,
      runner
    });
    const taskDir = path.join(root, 'tasks', 'T-0136-smoke-evidence-integration');
    const evidenceIndex = fs.readFileSync(path.join(taskDir, 'evidence.jsonl'), 'utf8');
    const evidenceRecord = JSON.parse(evidenceIndex.trim()) as { schemaVersion: string; evidencePath?: string; legacy?: { evidencePath?: string; result?: string }; visibility: string; result?: string };
    const evidencePath = evidenceRecord.schemaVersion === 'hadara.evidence.v2' ? evidenceRecord.legacy?.evidencePath : evidenceRecord.evidencePath;
    const artifact = fs.readFileSync(path.join(taskDir, evidencePath ?? ''), 'utf8');

    expect(report.ok).toBe(true);
    expect(report.artifacts).toContainEqual(
      expect.objectContaining({
        kind: 'summary',
        visibility: 'public',
        evidencePath: expect.stringMatching(/^tasks\/T-0136-smoke-evidence-integration\/artifacts\/package-smoke\/.+-summary\.json$/),
        rawContentIncluded: false
      })
    );
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'evidence', status: 'passed' }));
    expect(evidenceRecord).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      visibility: 'public',
      legacy: { result: 'passed' }
    });
    expect(evidencePath).toMatch(/^artifacts\/package-smoke\/.+-summary\.json$/);
    expect(artifact).toContain('"schemaVersion": "hadara.smokeEvidenceSummary.v1"');
    expect(artifact).toContain('"category": "package-smoke"');
    expect(artifact).not.toContain('/private/raw/path');
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('creates a reduced Python local mode report without publish or PyPI behavior', () => {
    const root = tempProject();
    writePyproject(root);
    const calls: Array<{ command: string; args: string[]; cwd: string }> = [];
    let workspace = '';
    const runner: PackageSmokeCommandRunner = (command, args, options) => {
      calls.push({ command, args, cwd: options.cwd });
      if (args[0] === '-m' && args[1] === 'build') {
        workspace = String(args[args.indexOf('--outdir') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara_python_tools-0.0.1-py3-none-any.whl'), 'wheel bytes', 'utf8');
        fs.writeFileSync(path.join(workspace, 'hadara-python-tools-0.0.1.tar.gz'), 'sdist bytes', 'utf8');
        return { status: 0, stdout: 'built distributions', stderr: '/private/python/build', elapsedMs: 11 };
      }
      if (args[0] === 'check') return { status: 0, stdout: 'PASSED', stderr: '', elapsedMs: 12 };
      if (args[0] === '-m' && args[1] === 'pip') return { status: 0, stdout: 'installed', stderr: '', elapsedMs: 13 };
      return { status: 1, stdout: '', stderr: 'unexpected', elapsedMs: 1 };
    };

    const report = createPackageSmokeLocalReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      provider: 'python',
      runner
    });
    const encoded = JSON.stringify(report);

    expect(report).toMatchObject({
      ok: true,
      mode: 'local',
      readOnly: false,
      provider: {
        ecosystem: 'python',
        smokeProfile: 'python-package-smoke'
      },
      networkPolicy: {
        mode: 'environment-inherited',
        enforced: false
      },
      execution: {
        npmPackExecuted: false,
        pythonBuildExecuted: true,
        twineCheckExecuted: true,
        pipInstallExecuted: true,
        packageInstallExecuted: true,
        featureSmokeExecuted: false,
        releaseMutationExecuted: false,
        publishExecuted: false
      },
      privacy: {
        rawLogsIncluded: false,
        privatePathsIncluded: false,
        environmentSecretsIncluded: false
      },
      issues: []
    });
    expect(report.steps.map((step) => step.id)).toEqual(['validate-source', 'plan-workspace', 'python-build', 'twine-check', 'pip-install-wheel', 'cleanup']);
    expect(report.artifacts).toContainEqual(expect.objectContaining({ kind: 'package-artifact', visibility: 'temporary', relativePath: 'dist/hadara_python_tools-0.0.1-py3-none-any.whl' }));
    expect(report.artifacts).toContainEqual(expect.objectContaining({ kind: 'install-tree', visibility: 'temporary', relativePath: 'python-install' }));
    expect(calls[0].args.slice(0, 2)).toEqual(['-m', 'build']);
    expect(calls[1].args[0]).toBe('check');
    expect(calls[2].args.slice(0, 2)).toEqual(['-m', 'pip']);
    expect(fs.existsSync(workspace)).toBe(false);
    expect(encoded).not.toContain('/private/python/build');
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('applies Python local offline flags without claiming network enforcement', () => {
    const root = tempProject();
    writePyproject(root);
    const calls: Array<{ args: string[] }> = [];
    const runner: PackageSmokeCommandRunner = (_command, args) => {
      calls.push({ args });
      if (args[0] === '-m' && args[1] === 'build') {
        const workspace = String(args[args.indexOf('--outdir') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara_python_tools-0.0.1-py3-none-any.whl'), 'wheel bytes', 'utf8');
        return { status: 0, stdout: 'built distributions', stderr: '', elapsedMs: 11 };
      }
      if (args[0] === 'check') return { status: 0, stdout: 'PASSED', stderr: '', elapsedMs: 12 };
      if (args[0] === '-m' && args[1] === 'pip') return { status: 0, stdout: 'installed', stderr: '', elapsedMs: 13 };
      return { status: 1, stdout: '', stderr: 'unexpected', elapsedMs: 1 };
    };

    const report = createPackageSmokeLocalReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      provider: 'python',
      networkPolicy: 'offline',
      runner
    });

    expect(report.ok).toBe(true);
    expect(report.networkPolicy).toMatchObject({ mode: 'offline-best-effort', enforced: false });
    expect(calls[0].args).toContain('--no-isolation');
    expect(calls[2].args).toEqual(expect.arrayContaining(['--no-index', '--no-deps']));
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'python-build', command: 'python -m build --no-isolation --outdir <redacted-workspace>' }));
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'pip-install-wheel', command: 'pip install --no-index --no-deps wheel --target <redacted-target>' }));
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('attaches reduced public Python package-smoke evidence when requested', () => {
    const root = tempProject();
    writePyproject(root);
    const runner: PackageSmokeCommandRunner = (_command, args) => {
      if (args[0] === '-m' && args[1] === 'build') {
        const workspace = String(args[args.indexOf('--outdir') + 1]);
        fs.writeFileSync(path.join(workspace, 'hadara_python_tools-0.0.1-py3-none-any.whl'), 'wheel bytes', 'utf8');
        return { status: 0, stdout: 'built distributions', stderr: '/private/python/build', elapsedMs: 11 };
      }
      if (args[0] === 'check') return { status: 0, stdout: 'PASSED', stderr: '', elapsedMs: 12 };
      if (args[0] === '-m' && args[1] === 'pip') return { status: 0, stdout: 'installed', stderr: '', elapsedMs: 13 };
      return { status: 1, stdout: '', stderr: 'unexpected', elapsedMs: 1 };
    };

    const report = createPackageSmokeLocalReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      provider: 'python',
      taskId: 'T-0136',
      attachEvidence: true,
      runner
    });
    const taskDir = path.join(root, 'tasks', 'T-0136-smoke-evidence-integration');
    const evidenceIndex = fs.readFileSync(path.join(taskDir, 'evidence.jsonl'), 'utf8');
    const evidenceRecord = JSON.parse(evidenceIndex.trim()) as { schemaVersion: string; legacy?: { evidencePath?: string; result?: string }; visibility: string };
    const evidencePath = evidenceRecord.legacy?.evidencePath;
    const artifact = JSON.parse(fs.readFileSync(path.join(taskDir, evidencePath ?? ''), 'utf8')) as Record<string, unknown>;

    expect(report.ok).toBe(true);
    expect(report.artifacts).toContainEqual(expect.objectContaining({ kind: 'summary', visibility: 'public', rawContentIncluded: false }));
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'evidence', status: 'passed' }));
    expect(evidenceRecord).toMatchObject({ schemaVersion: 'hadara.evidence.v2', visibility: 'public', legacy: { result: 'passed' } });
    expect(artifact).toMatchObject({
      schemaVersion: 'hadara.smokeEvidenceSummary.v1',
      category: 'package-smoke',
      sourceReport: {
        provider: {
          ecosystem: 'python',
          smokeProfile: 'python-package-smoke'
        },
        networkPolicy: {
          mode: 'environment-inherited',
          enforced: false
        }
      }
    });
    expect(JSON.stringify(artifact)).not.toContain('/private/python/build');
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });
});
