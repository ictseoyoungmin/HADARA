import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendEvidence } from '../../src/evidence/evidence';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import * as harnessService from '../../src/services/harness-service';
import { createTaskWorkbenchReport, formatTaskWorkbenchReport } from '../../src/services/task-workbench';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-workbench-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Metadata\n\n| Field | Value |\n|---|---|\n| HADARA Profile | governed |\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Active / Next Task | T-0001 | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'IMPLEMENTATION_SOP.md'), '# IMPLEMENTATION_SOP\n\n## Session Start\n\nRead docs.\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/PROJECT_STATE.md` | Every session | State. |\n| `docs/AGENT_HANDOFF.md` | Every session | Handoff. |\n| `docs/TASK_BOARD.md` | Every session | Board. |\n| `docs/IMPLEMENTATION_SOP.md` | Every session | SOP. |\n\n## Init Profile Matrix\n\n| Profile | Scale |\n|---|---|\n| governed | Heavy |\n\n## Scaffold Document Structure\n\n| Document | Required Structure |\n|---|---|\n| docs/PROJECT_STATE.md | Product. |\n\n## Implementation\n\nWork.\n\n## Validation\n\nCheck.\n\n## Session End\n\nUpdate.\n\n## Handoff Compaction\n\nCompact.\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('task workbench status report', () => {
  it('summarizes task, evidence, close, and protocol state without writes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench report');
    appendEvidence(root, { taskId: task.id, kind: 'note', summary: 'Fixture evidence', result: 'passed', visibility: 'public' });
    const before = snapshotProject(root);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.workbench.v1',
      command: 'task.status',
      ok: true,
      task: {
        id: task.id,
        title: 'Workbench report',
        taskStatus: 'Draft',
        taskBoardStatus: 'Draft',
        taskBoardPath: 'docs/TASK_BOARD.md',
        taskBoardPresent: true
      },
      state: {
        closeState: 'not-closed',
        ready: false,
        closeEvidenceFound: false,
        closedValid: false,
        closed: false
      },
      sources: {
        evidenceLint: { ok: true, issues: 0 },
        evidenceList: { ok: true, records: 1 },
        taskClosePlan: { ok: false, mode: 'dry-run' }
      }
    });
    expect(report.sources.evidenceList.latest).toMatchObject({ kind: 'note', result: 'passed', visibility: 'public' });
    expect(report.nextActions.length).toBeGreaterThan(0);
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
    expect(formatTaskWorkbenchReport(report)).toContain('State\n- Capsule:');
    expect(formatTaskWorkbenchReport(report)).toContain('Evidence\n- Lint: ok');
    expect(formatTaskWorkbenchReport(report)).toContain('Protocol\n- Task doctor:');
    expect(formatTaskWorkbenchReport(report)).toContain('Close\n- Close plan:');
    expect(formatTaskWorkbenchReport(report)).toContain('Suggested next');
    expect(snapshotProject(root)).toEqual(before);
  });

  it('returns ok false and exit code 6 for a missing task through CLI', () => {
    const root = tempProject();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleTaskCommand({
      args: ['task', 'status', '--task', 'T-9999', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBe(6);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.task.workbench.v1',
      command: 'task.status',
      ok: false,
      task: { id: 'T-9999', taskStatus: 'Missing', taskBoardStatus: 'Missing', taskBoardPresent: false }
    });
  });

  it('reports Task Board status drift from the actual docs/TASK_BOARD.md row', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench board drift');
    setTaskStatus(task.dir, 'Done');
    replaceTaskBoardRow(root, task.id, `| ${task.id} | Workbench board drift | Active | ${path.relative(root, task.dir)} | |`);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.state.ready).toBe(false);
    expect(report.task).toMatchObject({
      taskStatus: 'Done',
      taskBoardStatus: 'Active',
      taskBoardPath: 'docs/TASK_BOARD.md',
      taskBoardPresent: true
    });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'WORKBENCH_TASK_BOARD_STATUS_DRIFT' })]));
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('reports missing Task Board rows without falling back to TASK.md status', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench board missing');
    setTaskStatus(task.dir, 'Done');
    removeTaskBoardRow(root, task.id);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.task).toMatchObject({
      taskStatus: 'Done',
      taskBoardStatus: 'Missing',
      taskBoardPresent: false
    });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'WORKBENCH_TASK_BOARD_ROW_MISSING' })]));
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('reports Task Board capsule drift explicitly', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench capsule drift');
    replaceTaskBoardRow(root, task.id, `| ${task.id} | Workbench capsule drift | Draft | tasks/T-0000-wrong | |`);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'WORKBENCH_TASK_BOARD_CAPSULE_DRIFT' })]));
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('separates blocked close evidence from valid closure', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench blocked close evidence');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Task close validation for T-0001 returned ok:false before close evidence append; reportHash sha256:test; sourceHash sha256:test.',
      result: 'blocked',
      visibility: 'public'
    });

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.state).toMatchObject({
      closeState: 'close-evidence-found-invalid',
      closeEvidenceFound: true,
      closedValid: false,
      closed: false,
      auditable: true
    });
    expect(report.nextActions).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'audit-close' })]));
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('treats passed close evidence as valid closure', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench passed close evidence');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Task close validation for T-0001 returned ok:true before close evidence append; reportHash sha256:test; sourceHash sha256:test.',
      result: 'passed',
      visibility: 'public'
    });

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.state).toMatchObject({
      closeState: 'closed-valid',
      closeEvidenceFound: true,
      closedValid: true,
      closed: true,
      auditable: true
    });
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('uses task close dry-run as the single done-level validation source', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench validation count');
    const spy = vi.spyOn(harnessService, 'createHarnessValidateReport');

    createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

function snapshotProject(root: string): Record<string, string> {
  const files = [
    'docs/TASK_BOARD.md',
    'docs/PROJECT_STATE.md',
    'docs/AGENT_HANDOFF.md',
    ...fs.readdirSync(path.join(root, 'tasks')).flatMap((taskDir) => [
      `tasks/${taskDir}/TASK.md`,
      `tasks/${taskDir}/EVIDENCE.md`,
      `tasks/${taskDir}/evidence.jsonl`
    ])
  ];
  return Object.fromEntries(files.map((file) => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
}

function setTaskStatus(taskDir: string, status: string): void {
  const taskPath = path.join(taskDir, 'TASK.md');
  const content = fs.readFileSync(taskPath, 'utf8');
  fs.writeFileSync(taskPath, content.replace(/^## Status\s*\n+[\s\S]*?(?=\n## Status History)/m, `## Status\n\n${status}\n`), 'utf8');
}

function replaceTaskBoardRow(root: string, taskId: string, replacement: string): void {
  const taskBoardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const content = fs.readFileSync(taskBoardPath, 'utf8');
  fs.writeFileSync(
    taskBoardPath,
    content
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? replacement : line))
      .join('\n'),
    'utf8'
  );
}

function removeTaskBoardRow(root: string, taskId: string): void {
  const taskBoardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const content = fs.readFileSync(taskBoardPath, 'utf8');
  fs.writeFileSync(
    taskBoardPath,
    content
      .split(/\r?\n/)
      .filter((line) => !line.startsWith(`| ${taskId} |`))
      .join('\n'),
    'utf8'
  );
}
