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
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null },
      status: { taskStatus: 'Draft', taskBoardStatus: 'Draft', taskBoardPresent: true },
      summary: { plannedWrites: 2, appliedWrites: 0, advisoryOnly: 3, stateDocsPending: 3 }
    });
    expect(report.primaryNextAction).toMatchObject({
      id: 'execute-finish',
      command: `hadara task finish --task ${task.id} --execute --json`,
      writeBoundary: 'task-local',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'low'
    });
    expect(report.writes.map((write) => write.field).sort()).toEqual(['task-board-row', 'task-status']);
    for (const write of report.writes) {
      expect(write.expectedBeforeExists).toBe(true);
      expect(write.expectedBeforeHash).toMatch(/^sha256:/);
      expect(write.afterHash).toMatch(/^sha256:/);
    }
    expect(report.advisories.map((advisory) => advisory.path)).toEqual([
      'docs/DEVELOPMENT_SLICES.md',
      'docs/PROJECT_STATE.md',
      'docs/AGENT_HANDOFF.md'
    ]);
    expect(report.stateDocs).toEqual([
      expect.objectContaining({ path: 'docs/DEVELOPMENT_SLICES.md', present: false, mentionsTask: false, state: 'missing' }),
      expect.objectContaining({ path: 'docs/PROJECT_STATE.md', present: false, mentionsTask: false, state: 'missing' }),
      expect.objectContaining({ path: 'docs/AGENT_HANDOFF.md', present: false, mentionsTask: false, state: 'missing' })
    ]);
    expect(readTask(root, task.id)).toBe(beforeTask);
    expect(readBoard(root)).toBe(beforeBoard);
    expect(validateSchema('hadara.task.finish.v1', report).ok).toBe(true);
    expect(formatTaskFinishReport(report)).toContain('PLANNED\ttask-board-row\tdocs/TASK_BOARD.md');
    expect(formatTaskFinishReport(report)).toContain('ADVISORY\tdocs/AGENT_HANDOFF.md\tmissing');
  });

  it('reports state document freshness without writing broad docs', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish state docs');
    fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), `# DEVELOPMENT_SLICES\n\n| Order | Slice | Capsule | Purpose | Done Evidence |\n|---|---|---|---|---|\n| 1 | Finish state docs | ${task.id} | Test | Done: local evidence. |\n`, 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Status\n\nNo mention yet.\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Latest Completed Task | ${task.id} Finish state docs | Test. |\n`, 'utf8');
    const beforeProject = fs.readFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), 'utf8');

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(true);
    expect(report.summary.stateDocsPending).toBe(1);
    expect(report.primaryNextAction).toMatchObject({
      id: 'update-state-docs',
      writeBoundary: 'shared-doc',
      recommendedActorRole: 'coordinator',
      requiresBeforeHash: true,
      stalePlanRisk: 'medium'
    });
    expect(report.stateDocs).toEqual([
      expect.objectContaining({ path: 'docs/DEVELOPMENT_SLICES.md', present: true, mentionsTask: true, state: 'current' }),
      expect.objectContaining({ path: 'docs/PROJECT_STATE.md', present: true, mentionsTask: false, state: 'pending' }),
      expect.objectContaining({ path: 'docs/AGENT_HANDOFF.md', present: true, mentionsTask: true, state: 'current' })
    ]);
    expect(report.advisories.map((advisory) => advisory.state)).toEqual(['current', 'pending', 'current']);
    expect(fs.readFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), 'utf8')).toBe(beforeProject);
    expect(validateSchema('hadara.task.finish.v1', report).ok).toBe(true);
  });

  it('executes only TASK.md status and Task Board row status/path sync', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish execute');

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(true);
    expect(report.summary).toMatchObject({ plannedWrites: 2, appliedWrites: 2 });
    expect(report.primaryNextAction).toMatchObject({
      id: 'update-state-docs',
      writeBoundary: 'shared-doc',
      recommendedActorRole: 'coordinator',
      requiresBeforeHash: true
    });
    expect(readTask(root, task.id)).toContain('| Status | Done |');
    expect(readTask(root, task.id)).toContain('## Status\n\nDone\n');
    expect(readTask(root, task.id)).toMatch(/\|\s*\d{4}-\d{2}-\d{2}\s*\|\s*Done\s*\|\s*Finished task capsule\.\s*\|\s*`hadara task finish --execute`\s*\|/);
    expect(readBoard(root)).toContain(`| ${task.id} | Finish execute | Done | tasks/${task.id}-finish-execute | |`);
    expect(validateSchema('hadara.task.finish.v1', report).ok).toBe(true);
  });

  it('updates Status History when TASK.md status is already Done', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish history only');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs.readFileSync(taskPath, 'utf8').replace('| Status | Draft |', '| Status | Done |').replace('## Status\n\nDraft\n', '## Status\n\nDone\n'),
      'utf8'
    );

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(true);
    expect(report.writes).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'task-status', applied: true })]));
    expect(readTask(root, task.id)).toMatch(/\|\s*\d{4}-\d{2}-\d{2}\s*\|\s*Done\s*\|\s*Finished task capsule\.\s*\|\s*`hadara task finish --execute`\s*\|/);
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

  it('blocks Task Board insertion when the table frame is malformed', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish malformed board');
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\nLost table frame.\n', 'utf8');

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(false);
    expect(report.summary.appliedWrites).toBe(0);
    expect(readBoard(root)).toBe('# TASK_BOARD\n\nLost table frame.\n');
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'TASK_BOARD_TABLE_FRAME_MISSING' })]));
    expect(validateSchema('hadara.task.finish.v1', report).ok).toBe(true);
  });

  it('blocks TASK.md status writes when status frames cannot be replaced', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finish broken task status');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(taskPath, `# ${task.id} Finish broken task status\n\nNo status frames here.\n`, 'utf8');

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(false);
    expect(report.summary.appliedWrites).toBe(0);
    expect(fs.readFileSync(taskPath, 'utf8')).toBe(`# ${task.id} Finish broken task status\n\nNo status frames here.\n`);
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'TASK_FINISH_TASK_STATUS_REPLACE_FAILED' })]));
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
