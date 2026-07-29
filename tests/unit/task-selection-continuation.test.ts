import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskSelectionStatusV2Report } from '../../src/services/task-selection-status-v2';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function tempProjectWithHandoff(
  nextStep: { title: string; disposition: string; createTask: string; reason?: string } | null,
  taskBoardRows?: string[]
): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-selection-continuation-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  const task = createTaskCapsule(root, 'Prior task');
  const capsule = path.relative(root, task.dir).split(path.sep).join('/');
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    [
      '# TASK_BOARD',
      '',
      '| ID | Title | Status | Capsule | Notes |',
      '|---|---|---|---|---|',
      ...(taskBoardRows ?? [`| ${task.id} | ${task.title} | Done | ${capsule} | |`]),
      ''
    ].join('\n'),
    'utf8'
  );
  if (nextStep) {
    fs.writeFileSync(
      path.join(task.dir, 'HANDOFF.md'),
      [
        `# ${task.id} HANDOFF`,
        '',
        '## Next Recommended Step',
        '',
        '| Step | Disposition | Create Task | Reason | Required Reading |',
        '|---|---|---|---|---|',
        `| ${nextStep.title} | ${nextStep.disposition} | ${nextStep.createTask} | ${nextStep.reason ?? 'Review continuation.'} | docs/TASK_WORKFLOW_COMMANDS.md |`,
        ''
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'TASK_WORKFLOW_COMMANDS.md'), '# Workflow\n', 'utf8');
  }
  return root;
}

describe('task-selection-status-v2 continuation routing (T-0658-class fix)', () => {
  it('surfaces actionable task-local HANDOFF continuation after open Task Board work is exhausted', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-local-continuation-'));
    roots.push(root);
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    const task = createTaskCapsule(root, 'Completed source task');
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      [
        '# TASK_BOARD',
        '',
        '| ID | Title | Status | Capsule | Notes |',
        '|---|---|---|---|---|',
        `| ${task.id} | ${task.title} | Done | ${path.relative(root, task.dir).split(path.sep).join('/')} | Closed. |`,
        ''
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(
      path.join(task.dir, 'HANDOFF.md'),
      [
        '# Handoff',
        '',
        '## Next Recommended Step',
        '',
        '| Step | Disposition | Create Task | Reason | Required Reading |',
        '|---|---|---|---|---|',
        '| Harden validation output boundary | actionable | yes | Raw previews need redaction. | docs/TASK_WORKFLOW_COMMANDS.md |',
        ''
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'TASK_WORKFLOW_COMMANDS.md'), '# Workflow\n', 'utf8');

    const report = createTaskSelectionStatusV2Report(root, new Date('2026-07-29T00:00:00Z'), { detail: 'full' });

    expect(report.phase).toBe('continuation-ready');
    expect(report.recommendations[0]).toMatchObject({
      taskId: 'TBD',
      title: 'Harden validation output boundary',
      sourceKind: 'task-handoff-continuation',
      source: `${path.relative(root, task.dir).split(path.sep).join('/')}/HANDOFF.md`
    });
    expect(report.primaryNextAction).toMatchObject({
      id: 'create-recommended-task',
      command: 'hadara task create \'Harden validation output boundary\''
    });
    expect(report.evaluations).toContainEqual(expect.objectContaining({
      id: 'continuation',
      state: 'evaluated'
    }));
  });

  it('reproduces this project\'s continuation case: no open board row -> routes to task-local HANDOFF continuation', () => {
    const root = tempProjectWithHandoff({ disposition: 'actionable', title: 'Publish 0.5.0 stable', createTask: 'yes' });
    const report = createTaskSelectionStatusV2Report(root);

    expect(report.phase).toBe('continuation-ready');
    expect(report.health).not.toBe('degraded');
    expect(report.readiness.status).not.toBe('terminal');
    expect(report.selection.selectedSourceKind).toBe('task-handoff-continuation');
    expect(report.primaryNextAction).toMatchObject({ id: 'create-recommended-task', kind: 'create', writes: true });
  });

  it('routes waiting-for-operator to a review-only action with no invented command', () => {
    const root = tempProjectWithHandoff({ disposition: 'waiting-for-operator', title: 'Review combat prototype', createTask: 'no' });
    const report = createTaskSelectionStatusV2Report(root);

    expect(report.phase).toBe('continuation-ready');
    expect(report.primaryNextAction).toMatchObject({ id: 'review-next-work-guidance', kind: 'review', requiresReview: true, writes: false });
    expect(report.primaryNextAction?.command).toBeUndefined();
  });

  it('leaves idle unchanged for terminal, blocked, and unresolved dispositions (MVP scope boundary)', () => {
    for (const disposition of ['terminal', 'blocked', 'unresolved'] as const) {
      const root = tempProjectWithHandoff({ disposition, title: 'x', createTask: 'no' });
      const report = createTaskSelectionStatusV2Report(root);
      expect(report.phase).toBe('idle');
      expect(report.readiness.status).toBe('terminal');
    }
  });

  it('leaves idle unchanged when no continuation is present (back-compat)', () => {
    const root = tempProjectWithHandoff(null);
    const report = createTaskSelectionStatusV2Report(root);
    expect(report.phase).toBe('idle');
  });

  it('lets an existing recommendation (higher authority) win over a declared continuation', () => {
    const root = tempProjectWithHandoff(
      { disposition: 'actionable', title: 'Should not be selected', createTask: 'yes' },
      [
        '| T-0700 | Active work | In Progress | tasks/T-0700-active-work | |',
        '| T-0001 | Prior task | Done | tasks/T-0001-prior-task | |'
      ]
    );
    const report = createTaskSelectionStatusV2Report(root);

    expect(report.phase).not.toBe('continuation-ready');
    expect(report.phase).not.toBe('idle');
    expect(report.selection.selectedTaskId).toBe('T-0700');
    expect(report.primaryNextAction?.id).toBe('create-recommended-task');
  });
});
