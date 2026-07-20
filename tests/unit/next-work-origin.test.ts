import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { initProject } from '../../src/init/project';
import {
  completeProjectCurrentTask,
  inferNextWorkOrigin,
  inspectProjectCurrentStateSemantics,
  planCompletedProjectCurrentStateWrites,
  readProjectCurrentState
} from '../../src/services/project-current-state';
import { createTaskCreateReport } from '../../src/task/task-create';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function tempRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-next-work-origin-'));
  roots.push(root);
  return root;
}

describe('inferNextWorkOrigin (back-compat inference)', () => {
  it('recognizes both known bootstrap phrases and defaults everything else to declared', () => {
    expect(inferNextWorkOrigin({ title: 'Create first Task Capsule' })).toBe('bootstrap-first-task');
    expect(inferNextWorkOrigin({ title: 'create FIRST task capsule' })).toBe('bootstrap-first-task');
    expect(inferNextWorkOrigin({ title: 'Establish HADARA adoption baseline' })).toBe('bootstrap-adoption-baseline');
    expect(inferNextWorkOrigin({ title: 'Add streak command' })).toBe('declared');
    expect(inferNextWorkOrigin(null)).toBe('declared');
    expect(inferNextWorkOrigin(undefined)).toBe('declared');
  });
});

describe('bootstrap nextWork retirement is origin-based, not title-matched (F-2 fix)', () => {
  it('retires an adoption-baseline nextWork when a differently-titled task closes (the actual F-2 repro)', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    // Simulate a brownfield-adopted project whose nextWork is stuck at the adoption-baseline
    // bootstrap phrase (as if its one natural retirement opportunity — the adoption task itself
    // closing under a matching title — never happened).
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    state.nextWork = {
      title: 'Establish HADARA adoption baseline',
      state: 'candidate',
      operatorGuidance: 'Review existing project docs before normal feature work.',
      createCommandAllowed: true,
      origin: 'bootstrap-adoption-baseline'
    };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

    const created = createTaskCreateReport(root, 'Implement an unrelated feature');
    const issues = completeProjectCurrentTask(root, { id: created.taskId!, title: 'Implement an unrelated feature' });

    expect(issues).toEqual([]);
    const after = readProjectCurrentState(root).state;
    expect(after?.nextWork).toBeNull();
  });

  it('planCompletedProjectCurrentStateWrites also retires it (the actual write path task close uses)', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    state.nextWork = {
      title: 'Establish HADARA adoption baseline',
      state: 'candidate',
      operatorGuidance: 'Review existing project docs before normal feature work.',
      createCommandAllowed: true,
      origin: 'bootstrap-adoption-baseline'
    };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

    const created = createTaskCreateReport(root, 'A totally different feature');
    const plan = planCompletedProjectCurrentStateWrites(root, { id: created.taskId!, title: 'A totally different feature' });
    const currentStateWrite = plan.writes.find((write) => write.path === '.hadara/state/current.json');
    expect(currentStateWrite).toBeDefined();
    expect(JSON.parse(currentStateWrite!.after).nextWork).toBeNull();
  });

  it('does not retire declared (real) nextWork just because an unrelated task closes', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    state.nextWork = {
      title: 'Continue with the payments integration',
      state: 'candidate',
      operatorGuidance: 'Explicit operator-declared next step.',
      createCommandAllowed: true,
      origin: 'declared'
    };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

    const created = createTaskCreateReport(root, 'Unrelated cleanup task');
    completeProjectCurrentTask(root, { id: created.taskId!, title: 'Unrelated cleanup task' });
    const after = readProjectCurrentState(root).state;
    expect(after?.nextWork?.title).toBe('Continue with the payments integration');
  });
});

describe('back-compat: legacy current.json without origin', () => {
  it('normalizes on read, inferring origin from title, and validates against the schema', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    // Simulate a pre-T-0664 current.json: nextWork has no origin field at all.
    state.nextWork = {
      title: 'Create first Task Capsule',
      state: 'candidate',
      operatorGuidance: 'Create or select the first bounded Task Capsule.',
      createCommandAllowed: true
    };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

    const read = readProjectCurrentState(root);
    expect(read.issues).toEqual([]);
    expect(read.state?.nextWork?.origin).toBe('bootstrap-first-task');
    expect(validateSchema('hadara.projectCurrentState.v1', read.state).ok).toBe(true);
  });
});

describe('STATE_CURRENT_CANON_STALE_BOOTSTRAP_NEXT_WORK advisory', () => {
  it('flags a bootstrap nextWork that survived past the first completed task', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    state.latestCompletedTask = { id: 'T-0001', title: 'Establish HADARA adoption baseline' };
    state.nextWork = {
      title: 'Establish HADARA adoption baseline',
      state: 'candidate',
      operatorGuidance: 'Review existing project docs before normal feature work.',
      createCommandAllowed: true,
      origin: 'bootstrap-adoption-baseline'
    };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

    const issues = inspectProjectCurrentStateSemantics(root);
    expect(issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'STATE_CURRENT_CANON_STALE_BOOTSTRAP_NEXT_WORK' })])
    );
  });

  it('does not flag a declared nextWork or a null nextWork', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    state.latestCompletedTask = { id: 'T-0001', title: 'First task' };
    state.nextWork = null;
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

    const issues = inspectProjectCurrentStateSemantics(root);
    expect(issues.map((issue) => issue.code)).not.toContain('STATE_CURRENT_CANON_STALE_BOOTSTRAP_NEXT_WORK');
  });
});
