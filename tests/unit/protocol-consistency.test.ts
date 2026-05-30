import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createDocsProtocolConsistencyReport, createTaskProtocolConsistencyReport } from '../../src/services/protocol-consistency';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-protocol-consistency-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# AGENTS\n', 'utf8');
  fs.writeFileSync(
    path.join(dir, 'docs', 'AGENT_HANDOFF.md'),
    '# AGENT_HANDOFF\n\n## Current State\n\n| Area | State |\n|---|---|\n| Active / Next Task | none |\n',
    'utf8'
  );
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');
  fs.writeFileSync(
    path.join(dir, 'docs', 'IMPLEMENTATION_SOP.md'),
    '# IMPLEMENTATION_SOP\n\n## Session Start\n\nRead docs.\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/PROJECT_STATE.md` | Every session | Current state. |\n| `docs/AGENT_HANDOFF.md` | Every session | Handoff. |\n| `docs/TASK_BOARD.md` | Every session | Work queue. |\n| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow. |\n\n## Init Profile Matrix\n\n| Profile | Scale |\n|---|---|\n| `basic` | Small |\n\n## Scaffold Document Structure\n\n| Document | Required Structure |\n|---|---|\n| `docs/PROJECT_STATE.md` | Product and status. |\n\n## Implementation\n\nWork in a capsule.\n\n## Validation\n\nRun checks.\n\n## Session End\n\nUpdate evidence.\n\n## Handoff Compaction\n\nKeep handoff compact.\n',
    'utf8'
  );
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Docs protocol consistency report', () => {
  it('returns a stable docs-scoped report for an in-sync project', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Docs protocol');
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      `# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Latest Completed Task | none | none |\n| Active / Next Task | ${task.id} | active |\n`,
      'utf8'
    );

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'docs',
      generatedAt: '2026-05-30T00:00:00.000Z',
      summary: {
        checkedTasks: 1,
        activeTaskId: task.id,
        detectedProfile: 'basic',
        issueCounts: {
          error: 0,
          warning: 0,
          info: 0
        }
      },
      issues: [],
      remediations: []
    });
    expect(report.summary.checkedDocs).toBeGreaterThanOrEqual(5);
  });

  it('reports project docs, Task Board, handoff, and required-reading drift', () => {
    const root = tempProject();
    const doneTask = createTaskCapsule(root, 'Finished docs task');
    const activeTask = createTaskCapsule(root, 'Active docs task');
    markTaskDone(root, doneTask.id);
    replaceInFile(path.join(activeTask.dir, 'TASK.md'), '| Status | Draft |', '| Status | Active |');
    replaceInFile(path.join(activeTask.dir, 'TASK.md'), '\n## Status\n\nDraft\n', '\n## Status\n\nActive\n');
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      `# AGENT_HANDOFF\n\nActive task: ${activeTask.id}\n`,
      'utf8'
    );
    replaceInFile(
      path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'),
      '| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow. |',
      '| `docs/IMPLEMENTATION_SOP.md` | Every session | Workflow. |\n| `docs/MISSING_SPEC.md` | Protocol work | Missing fixture. |'
    );
    fs.rmSync(path.join(root, 'AGENTS.md'));
    replaceInFile(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      `| ${activeTask.id} | Active docs task | Draft | tasks/${activeTask.id}-active-docs-task |`,
      `| ${activeTask.id} | Active docs task | Draft | tasks/${activeTask.id}-wrong |`
    );

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.summary.activeTaskId).toBe(activeTask.id);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'PROJECT_DOC_MISSING',
        'REQUIRED_READING_DOC_MISSING',
        'PROJECT_TASK_BOARD_STATUS_DRIFT',
        'PROJECT_TASK_BOARD_CAPSULE_DRIFT',
        'PROJECT_HANDOFF_LATEST_COMPLETED_STALE'
      ])
    );
    expect(report.issues.find((issue) => issue.code === 'PROJECT_DOC_MISSING')).toMatchObject({
      severity: 'error',
      path: 'AGENTS.md'
    });
    expect(report.issues.find((issue) => issue.code === 'PROJECT_TASK_BOARD_CAPSULE_DRIFT')).toMatchObject({
      severity: 'warning',
      taskId: activeTask.id,
      expected: `tasks/${activeTask.id}-active-docs-task`,
      actual: `tasks/${activeTask.id}-wrong`
    });
  });

  it('reports expanded project-doc drift for profile, state, slices, decisions, tests, handoff, and SOP structure', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'ROADMAP.md'), '# ROADMAP\n', 'utf8');
    fs.writeFileSync(
      path.join(root, 'docs', 'PROJECT_STATE.md'),
      '# PROJECT_STATE\n\n## Current Status\n\n- Active Task: T-9999\n- Latest Completed Task: T-9998\n',
      'utf8'
    );
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      '# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Latest Completed Task | T-9998 | stale |\n| Active / Next Task | T-9999 | stale |\n',
      'utf8'
    );
    fs.writeFileSync(
      path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'),
      '# DEVELOPMENT_SLICES\n\n| Order | Slice | Capsule | Purpose | Done Evidence |\n|---|---|---|---|---|\n| 1 | Drift | T-0001 | Check drift. | Done: stale evidence. |\n',
      'utf8'
    );
    fs.writeFileSync(
      path.join(root, 'docs', 'DECISIONS.md'),
      '# DECISIONS\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Keep drift fixture. | Accepted | Needed. | TBD |\n',
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'TEST_STRATEGY.md'), '# TEST_STRATEGY\n\n## Current Validation Environment\n\nHost checks only.\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'IMPLEMENTATION_SOP.md'), '# IMPLEMENTATION_SOP\n\n## Required Reading\n\nNo table.\n', 'utf8');
    const task = createTaskCapsule(root, 'Expanded drift');

    const report = createDocsProtocolConsistencyReport(root, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'PROFILE_DOC_SET_MIXED',
        'PROJECT_DOC_MISSING',
        'PROJECT_STATE_ACTIVE_TASK_STALE',
        'PROJECT_HANDOFF_ACTIVE_TASK_STALE',
        'DEVELOPMENT_SLICE_STATUS_DRIFT',
        'DECISION_EVIDENCE_MISSING',
        'TEST_STRATEGY_VALIDATION_BASELINE_STALE',
        'SOP_SCAFFOLD_SECTION_MISSING',
        'SOP_REQUIRED_READING_TABLE_MISSING'
      ])
    );
    expect(report.issues.find((issue) => issue.code === 'PROJECT_STATE_ACTIVE_TASK_STALE')).toMatchObject({
      taskId: task.id,
      path: 'docs/PROJECT_STATE.md'
    });
  });
});

describe('Task protocol consistency report', () => {
  it('returns a stable task-scoped report for an in-sync draft capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Protocol draft');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\nActive task: ${task.id}\n`, 'utf8');

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.protocol.consistency.v1',
      command: 'protocol.doctor',
      ok: true,
      scope: 'tasks',
      generatedAt: '2026-05-30T00:00:00.000Z',
      summary: {
        checkedDocs: 2,
        checkedTasks: 1,
        activeTaskId: task.id,
        detectedProfile: 'basic',
        issueCounts: {
          error: 0,
          warning: 0,
          info: 0
        }
      },
      task: {
        id: task.id,
        title: 'Protocol draft',
        capsule: `tasks/${task.id}-protocol-draft`,
        taskStatus: 'Draft',
        taskBoardStatus: 'Draft'
      },
      issues: [],
      remediations: []
    });
  });

  it('reports missing files, status drift, stale handoff, and missing evidence index', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Drift task');
    fs.rmSync(path.join(task.dir, 'FILES.md'));
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));
    replaceInFile(path.join(task.dir, 'TASK.md'), '| Status | Draft |', '| Status | Active |');

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['TASK_FILE_MISSING', 'TASK_BOARD_STATUS_DRIFT', 'PROJECT_HANDOFF_STALE', 'EVIDENCE_JSONL_MISSING'])
    );
    expect(report.issues.find((issue) => issue.code === 'TASK_FILE_MISSING')).toMatchObject({
      severity: 'error',
      path: `tasks/${task.id}-drift-task/FILES.md`
    });
    expect(report.issues.find((issue) => issue.code === 'TASK_BOARD_STATUS_DRIFT')).toMatchObject({
      severity: 'warning',
      expected: 'Active',
      actual: 'Draft'
    });
  });

  it('reports Done capsules with pending acceptance, empty evidence, and scaffold placeholders', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Premature done');
    markTaskDone(root, task.id);

    const report = createTaskProtocolConsistencyReport(root, task.id, new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.summary.activeTaskId).toBeNull();
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['TASK_DONE_ACCEPTANCE_PENDING', 'EVIDENCE_JSONL_EMPTY', 'TASK_SCAFFOLD_PLACEHOLDER'])
    );
    expect(report.issues.find((issue) => issue.code === 'TASK_DONE_ACCEPTANCE_PENDING')).toMatchObject({
      severity: 'error',
      area: 'validation'
    });
    expect(report.issues.filter((issue) => issue.code === 'TASK_SCAFFOLD_PLACEHOLDER').length).toBeGreaterThan(1);
  });

  it('returns a stable missing task issue', () => {
    const root = tempProject();

    const report = createTaskProtocolConsistencyReport(root, 'T-9999', new Date('2026-05-30T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.summary.checkedTasks).toBe(0);
    expect(report.issues).toEqual([
      {
        id: 'issue-001',
        code: 'TASK_NOT_FOUND',
        severity: 'error',
        area: 'task',
        taskId: 'T-9999',
        message: 'Task Capsule not found: T-9999'
      }
    ]);
  });
});

function markTaskDone(root: string, taskId: string): void {
  const taskDirName = fs.readdirSync(path.join(root, 'tasks')).find((entry) => entry.startsWith(`${taskId}-`));
  if (!taskDirName) throw new Error(`missing task dir for ${taskId}`);
  const taskPath = path.join(root, 'tasks', taskDirName, 'TASK.md');
  replaceInFile(taskPath, '| Status | Draft |', '| Status | Done |');
  replaceInFile(taskPath, '\n## Status\n\nDraft\n', '\n## Status\n\nDone\n');
  const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const board = fs.readFileSync(boardPath, 'utf8');
  fs.writeFileSync(
    boardPath,
    board.replace(new RegExp(`(\\| ${taskId} \\| [^|]+ \\| )Draft( \\|)`), '$1Done$2'),
    'utf8'
  );
}

function replaceInFile(filePath: string, before: string, after: string): void {
  const current = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, current.replace(before, after), 'utf8');
}
