import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskSelectionStatusV2Report } from '../../src/services/task-selection-status-v2';
import type { ProjectContinuation } from '../../src/services/project-current-state';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function tempProject(overrides: { continuation?: ProjectContinuation | null; activeTask?: { id: string; title: string } | null }, taskBoardRows: string[] = ['| T-0658 | Prior task | Done | tasks/T-0658-prior-task | |']): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-selection-continuation-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, '.hadara', 'state'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, '.hadara', 'state', 'current.json'),
    JSON.stringify(
      {
        schemaVersion: 'hadara.projectCurrentState.v1',
        rev: 1,
        profile: 'governed',
        currentRelease: '0.5.0-rc.0',
        latestCompletedTaskBasis: 'highest-done-task-id',
        latestCompletedTask: { id: 'T-0658', title: 'Prior task' },
        activeTask: overrides.activeTask ?? null,
        nextWork: null,
        nextOperatorIntent: 'No next work selected.',
        continuation: overrides.continuation ?? null,
        currentKnownProblems: [],
        validationBaseline: { summary: 'Fixture baseline.', evidence: [] }
      },
      null,
      2
    ),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    ['# TASK_BOARD', '', '| ID | Title | Status | Capsule | Notes |', '|---|---|---|---|---|', ...taskBoardRows, ''].join('\n'),
    'utf8'
  );
  return root;
}

describe('task-selection-status-v2 continuation routing (T-0658-class fix)', () => {
  it('reproduces this project\'s own observed bug: nextWork/activeTask null, no open board row -> was idle, now routes to continuation-ready when a continuation exists', () => {
    const continuation: ProjectContinuation = { disposition: 'actionable', kind: 'task-handoff', title: 'Publish 0.5.0 stable', createCommandAllowed: true };
    const root = tempProject({ continuation });
    const report = createTaskSelectionStatusV2Report(root);

    expect(report.phase).toBe('continuation-ready');
    expect(report.health).not.toBe('degraded');
    expect(report.readiness.status).not.toBe('terminal');
    expect(report.primaryNextAction).toMatchObject({ id: 'review-continuation', kind: 'review', message: expect.stringContaining('Current human/reviewer direction has priority'), writes: false });
    expect(report.primaryNextAction?.command).toBeUndefined();
  });

  it('routes waiting-for-operator to a review-only action with no invented command', () => {
    const continuation: ProjectContinuation = { disposition: 'waiting-for-operator', kind: 'playtest-review', title: 'Review combat prototype' };
    const root = tempProject({ continuation });
    const report = createTaskSelectionStatusV2Report(root);

    expect(report.phase).toBe('continuation-ready');
    expect(report.primaryNextAction).toMatchObject({ id: 'review-continuation', kind: 'review', requiresReview: true, writes: false });
    expect(report.primaryNextAction?.command).toBeUndefined();
  });

  it('leaves idle unchanged for terminal, blocked, and unresolved dispositions (MVP scope boundary)', () => {
    for (const disposition of ['terminal', 'blocked', 'unresolved'] as const) {
      const root = tempProject({ continuation: { disposition, kind: 'x', title: 'x' } });
      const report = createTaskSelectionStatusV2Report(root);
      expect(report.phase).toBe('idle');
      expect(report.readiness.status).toBe('terminal');
    }
  });

  it('leaves idle unchanged when no continuation is present (back-compat)', () => {
    const root = tempProject({ continuation: null });
    const report = createTaskSelectionStatusV2Report(root);
    expect(report.phase).toBe('idle');
  });

  it('lets an existing recommendation (higher authority) win over a declared continuation', () => {
    const continuation: ProjectContinuation = { disposition: 'actionable', kind: 'task-handoff', title: 'Should not be selected' };
    const root = tempProject(
      { continuation, activeTask: { id: 'T-0700', title: 'Active work' } },
      ['| T-0700 | Active work | In Progress | tasks/T-0700-active-work | |']
    );
    const report = createTaskSelectionStatusV2Report(root);

    expect(report.phase).not.toBe('continuation-ready');
    expect(report.phase).not.toBe('idle');
    expect(report.selection.selectedTaskId).toBe('T-0700');
    expect(report.primaryNextAction?.id).not.toBe('create-continuation-task');
    expect(report.primaryNextAction?.id).not.toBe('review-continuation');
  });
});
