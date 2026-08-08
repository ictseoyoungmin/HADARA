import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handlePackageCommand } from '../../tools/dev-surface-handlers';
import { resolveHadaraPaths } from '../../src/core/paths';
import { validateSchema } from '../../src/core/schema';
import {
  createPackageRecycleDryRunReport,
  createPackageRecycleExecuteReport,
  PackageRecycleCommandRunner
} from '../../tools/dev-surface/package-recycle';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-package-recycle-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'tasks', 'T-0413-installed-package-recycle-script-ux'), { recursive: true });
  fs.writeFileSync(path.join(root, 'tasks', 'T-0413-installed-package-recycle-script-ux', 'TASK.md'), '# T-0413\n', 'utf8');
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('installed package recycle', () => {
  it('creates a schema-valid dry-run plan without registry or install execution', () => {
    const root = tempProject();
    const report = createPackageRecycleDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      packageSpecifier: 'hadara@latest',
      expectedVersion: '0.3.3',
      taskId: 'T-0413',
      attachEvidence: true
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.packageRecycle.v1',
      command: 'package.recycle',
      ok: true,
      taskId: 'T-0413',
      mode: 'dry-run',
      readOnly: true,
      package: {
        specifier: 'hadara@latest',
        name: 'hadara',
        expectedVersion: '0.3.3',
        observedVersion: null,
        latestVersion: null
      },
      execution: {
        npmViewExecuted: false,
        npmDistTagExecuted: false,
        packageInstallExecuted: false,
        installedVersionExecuted: false,
        commandSurfaceExecuted: false,
        lifecycleHelpExecuted: false,
        initExecuted: false,
        taskStatusExecuted: false,
        contextSmokeExecuted: false,
        releaseMutationExecuted: false,
        publishExecuted: false
      },
      privacy: {
        rawLogsIncluded: false,
        rawPackageContentsIncluded: false,
        privatePathsIncluded: false,
        environmentSecretsIncluded: false,
        privateStorePathsIncluded: false
      }
    });
    expect(report.steps.map((step) => step.id)).toEqual([
      'plan-workspace',
      'npm-view-version',
      'npm-dist-tags',
      'install-package',
      'installed-version',
      'command-surface',
      'help-lifecycle',
      'init-project',
      'task-create',
      'task-status',
      'status-ingress',
      'task-close',
      'context-slice',
      'cleanup'
    ]);
    expect(report.rootRoles).toMatchObject({
      sourceRoot: { role: 'sourceRoot', fromOption: '--project' },
      evidenceRoot: { role: 'evidenceRoot', fromOption: '--project' },
      smokeProjectRoot: { role: 'smokeProjectRoot', fromOption: 'default-disposable' }
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_RECYCLE_PROJECT_ALIAS_ROOTS' }));
    expect(report.steps.map((step) => step.id)).not.toContain('context-graph');
    expect(report.steps.every((step) => step.status === 'planned')).toBe(true);
    expect(validateSchema('hadara.packageRecycle.v1', report).ok).toBe(true);
  });

  it('executes the registry consumer path with a fake runner and keeps output reduced', () => {
    const root = tempProject();
    const calls: string[] = [];
    process.env.HADARA_PROJECT_ROOT = root;
    const projectRoots: Array<string | undefined> = [];
    const runner: PackageRecycleCommandRunner = (command, args, options) => {
      calls.push([command, ...args].join(' '));
      if (command !== 'npm') projectRoots.push(options.env?.HADARA_PROJECT_ROOT);
      const joined = args.join(' ');
      if (joined === 'view hadara@latest version --json') return passed('"0.3.3"');
      if (joined === 'dist-tag ls hadara') return passed('latest: 0.3.3\nnext: 0.3.3-rc.0\n');
      if (joined.startsWith('install -g --prefix')) return passed('');
      if (joined === 'version --json') return passed(JSON.stringify({ ok: true, packageVersion: '0.3.3' }));
      if (joined === 'commands --json') return passed(commandsJson(['task.status', 'task.close']));
      if (joined === 'help lifecycle --json') return passed(JSON.stringify({ ok: true, schemaVersion: 'hadara.lifecycleGuide.v1' }));
      if (joined === 'init --json') return passed(JSON.stringify({ ok: true, planHash: 'init-plan-hash' }));
      if (joined === 'init --execute --plan-hash init-plan-hash --json') return passed(JSON.stringify({ ok: true, mode: 'applied' }));
      if (joined === 'task create Installed package recycle smoke --json') return passed(JSON.stringify({ ok: true, task: { id: 'T-0001' } }));
      if (joined === 'task status --task T-0001 --json') return passed(JSON.stringify({ ok: true }));
      if (joined === 'task status --json') return passed(JSON.stringify({ ok: true }));
      if (joined === 'task close --task T-0001 --dry-run --json') return { status: 6, stdout: JSON.stringify({ schemaVersion: 'hadara.task.close.summary.v1', mode: 'dry-run', ok: false }), stderr: '', elapsedMs: 1 };
      if (joined === 'context slice --path docs/TASK_BOARD.md --from 1 --to 20 --json') return passed(JSON.stringify({ ok: true }));
      return failed();
    };

    const report = createPackageRecycleExecuteReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      packageSpecifier: 'hadara@latest',
      expectedVersion: '0.3.3',
      runner
    });
    const encoded = JSON.stringify(report);

    expect(report.ok).toBe(true);
    expect(report.mode).toBe('execute');
    expect(report.package).toMatchObject({
      observedVersion: '0.3.3',
      latestVersion: '0.3.3',
      distTags: {
        latest: '0.3.3',
        next: '0.3.3-rc.0'
      }
    });
    expect(report.execution).toMatchObject({
      npmViewExecuted: true,
      npmDistTagExecuted: true,
      packageInstallExecuted: true,
      installedVersionExecuted: true,
      commandSurfaceExecuted: true,
      lifecycleHelpExecuted: true,
      initExecuted: true,
      taskStatusExecuted: true,
      contextSmokeExecuted: true,
      releaseMutationExecuted: false,
      publishExecuted: false
    });
    expect(report.timeoutPolicy).toMatchObject({
      scope: 'per-step',
      defaultTimeoutSeconds: 300,
      effectiveTimeoutSeconds: 300,
      timeoutStepIds: []
    });
    expect(calls).toContain('npm view hadara@latest version --json');
    expect(calls.some((call) => call.includes('init --execute --plan-hash init-plan-hash --json'))).toBe(true);
    expect(calls.some((call) => call.includes('commands --json'))).toBe(true);
    expect(calls.some((call) => call.includes('context graph --json'))).toBe(false);
    expect(calls.some((call) => call.includes('task close --task T-0001 --dry-run --json'))).toBe(true);
    expect(calls.some((call) => call.includes('task lifecycle'))).toBe(false);
    expect(projectRoots.every((value) => value === undefined)).toBe(true);
    expect(encoded).not.toContain(root);
    expect(encoded).not.toContain('node_modules');
    expect(validateSchema('hadara.packageRecycle.v1', report).ok).toBe(true);
  });

  it('includes context graph only when explicitly requested', () => {
    const root = tempProject();
    const dryRun = createPackageRecycleDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      includeGraph: true
    });
    expect(dryRun.steps.map((step) => step.id)).toContain('context-graph');

    const calls: string[] = [];
    const runner: PackageRecycleCommandRunner = (command, args) => {
      calls.push([command, ...args].join(' '));
      const joined = args.join(' ');
      if (joined === 'view hadara@latest version --json') return passed('"0.3.3"');
      if (joined === 'dist-tag ls hadara') return passed('latest: 0.3.3\nnext: 0.3.3-rc.0\n');
      if (joined.startsWith('install -g --prefix')) return passed('');
      if (joined === 'version --json') return passed(JSON.stringify({ ok: true, packageVersion: '0.3.3' }));
      if (joined === 'commands --json') return passed(commandsJson(['task.status']));
      if (joined === 'help lifecycle --json') return passed(JSON.stringify({ ok: true }));
      if (joined === 'init --json') return passed(JSON.stringify({ ok: true, planHash: 'init-plan-hash' }));
      if (joined === 'init --execute --plan-hash init-plan-hash --json') return passed(JSON.stringify({ ok: true, mode: 'applied' }));
      if (joined === 'task create Installed package recycle smoke --json') return passed(JSON.stringify({ ok: true, task: { id: 'T-0001' } }));
      if (joined === 'task status --task T-0001 --json') return passed(JSON.stringify({ ok: true }));
      if (joined === 'task status --json') return passed(JSON.stringify({ ok: true }));
      if (joined === 'task close --task T-0001 --dry-run --json') return { status: 6, stdout: JSON.stringify({ schemaVersion: 'hadara.task.close.v3', mode: 'dry-run', ok: false }), stderr: '', elapsedMs: 1 };
      if (joined === 'context graph --json') return passed(JSON.stringify({ ok: true }));
      if (joined === 'context slice --path docs/TASK_BOARD.md --from 1 --to 20 --json') return passed(JSON.stringify({ ok: true }));
      return failed();
    };

    const report = createPackageRecycleExecuteReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      expectedVersion: '0.3.3',
      includeGraph: true,
      runner
    });

    expect(report.ok).toBe(true);
    expect(calls.some((call) => call.includes('context graph --json'))).toBe(true);
    expect(validateSchema('hadara.packageRecycle.v1', report).ok).toBe(true);
  });

  it('fails clearly when the observed registry version differs from the expected version', () => {
    const root = tempProject();
    const runner: PackageRecycleCommandRunner = (_command, args) => {
      if (args.join(' ') === 'view hadara@latest version --json') return passed('"0.3.2"');
      if (args.join(' ') === 'dist-tag ls hadara') return passed('latest: 0.3.2\n');
      return passed('');
    };

    const report = createPackageRecycleExecuteReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      expectedVersion: '0.3.3',
      runner
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_RECYCLE_VERSION_MISMATCH',
        stepId: 'npm-view-version'
      })
    );
    expect(report.steps).toContainEqual(
      expect.objectContaining({
        id: 'install-package',
        status: 'skipped'
      })
    );
    expect(validateSchema('hadara.packageRecycle.v1', report).ok).toBe(true);
  });

  it('prints JSON through the package recycle CLI handler', () => {
    const root = tempProject();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handlePackageCommand({
      args: ['package', 'recycle', '--package', 'hadara@latest', '--expected-version', '0.3.3', '--json'],
      paths: resolveHadaraPaths({ projectRoot: root }),
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report).toMatchObject({
      schemaVersion: 'hadara.packageRecycle.v1',
      command: 'package.recycle',
      mode: 'dry-run',
      readOnly: true
    });
    expect(validateSchema('hadara.packageRecycle.v1', report).ok).toBe(true);
  });
});

function passed(stdout: string) {
  return {
    status: 0,
    stdout,
    stderr: '',
    elapsedMs: 1
  };
}

function failed() {
  return {
    status: 1,
    stdout: '',
    stderr: 'failed',
    elapsedMs: 1
  };
}

function commandsJson(ids: string[]) {
  return JSON.stringify({
    ok: true,
    commands: ids.map((id) => ({
      id,
      command: `hadara ${id.replace('.', ' ')} [--json]`
    }))
  });
}
