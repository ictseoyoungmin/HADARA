import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskUpgradeScaffoldReport } from '../../src/task/task-upgrade-scaffold';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-upgrade-scaffold-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('task upgrade scaffold report', () => {
  it('dry-runs missing frame insertion without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Legacy plan');
    const planPath = path.join(task.dir, 'PLAN.md');
    fs.writeFileSync(planPath, '# Plan\n\nLegacy prose stays.\n', 'utf8');

    const report = createTaskUpgradeScaffoldReport(root, task.id, 'dry-run');

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.upgrade_scaffold.v1',
      command: 'task.upgrade-scaffold',
      ok: true,
      mode: 'dry-run',
      taskId: task.id
    });
    expect(report.actions.find((action) => action.path.endsWith('/PLAN.md'))).toMatchObject({
      status: 'planned',
      expectedBeforeExists: true
    });
    expect(fs.readFileSync(planPath, 'utf8')).toBe('# Plan\n\nLegacy prose stays.\n');
    expect(validateSchema('hadara.task.upgrade_scaffold.v1', report).ok).toBe(true);
  });

  it('executes non-destructive frame insertion and is idempotent', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Legacy execute');
    const planPath = path.join(task.dir, 'PLAN.md');
    fs.writeFileSync(planPath, '# Plan\n\nLegacy prose stays.\n', 'utf8');

    const executeReport = createTaskUpgradeScaffoldReport(root, task.id, 'execute');
    const updated = fs.readFileSync(planPath, 'utf8');

    expect(executeReport.summary.changed).toBeGreaterThan(0);
    expect(updated).toContain('Legacy prose stays.');
    expect(updated).toContain('| Step | Action | Status | Evidence |');

    const rerun = createTaskUpgradeScaffoldReport(root, task.id, 'execute');
    expect(rerun.actions.find((action) => action.path.endsWith('/PLAN.md'))).toMatchObject({
      status: 'skipped'
    });
    expect(fs.readFileSync(planPath, 'utf8')).toBe(updated);
  });

  it('creates missing standard files and empty evidence index only when executing', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Missing files');
    fs.rmSync(path.join(task.dir, 'FILES.md'));
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));

    const dryRun = createTaskUpgradeScaffoldReport(root, task.id, 'dry-run');
    expect(dryRun.actions.filter((action) => action.status === 'planned').map((action) => path.basename(action.path))).toEqual(
      expect.arrayContaining(['FILES.md', 'evidence.jsonl'])
    );
    expect(fs.existsSync(path.join(task.dir, 'FILES.md'))).toBe(false);
    expect(fs.existsSync(path.join(task.dir, 'evidence.jsonl'))).toBe(false);

    const execute = createTaskUpgradeScaffoldReport(root, task.id, 'execute');
    expect(execute.ok).toBe(true);
    expect(fs.readFileSync(path.join(task.dir, 'FILES.md'), 'utf8')).toContain('| Path | Action | Reason | Status |');
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
  });

  it('skips ambiguous non-canonical semantic tables', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Ambiguous table');
    const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
    fs.writeFileSync(acceptancePath, '# Acceptance Criteria\n\n| ID | Criterion | Status |\n|---|---|---|\n| AC-1 | Keep | Pending |\n', 'utf8');

    const report = createTaskUpgradeScaffoldReport(root, task.id, 'execute');

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'warning',
          code: 'TASK_UPGRADE_SCAFFOLD_AMBIGUOUS_FRAME',
          path: `tasks/${task.id}-ambiguous-table/ACCEPTANCE.md`
        })
      ])
    );
    expect(fs.readFileSync(acceptancePath, 'utf8')).not.toContain('| ID | Criterion | Status | Evidence |');
  });

  it('prints schema-valid JSON through the task command handler', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI upgrade');
    fs.writeFileSync(path.join(task.dir, 'PLAN.md'), '# Plan\n\nLegacy.\n', 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleTaskCommand({
      args: ['task', 'upgrade-scaffold', '--task', task.id, '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.task.upgrade_scaffold.v1',
      command: 'task.upgrade-scaffold',
      mode: 'dry-run',
      ok: true
    });
    expect(validateSchema('hadara.task.upgrade_scaffold.v1', payload).ok).toBe(true);
  });
});
