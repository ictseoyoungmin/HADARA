import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskSelectionReport, formatTaskSelectionReport } from '../../src/task/task-selection';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task selection recommendation', () => {
  it('uses the Task Board row for active work instead of current-state guidance', () => {
    const root = tempProject({
      handoffNextStep: 'Continue with stale handoff work.',
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    const active = createTaskCapsule(root, 'Structured Active Work');
    writeCurrentState(root, {
      activeTask: { id: active.id, title: active.title },
      nextOperatorIntent: 'Continue with structured active work.'
    });

    const report = createTaskSelectionReport(root);

    expect(report).toMatchObject({
      summary: { recommendations: 1, source: 'docs/TASK_BOARD.md', policy: 'markdown-first' },
      recommendations: [
        expect.objectContaining({
          taskId: active.id,
          title: 'Structured Active Work',
          source: 'docs/TASK_BOARD.md',
          sourceKind: 'task-board-fallback',
          taskBoardStatus: 'Draft'
        })
      ]
    });
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('keeps an In Progress Task Board row ahead of handoff and development slice guidance', () => {
    const root = tempProject({
      handoffNextStep: 'Continue with stale handoff work.',
      developmentRows: ['| 1 | Planned Slice | T-0190 | Continue. | Planned after current. |']
    });
    const draft = createTaskCapsule(root, 'Draft Work');
    const active = createTaskCapsule(root, 'Actual In Progress Work');
    updateTaskBoardStatus(root, active.id, 'In Progress');

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: active.id,
      title: 'Actual In Progress Work',
      source: 'docs/TASK_BOARD.md',
      sourceKind: 'task-board-fallback',
      taskBoardStatus: 'In Progress',
      createCommand: null
    });
    expect(report.recommendations[0].taskId).not.toBe(draft.id);
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('uses first-task creation when current-state next work is present but no task exists', () => {
    const root = tempProject({
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      ['# TASK_BOARD', '', '| ID | Title | Status | Capsule | Notes |', '|---|---|---|---|---|', ''].join('\n'),
      'utf8'
    );
    writeCurrentState(root, {
      activeTask: null,
      nextWork: {
        title: 'v0.4.4 external repository validation planning',
        state: 'candidate',
        operatorGuidance: 'Keep publication operator-controlled.',
        createCommandAllowed: true
      },
      nextOperatorIntent: 'Keep publication operator-controlled; otherwise begin v0.4.4 external repository validation planning.'
    });

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: 'TBD',
      title: 'Create first Task Capsule',
      source: 'project-scaffold',
      sourceKind: 'task-board-fallback',
      taskCapsulePresent: false,
      createCommand: "hadara task create 'Create first Task Capsule'"
    });
    expect(report.issues).not.toContainEqual(expect.objectContaining({
      code: 'TASK_SELECTION_NO_RECOMMENDATION'
    }));
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('does not use gated current-state operator guidance for task selection', () => {
    const root = tempProject({
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      ['# TASK_BOARD', '', '| ID | Title | Status | Capsule | Notes |', '|---|---|---|---|---|', ''].join('\n'),
      'utf8'
    );
    writeCurrentState(root, {
      activeTask: null,
      nextWork: {
        title: 'stable publication operator checkpoint',
        state: 'waiting-for-operator',
        operatorGuidance: 'Do not create a task until npm and GitHub publication are complete.',
        createCommandAllowed: false
      },
      nextOperatorIntent: 'Do not create a task until publication is complete.'
    });

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: 'TBD',
      title: 'Create first Task Capsule',
      sourceKind: 'task-board-fallback',
      createCommand: "hadara task create 'Create first Task Capsule'"
    });
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('does not route global handoff context into task selection', () => {
    const root = tempProject({
      handoffNextStep: 'Continue with task capsule upgrade/remediation dry-run hardening.',
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    const legacy = createTaskCapsule(root, 'Legacy Partial Work');
    updateTaskBoardStatus(root, legacy.id, 'Partial');

    const report = createTaskSelectionReport(root);

    expect(report).toMatchObject({
      summary: { recommendations: 0, source: 'none', policy: 'markdown-first' },
      recommendations: [],
      backlog: [
        expect.objectContaining({
          taskId: legacy.id,
          title: 'Legacy Partial Work',
          status: 'Partial',
          source: 'docs/TASK_BOARD.md',
          taskCapsulePresent: true
        })
      ]
    });
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('ignores self-referential handoff selection guidance and falls back to planned slices', () => {
    const root = tempProject({
      handoffNextStep: 'Run `task selection --json` or select the next release/readiness capsule.',
      developmentRows: ['| 1 | Planned Follow-up | T-0190 | Continue. | Planned after current. |']
    });

    const report = createTaskSelectionReport(root);

    expect(report).toMatchObject({
      summary: { recommendations: 1, source: 'docs/DEVELOPMENT_SLICES.md', policy: 'markdown-first' },
      recommendations: [
        expect.objectContaining({
          taskId: 'T-0190',
          title: 'Planned Follow-up',
          sourceKind: 'development-slices',
          createCommand: "hadara task create 'Planned Follow-up'"
        })
      ]
    });
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('ignores generic operator-priority handoff guidance instead of using it as a task title', () => {
    const root = tempProject({
      handoffNextStep: 'Select the next capsule from operator priority or fresh diagnostic evidence.',
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    const concrete = createTaskCapsule(root, 'Concrete Follow-up Work');

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: concrete.id,
      title: 'Concrete Follow-up Work',
      source: 'docs/TASK_BOARD.md',
      sourceKind: 'task-board-fallback',
      createCommand: null
    });
    expect(report.recommendations[0].title).not.toContain('Select the next capsule');
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('ignores deferred handoff recommendations and selects concrete open work', () => {
    const root = tempProject({
      handoffNextStep: 'Later, open a new stable `0.3.4` readiness capsule when release work resumes.',
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    const concrete = createTaskCapsule(root, 'Immediate Draft Work');

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: concrete.id,
      title: 'Immediate Draft Work',
      source: 'docs/TASK_BOARD.md',
      sourceKind: 'task-board-fallback'
    });
    expect(report.recommendations[0].title).not.toContain('Later');
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('prefers an existing open Task Board row over stale handoff prose without a task id', () => {
    const root = tempProject({
      handoffNextStep: 'Create or select first Task Capsule.',
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    const active = createTaskCapsule(root, 'Actual Active Work');
    updateTaskBoardStatus(root, active.id, 'In Progress');

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: active.id,
      title: 'Actual Active Work',
      source: 'docs/TASK_BOARD.md',
      sourceKind: 'task-board-fallback',
      createCommand: null
    });
    expect(report.recommendations[0].title).not.toBe('Create or select first Task Capsule');
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('reuses a similar open Task Board row instead of creating a duplicate handoff task', () => {
    const root = tempProject({
      handoffNextStep: 'Create final polish and dogfood report.'
    });
    const existing = createTaskCapsule(root, 'Finalize taskflow toy dogfood report');

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: existing.id,
      title: 'Finalize taskflow toy dogfood report',
      source: 'docs/TASK_BOARD.md',
      sourceKind: 'task-board-fallback',
      taskBoardStatus: 'Draft',
      taskCapsulePresent: true,
      createCommand: null
    });
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('suggests creating a first Task Capsule in an empty project', () => {
    const root = tempProject();
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      ['# TASK_BOARD', '', '| ID | Title | Status | Capsule | Notes |', '|---|---|---|---|---|', ''].join('\n'),
      'utf8'
    );

    const report = createTaskSelectionReport(root);

    expect(report).toMatchObject({
      summary: { recommendations: 1, source: 'project-scaffold', policy: 'markdown-first' },
      recommendations: [
        expect.objectContaining({
          taskId: 'TBD',
          title: 'Create first Task Capsule',
          source: 'project-scaffold',
          sourceKind: 'task-board-fallback',
          taskCapsulePresent: false,
          createCommand: "hadara task create 'Create first Task Capsule'"
        })
      ],
      issues: []
    });
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('suppresses scaffold first-task nextWork after any task exists', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Already Closed First Task');
    updateTaskBoardStatus(root, task.id, 'Done');
    writeCurrentState(root, {
      activeTask: null,
      nextWork: {
        title: 'Create first Task Capsule',
        state: 'candidate',
        operatorGuidance: 'Create the first scoped task.',
        createCommandAllowed: true
      },
      nextOperatorIntent: 'Create the first scoped task.'
    });

    const report = createTaskSelectionReport(root);

    expect(report.recommendations).toEqual([]);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'TASK_SELECTION_NO_RECOMMENDATION'
    }));
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('ignores brownfield current-state baseline after task history exists', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Already Closed Feature Task');
    updateTaskBoardStatus(root, task.id, 'Done');
    writeCurrentState(root, {
      activeTask: null,
      nextWork: {
        title: 'Establish HADARA adoption baseline',
        state: 'candidate',
        operatorGuidance: 'Review existing project docs before normal feature work.',
        createCommandAllowed: true
      },
      nextOperatorIntent: 'Review existing project docs before normal feature work.'
    });

    const report = createTaskSelectionReport(root);

    expect(report.recommendations).toEqual([]);
    expect(report.summary.source).toBe('none');
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('recommends the first incomplete Development Slices row with existing capsule metadata', () => {
    const root = tempProject();
    const done = createTaskCapsule(root, 'Already Done');
    updateTaskBoardStatus(root, done.id, 'Done');
    const next = createTaskCapsule(root, 'Next Slice');
    writeDevelopmentSlices(root, [
      `| 1 | Already Done | ${done.id} | Done objective. | Done: complete. |`,
      '| 2 | Legacy Done Evidence | T-0009 | Old style. | Build/tests pass, CLI JSON sample recorded. |',
      `| 3 | Next Slice | ${next.id} | Continue. | Planned after previous. |`,
      '| 4 | Later Slice | T-9999 | Later. | Planned later. |'
    ]);

    const report = createTaskSelectionReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.selection.v1',
      command: 'task.selection',
      ok: true,
      summary: { recommendations: 1, source: 'docs/TASK_BOARD.md' },
      recommendations: [
        expect.objectContaining({
          taskId: next.id,
          title: 'Next Slice',
          source: 'docs/TASK_BOARD.md',
          sourceKind: 'task-board-fallback',
          taskBoardStatus: 'Draft',
          taskBoardPath: 'docs/TASK_BOARD.md',
          taskCapsulePresent: true,
          capsule: `tasks/${next.id}-next-slice`,
          createCommand: null
        })
      ]
    });
    expect(report.recommendations[0].requiredReading).toEqual([
      'docs/DEVELOPMENT_SLICES.md',
      'docs/TASK_BOARD.md'
    ]);
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
    expect(formatTaskSelectionReport(report)).toContain(`${next.id}\tNext Slice`);
  });

  it('limits required reading recommendations to docs that exist in the project profile', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-selection-basic-'));
    roots.push(root);
    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'scaffold.json'), JSON.stringify({ schemaVersion: 'hadara.projectScaffold.v1', profile: 'basic' }), 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toEqual(expect.objectContaining({
      taskId: 'TBD',
      createCommand: "hadara task create 'Create first Task Capsule'",
      requiredReading: ['docs/TASK_BOARD.md']
    }));
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('returns a shell-quoted create command when the planned slice has no capsule yet', () => {
    const root = tempProject();
    writeDevelopmentSlices(root, [`| 1 | Missing "Quoted" Capsule | T-0188 | Create me. | Planned after current. |`]);

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: 'T-0188',
      title: 'Missing "Quoted" Capsule',
      taskCapsulePresent: false,
      capsule: null,
      createCommand: `hadara task create 'Missing "Quoted" Capsule'`
    });
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('falls back to the first incomplete Task Board row when slices are complete', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Board Fallback');
    writeDevelopmentSlices(root, [`| 1 | Completed | T-0001 | Done. | Done: complete. |`]);

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: task.id,
      title: 'Board Fallback',
      reason: 'First incomplete Task Board row with status Draft.',
      source: 'docs/TASK_BOARD.md',
      sourceKind: 'task-board-fallback'
    });
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('keeps legacy Partial Task Board rows behind primary open rows during fallback', () => {
    const root = tempProject();
    const legacy = createTaskCapsule(root, 'Legacy Partial');
    updateTaskBoardStatus(root, legacy.id, 'Partial');
    const active = createTaskCapsule(root, 'Active Draft');
    writeDevelopmentSlices(root, [`| 1 | Completed | T-0001 | Done. | Done: complete. |`]);

    const report = createTaskSelectionReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: active.id,
      title: 'Active Draft',
      reason: 'First incomplete Task Board row with status Draft.',
      sourceKind: 'task-board-fallback'
    });
    expect(report.backlog).toEqual(expect.arrayContaining([
      expect.objectContaining({
        taskId: legacy.id,
        title: 'Legacy Partial',
        status: 'Partial'
      })
    ]));
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

  it('keeps a historical Partial row backlog-only when no current work is queued', () => {
    const root = tempProject({
      handoffNextStep: 'Select the next capsule from operator priority or fresh diagnostic evidence.',
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    const legacy = createTaskCapsule(root, 'Historical Partial');
    updateTaskBoardStatus(root, legacy.id, 'Partial');

    const report = createTaskSelectionReport(root);

    expect(report.recommendations).toEqual([]);
    expect(report.summary).toMatchObject({ recommendations: 0, source: 'none', policy: 'markdown-first' });
    expect(report.backlog).toEqual([
      expect.objectContaining({
        taskId: legacy.id,
        title: 'Historical Partial',
        status: 'Partial'
      })
    ]);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'TASK_SELECTION_NO_RECOMMENDATION',
      severity: 'warning'
    }));
    expect(validateSchema('hadara.task.selection.v1', report).ok).toBe(true);
  });

});

function tempProject(options: { handoffNextStep?: string; developmentRows?: string[] } = {}): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-selection-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      '| Area | State | Notes |',
      '|---|---|---|',
      '| Active / Next Task | T-0181 Task Next Recommendation | Fixture. |',
      '',
      ...(options.handoffNextStep
        ? [
            '## Next Recommended Step',
            '',
            '| Step | Reason | Done Evidence |',
            '|---|---|---|',
            `| ${options.handoffNextStep} | Fixture handoff priority. | TBD |`,
            ''
          ]
        : [])
    ].join('\n'),
    'utf8'
  );
  if (options.developmentRows) writeDevelopmentSlices(root, options.developmentRows);
  return root;
}

function writeCurrentState(
  root: string,
  overrides: {
    activeTask: { id: string; title: string } | null;
    nextWork?: {
      title: string;
      state: 'candidate' | 'active' | 'blocked' | 'waiting-for-operator' | 'none';
      operatorGuidance: string;
      createCommandAllowed: boolean;
    } | null;
    nextOperatorIntent: string;
  }
): void {
  fs.mkdirSync(path.join(root, '.hadara', 'state'), { recursive: true });
  fs.writeFileSync(path.join(root, '.hadara', 'state', 'current.json'), JSON.stringify({
    schemaVersion: 'hadara.projectCurrentState.v1',
    rev: 1,
    profile: 'governed',
    currentRelease: '0.4.3',
    latestCompletedTask: null,
    activeTask: overrides.activeTask,
    nextWork: overrides.nextWork ?? {
      title: overrides.nextOperatorIntent.replace(/[.]+$/, ''),
      state: 'candidate',
      operatorGuidance: overrides.nextOperatorIntent,
      createCommandAllowed: true
    },
    nextOperatorIntent: overrides.nextOperatorIntent,
    currentKnownProblems: [],
    validationBaseline: {
      summary: 'Fixture validation baseline.',
      evidence: []
    }
  }, null, 2), 'utf8');
}

function writeDevelopmentSlices(root: string, rows: string[]): void {
  fs.writeFileSync(
    path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'),
    ['# DEVELOPMENT_SLICES', '', '| # | Name | Task | Objective | Status / Evidence |', '|---|---|---|---|---|', ...rows, ''].join('\n'),
    'utf8'
  );
}

function updateTaskBoardStatus(root: string, taskId: string, status: string): void {
  const taskBoard = path.join(root, 'docs', 'TASK_BOARD.md');
  fs.writeFileSync(
    taskBoard,
    fs
      .readFileSync(taskBoard, 'utf8')
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', `| ${status} |`) : line))
      .join('\n'),
    'utf8'
  );
}
