import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskFinishReport, formatTaskFinishReport } from '../../src/task/task-finish';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('task finish status sync', () => {
  it('plans bounded TASK.md and Task Board updates without mutating in dry-run mode', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish dry run');
    const beforeTask = readTask(root, task.id);
    const beforeBoard = readBoard(root);

    const report = createTaskFinishReport(root, task.id, 'dry-run');

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.finish.v1',
      command: 'task.finish',
      ok: true,
      mode: 'dry-run',
      taskId: task.id,
      status: { taskStatus: 'Draft', taskBoardStatus: 'Draft', taskBoardPresent: true },
      summary: { plannedWrites: 2, appliedWrites: 0, advisoryOnly: 3 }
    });
    expect(report.writes.map((write) => write.field).sort()).toEqual(['task-board-row', 'task-status']);
    expect(report.advisories.map((advisory) => advisory.path)).toEqual([
      'docs/DEVELOPMENT_SLICES.md',
      'docs/PROJECT_STATE.md',
      'docs/AGENT_HANDOFF.md'
    ]);
    expect(readTask(root, task.id)).toBe(beforeTask);
    expect(readBoard(root)).toBe(beforeBoard);
    expect(validateSchema('hadara.task.finish.v1', report).ok).toBe(true);
    expect(formatTaskFinishReport(report)).toContain('PLANNED\ttask-board-row\tdocs/TASK_BOARD.md');
  });

  it('executes only TASK.md status and Task Board row status/path sync', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish execute');

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(true);
    expect(report.summary).toMatchObject({ plannedWrites: 2, appliedWrites: 2 });
    expect(readTask(root, task.id)).toContain('| Status | Done |');
    expect(readTask(root, task.id)).toContain('## Status\n\nDone\n');
    expect(readBoard(root)).toContain(`| ${task.id} | Finish execute | Done | tasks/${task.id}-finish-execute | |`);
    expect(validateSchema('hadara.task.finish.v1', report).ok).toBe(true);
  });

  it('inserts a missing Task Board row during execute', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish missing board row');
    removeBoardRow(root, task.id);

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(true);
    expect(report.status.taskBoardPresent).toBe(false);
    expect(report.writes).toEqual(expect.arrayContaining([expect.objectContaining({ action: 'insert', field: 'task-board-row', applied: true })]));
    expect(readBoard(root)).toContain(`| ${task.id} | Finish missing board row | Done | tasks/${task.id}-finish-missing-board-row | |`);
    expect(validateSchema('hadara.task.finish.v1', report).ok).toBe(true);
  });

  it('blocks execute when Task Board has duplicate rows', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish duplicate board row');
    fs.appendFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), `| ${task.id} | Duplicate | Draft | tasks/duplicate | |\n`, 'utf8');

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(false);
    expect(report.summary.appliedWrites).toBe(0);
    expect(readTask(root, task.id)).toContain('## Status\n\nDraft\n');
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'TASK_BOARD_ROW_DUPLICATE' })]));
    expect(validateSchema('hadara.task.finish.v1', report).ok).toBe(true);
  });

  it('prints JSON and sets exit code for missing task through CLI', () => {
    const root = tempProject();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleTaskCommand({
      args: ['task', 'finish', '--task', 'T-9999', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBe(6);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({ schemaVersion: 'hadara.task.finish.v1', ok: false, issues: [expect.objectContaining({ code: 'TASK_NOT_FOUND' })] });
  });
});

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-finish-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

function readTask(root: string, taskId: string): string {
  const taskDir = fs.readdirSync(path.join(root, 'tasks')).find((entry) => entry.startsWith(`${taskId}-`));
  if (!taskDir) throw new Error(`Missing task dir ${taskId}`);
  return fs.readFileSync(path.join(root, 'tasks', taskDir, 'TASK.md'), 'utf8');
}

function readBoard(root: string): string {
  return fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8');
}

function removeBoardRow(root: string, taskId: string): void {
  const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const next = fs
    .readFileSync(boardPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => !line.startsWith(`| ${taskId} |`))
    .join('\n');
  fs.writeFileSync(boardPath, next, 'utf8');
}
