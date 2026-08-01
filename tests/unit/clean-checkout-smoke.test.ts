import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleSmokeCommand } from '../../tools/dev-surface-handlers';
import { resolveHadaraPaths } from '../../src/core/paths';
import { validateSchema } from '../../src/core/schema';
import { CleanCheckoutCommandRunner, createCleanCheckoutSmokeReport } from '../../tools/dev-surface/clean-checkout-smoke';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-clean-checkout-source-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
  fs.mkdirSync(path.join(root, 'tasks', 'T-0136-smoke-evidence-integration'), { recursive: true });
  fs.writeFileSync(path.join(root, 'tasks', 'T-0136-smoke-evidence-integration', 'TASK.md'), '# T-0136 Smoke evidence integration\n', 'utf8');
  fs.mkdirSync(path.join(root, '.hadara', 'local', 'portable', 'data', 'private-evidence'), { recursive: true });
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  fs.mkdirSync(path.join(root, 'node_modules'), { recursive: true });
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ scripts: { build: 'tsc', check: 'vitest' } }), 'utf8');
  fs.writeFileSync(path.join(root, 'package-lock.json'), '{}', 'utf8');
  fs.writeFileSync(path.join(root, 'src-marker.txt'), 'stable source marker', 'utf8');
  fs.writeFileSync(path.join(root, 'dist', 'generated.js'), 'generated', 'utf8');
  fs.writeFileSync(path.join(root, 'node_modules', 'dependency.txt'), 'dependency', 'utf8');
  fs.writeFileSync(path.join(root, '.hadara', 'local', 'portable', 'data', 'private-evidence', 'raw.log'), 'private raw', 'utf8');
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('clean checkout smoke', () => {
  it('runs the source-checkout sequence in a disposable copy with reduced output and cleanup', () => {
    const root = tempProject();
    const calls: Array<{ command: string; args: string[]; cwd: string }> = [];
    let checkout = '';
    const runner: CleanCheckoutCommandRunner = (command, args, options) => {
      calls.push({ command, args, cwd: options.cwd });
      checkout = options.cwd;
      return {
        status: 0,
        stdout: args.includes('--json') ? JSON.stringify({ ok: true }) : 'raw command stdout with /home/alice/private',
        stderr: 'raw command stderr with token=secret',
        elapsedMs: 5
      };
    };

    const report = createCleanCheckoutSmokeReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      runner,
      timeoutSeconds: 30
    });
    const encoded = JSON.stringify(report);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.cleanCheckoutSmoke.v1',
      command: 'smoke.cleanCheckout',
      ok: true,
      mode: 'execute',
      execution: {
        sourceCopied: true,
        dependencyInstallExecuted: true,
        buildExecuted: true,
        checkExecuted: true,
        builtCliSmokeExecuted: true,
        packageInstallExecuted: false,
        releaseMutationExecuted: false,
        publishExecuted: false
      },
      workspace: {
        kind: 'disposable-clean-checkout',
        displayPath: '<redacted-clean-checkout-workspace>',
        pathRedacted: true,
        retention: 'deleted'
      },
      source: {
        kind: 'source-checkout',
        displayPath: '.',
        relativePath: '.',
        pathRedacted: true,
        mutated: false
      },
      issues: []
    });
    expect(report.steps.map((step) => step.id)).toEqual(['copy-source', 'npm-ci', 'build', 'check', 'doctor', 'task-status', 'release-gate-strict', 'cleanup']);
    expect(report.steps.every((step) => step.status === 'passed')).toBe(true);
    expect(calls.map((call) => call.args.join(' '))).toEqual([
      'ci',
      'run build',
      'run check',
      'dist/cli/main.js doctor --json --project .',
      'dist/cli/main.js task status --json --project .',
      '--import tsx tools/dev-surfaces.ts release gate --mode strict --json --project .'
    ]);
    expect(fs.existsSync(checkout)).toBe(false);
    expect(fs.readFileSync(path.join(root, 'src-marker.txt'), 'utf8')).toBe('stable source marker');
    expect(encoded).not.toContain(root);
    expect(encoded).not.toContain(checkout);
    expect(encoded).not.toContain('/home/alice/private');
    expect(encoded).not.toContain('token=secret');
    expect(validateSchema('hadara.cleanCheckoutSmoke.v1', report).ok).toBe(true);
  });

  it('requires explicit execute before running npm commands', () => {
    const root = tempProject();
    const runner = vi.fn<CleanCheckoutCommandRunner>();

    const report = createCleanCheckoutSmokeReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      runner
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'CLEAN_CHECKOUT_SMOKE_EXECUTION_REQUIRED',
      message: 'Clean-checkout smoke requires explicit --execute because it runs npm commands in a disposable copy.'
    });
    expect(runner).not.toHaveBeenCalled();
    expect(validateSchema('hadara.cleanCheckoutSmoke.v1', report).ok).toBe(true);
  });

  it('fails with reduced issue details and skips later steps', () => {
    const root = tempProject();
    const runner: CleanCheckoutCommandRunner = (_command, args) => {
      if (args[0] === 'ci') {
        return { status: 1, stdout: '', stderr: '/tmp/private npm failure log', elapsedMs: 9 };
      }
      return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: '', elapsedMs: 1 };
    };

    const report = createCleanCheckoutSmokeReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      runner
    });
    const encoded = JSON.stringify(report);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'CLEAN_CHECKOUT_STEP_FAILED',
      message: 'npm ci failed during clean-checkout smoke.',
      stepId: 'npm-ci'
    });
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'build', status: 'skipped' }));
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'release-gate-strict', status: 'skipped' }));
    expect(encoded).not.toContain('/tmp/private');
    expect(validateSchema('hadara.cleanCheckoutSmoke.v1', report).ok).toBe(true);
  });

  it('rejects clean-checkout workspaces inside the source workspace', () => {
    const root = tempProject();
    const runner = vi.fn<CleanCheckoutCommandRunner>();

    const report = createCleanCheckoutSmokeReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      workspace: 'tmp/clean-checkout',
      runner
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'CLEAN_CHECKOUT_WORKSPACE_INSIDE_PROJECT',
      message: 'Clean-checkout smoke workspace must be outside the source workspace.'
    });
    expect(runner).not.toHaveBeenCalled();
    expect(validateSchema('hadara.cleanCheckoutSmoke.v1', report).ok).toBe(true);
  });

  it('prints JSON through the smoke CLI handler', () => {
    const root = tempProject();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(
      handleSmokeCommand({
        args: ['smoke', 'clean-checkout', '--json'],
        paths: resolveHadaraPaths({ projectRoot: root }),
        jsonOutput: true
      })
    ).toBe(true);

    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report).toMatchObject({
      schemaVersion: 'hadara.cleanCheckoutSmoke.v1',
      command: 'smoke.cleanCheckout',
      ok: false,
      mode: 'execute'
    });
    expect(validateSchema('hadara.cleanCheckoutSmoke.v1', report).ok).toBe(true);
  });

  it('attaches reduced public clean-checkout smoke evidence when requested', () => {
    const root = tempProject();
    const runner: CleanCheckoutCommandRunner = (_command, args) => ({
      status: 0,
      stdout: args.includes('--json') ? JSON.stringify({ ok: true }) : 'raw stdout /home/alice/private',
      stderr: 'raw stderr token=secret',
      elapsedMs: 5
    });

    const report = createCleanCheckoutSmokeReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      taskId: 'T-0136',
      attachEvidence: true,
      runner
    });
    expect(report.taskId).toBe('T-0136');
    const taskDir = path.join(root, 'tasks', 'T-0136-smoke-evidence-integration');
    const evidenceRecord = JSON.parse(fs.readFileSync(path.join(taskDir, 'evidence.jsonl'), 'utf8').trim()) as {
      schemaVersion: string;
      legacy?: { evidencePath?: string; result?: string };
      evidencePath?: string;
      visibility: string;
      result: string;
    };
    const evidencePath = evidenceRecord.schemaVersion === 'hadara.evidence.v2' ? evidenceRecord.legacy?.evidencePath : evidenceRecord.evidencePath;
    const artifact = fs.readFileSync(path.join(taskDir, evidencePath ?? ''), 'utf8');

    expect(report.ok).toBe(true);
    expect(report.artifacts).toContainEqual(
      expect.objectContaining({
        kind: 'summary',
        visibility: 'public',
        evidencePath: expect.stringMatching(/^tasks\/T-0136-smoke-evidence-integration\/artifacts\/clean-checkout-smoke\/.+-summary\.json$/),
        rawContentIncluded: false
      })
    );
    expect(report.steps).toContainEqual(expect.objectContaining({ id: 'evidence', status: 'passed' }));
    expect(evidenceRecord).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      visibility: 'public',
      legacy: { result: 'passed' }
    });
    expect(evidencePath).toMatch(/^artifacts\/clean-checkout-smoke\/.+-summary\.json$/);
    expect(artifact).toContain('"category": "clean-checkout-smoke"');
    expect(artifact).not.toContain('/home/alice/private');
    expect(artifact).not.toContain('token=secret');
    expect(validateSchema('hadara.cleanCheckoutSmoke.v1', report).ok).toBe(true);
  });
});
