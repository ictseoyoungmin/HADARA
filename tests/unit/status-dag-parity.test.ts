import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { evaluateGraph } from '../../src/status/dag/evaluate';
import { genericGovernedGraph } from '../../src/status/dag/fixtures/generic-governed';
import { readProjectCurrentStateFacts } from '../../src/status/sources/project-current-state-source';
import { createFactStore } from '../../src/status/model';
import { createTaskSelectionStatusV2Report } from '../../src/services/task-selection-status-v2';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function tempProject(currentState: Record<string, unknown>, taskBoardRows: string[] = []): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-status-dag-parity-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, '.hadara', 'state'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, '.hadara', 'state', 'current.json'), JSON.stringify(currentState, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    ['# TASK_BOARD', '', '| ID | Title | Status | Capsule | Notes |', '|---|---|---|---|---|', ...taskBoardRows, ''].join('\n'),
    'utf8'
  );
  return root;
}

function baseCurrentState(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.projectCurrentState.v1',
    rev: 1,
    profile: 'governed',
    currentRelease: '0.5.0-rc.0',
    latestCompletedTask: { id: 'T-0658', title: 'Prior task' },
    activeTask: null,
    nextWork: null,
    nextOperatorIntent: 'No next work selected.',
    currentKnownProblems: [],
    validationBaseline: { summary: 'Fixture baseline.', evidence: [] },
    ...overrides
  };
}

function hasWork(root: string): boolean {
  const facts = readProjectCurrentStateFacts(root);
  const store = createFactStore([facts.release, facts.activeWork, facts.nextWork, facts.issues]);
  const result = evaluateGraph(genericGovernedGraph, store);
  return result.emit !== null && result.emit.phase !== 'idle';
}

describe('generic-governed DAG parity with task-selection-status-v2 (docx capsule 3 acceptance)', () => {
  it('agrees that work is available when an active task is set', () => {
    const root = tempProject(baseCurrentState({ activeTask: { id: 'T-0660', title: 'DAG evaluator foundations' } }));
    const legacy = createTaskSelectionStatusV2Report(root);
    expect(legacy.phase).not.toBe('idle');
    expect(hasWork(root)).toBe(true);
  });

  it('agrees that work is available when structured nextWork is actionable', () => {
    const root = tempProject(
      baseCurrentState({
        nextWork: { title: 'Add DAG parity fixture', state: 'candidate', operatorGuidance: 'Continue with the parity fixture.', createCommandAllowed: true }
      })
    );
    const legacy = createTaskSelectionStatusV2Report(root);
    expect(legacy.phase).not.toBe('idle');
    expect(hasWork(root)).toBe(true);
  });

  it('agrees that the project is idle when no active task, next work, or open board row exists', () => {
    const root = tempProject(baseCurrentState({}), ['| T-0658 | Prior task | Done | tasks/T-0658-prior-task | |']);
    const legacy = createTaskSelectionStatusV2Report(root);
    expect(legacy.phase).toBe('idle');
    expect(hasWork(root)).toBe(false);
  });
});
