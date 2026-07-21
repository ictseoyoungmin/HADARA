import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { initProject } from '../../src/init/project';
import {
  completeProjectCurrentTask,
  continuationFromTaskHandoffStep,
  planCompletedProjectCurrentStateWrites,
  readProjectCurrentState
} from '../../src/services/project-current-state';
import { createTaskCreateReport } from '../../src/task/task-create';
import { createTaskFinishReport } from '../../src/task/task-finish';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function tempRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-continuation-'));
  roots.push(root);
  return root;
}

describe('continuationFromTaskHandoffStep (docx section 1.1/9 promotion helper)', () => {
  it('returns null for a placeholder/TBD step, never inventing a continuation', () => {
    expect(continuationFromTaskHandoffStep({ step: 'TBD', reason: 'TBD', requiredReading: 'TBD', sourceTaskId: 'T-0001', sourceCapsulePath: 'tasks/T-0001-x' })).toBeNull();
    expect(continuationFromTaskHandoffStep({ step: '', reason: '', requiredReading: '', sourceTaskId: 'T-0001', sourceCapsulePath: 'tasks/T-0001-x' })).toBeNull();
  });

  it('promotes a real step into an actionable continuation with parsed references and source provenance', () => {
    const continuation = continuationFromTaskHandoffStep({
      step: 'Publish 0.5.0 stable',
      reason: 'rc.0 validation passed.',
      requiredReading: 'docs/ROADMAP.md, docs/TASK_WORKFLOW_COMMANDS.md, TBD',
      sourceTaskId: 'T-0658',
      sourceCapsulePath: 'tasks/T-0658-x'
    });
    expect(continuation).toEqual({
      disposition: 'actionable',
      kind: 'task-handoff',
      title: 'Publish 0.5.0 stable',
      reason: 'rc.0 validation passed.',
      references: [
        { path: 'docs/ROADMAP.md', required: true },
        { path: 'docs/TASK_WORKFLOW_COMMANDS.md', required: true }
      ],
      createCommandAllowed: true,
      source: { type: 'work-handoff', workId: 'T-0658', path: 'tasks/T-0658-x/HANDOFF.md' }
    });
  });

  it('uses structured disposition/create-task fields instead of phrase inference', () => {
    const continuation = continuationFromTaskHandoffStep({
      step: 'No further wording cleanup label, but still create the next task',
      disposition: 'actionable',
      createTask: 'yes',
      reason: 'The structured table is authoritative.',
      requiredReading: 'docs/TASK_WORKFLOW_COMMANDS.md; reviewer plan',
      sourceTaskId: 'T-0674',
      sourceCapsulePath: 'tasks/T-0674-x'
    });
    expect(continuation).toMatchObject({
      disposition: 'actionable',
      createCommandAllowed: true,
      title: 'No further wording cleanup label, but still create the next task',
      references: [
        { path: 'docs/TASK_WORKFLOW_COMMANDS.md', required: true },
        { path: 'reviewer plan', required: true }
      ]
    });
  });
});

describe('continuation schema validation', () => {
  it('rejects an unknown disposition and an empty title', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const state = readProjectCurrentState(root).state!;
    expect(validateSchema('hadara.projectCurrentState.v1', { ...state, continuation: { disposition: 'not-a-real-value', kind: 'x', title: 'x' } }).ok).toBe(false);
    expect(validateSchema('hadara.projectCurrentState.v1', { ...state, continuation: { disposition: 'actionable', kind: 'x', title: '' } }).ok).toBe(false);
  });

  it('accepts a well-formed continuation and null', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const state = readProjectCurrentState(root).state!;
    expect(validateSchema('hadara.projectCurrentState.v1', { ...state, continuation: null }).ok).toBe(true);
    expect(validateSchema('hadara.projectCurrentState.v1', {
      ...state,
      continuation: { disposition: 'actionable', kind: 'task-handoff', title: 'Publish 0.5.0 stable' }
    }).ok).toBe(true);
  });

  it('normalizes an old current.json file with no continuation key at all to null (back-compat)', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const legacy = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    delete legacy.continuation;
    fs.writeFileSync(statePath, JSON.stringify(legacy, null, 2), 'utf8');

    const read = readProjectCurrentState(root);
    expect(read.issues).toEqual([]);
    expect(read.state?.continuation).toBeNull();
  });
});

describe('continuation write path never clears based on absence', () => {
  it('completeProjectCurrentTask sets continuation only when explicitly passed', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Continuation write fixture');

    expect(completeProjectCurrentTask(root, { id: created.taskId!, title: 'Continuation write fixture' })).toEqual([]);
    expect(readProjectCurrentState(root).state?.continuation).toBeNull();

    const second = createTaskCreateReport(root, 'Second continuation write fixture');
    const continuation = continuationFromTaskHandoffStep({
      step: 'Follow-up work',
      reason: '',
      requiredReading: '',
      sourceTaskId: second.taskId!,
      sourceCapsulePath: second.task!.capsule
    })!;
    expect(completeProjectCurrentTask(root, { id: second.taskId!, title: 'Second continuation write fixture' }, continuation)).toEqual([]);
    expect(readProjectCurrentState(root).state?.continuation).toEqual(continuation);
  });

  it('planCompletedProjectCurrentStateWrites leaves an existing continuation untouched when called without one', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const first = createTaskCreateReport(root, 'Continuation persists fixture');
    const continuation = continuationFromTaskHandoffStep({
      step: 'Do the next thing',
      reason: '',
      requiredReading: '',
      sourceTaskId: first.taskId!,
      sourceCapsulePath: first.task!.capsule
    })!;
    completeProjectCurrentTask(root, { id: first.taskId!, title: 'Continuation persists fixture' }, continuation);

    const second = createTaskCreateReport(root, 'Unrelated follow-up fixture');
    const plan = planCompletedProjectCurrentStateWrites(root, { id: second.taskId!, title: 'Unrelated follow-up fixture' });
    expect(plan.writes.length).toBeGreaterThan(0);
    for (const write of plan.writes) {
      if (write.path !== '.hadara/state/current.json') continue;
      expect(JSON.parse(write.after).continuation).toEqual(continuation);
    }
  });
});

describe('task close promotes HANDOFF Next Recommended Step into continuation (T-0658-class fix)', () => {
  it('promotes a real HANDOFF next step on task close', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Task close promotion fixture');
    const handoffPath = path.join(root, created.task!.capsule, 'HANDOFF.md');
    const handoff = fs.readFileSync(handoffPath, 'utf8').replace(
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| TBD | TBD | TBD | TBD | TBD |',
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| Publish 0.5.0 stable | actionable | yes | rc.0 validation is complete. | docs/ROADMAP.md |'
    );
    fs.writeFileSync(handoffPath, handoff, 'utf8');

    const executed = createTaskFinishReport(root, created.taskId!, 'execute');
    expect(executed.ok).toBe(true);

    const continuation = readProjectCurrentState(root).state?.continuation;
    expect(continuation).toMatchObject({
      disposition: 'actionable',
      title: 'Publish 0.5.0 stable',
      reason: 'rc.0 validation is complete.',
      references: [{ path: 'docs/ROADMAP.md', required: true }]
    });
  });

  it('does not overwrite an existing continuation when the closing task has only a placeholder next step', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const first = createTaskCreateReport(root, 'Sets continuation fixture');
    const firstHandoffPath = path.join(root, first.task!.capsule, 'HANDOFF.md');
    fs.writeFileSync(
      firstHandoffPath,
      fs.readFileSync(firstHandoffPath, 'utf8').replace(
        '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| TBD | TBD | TBD | TBD | TBD |',
        '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| Publish 0.5.0 stable | actionable | yes | rc.0 validation is complete. | |'
      ),
      'utf8'
    );
    expect(createTaskFinishReport(root, first.taskId!, 'execute').ok).toBe(true);
    const afterFirst = readProjectCurrentState(root).state?.continuation;
    expect(afterFirst?.title).toBe('Publish 0.5.0 stable');

    const second = createTaskCreateReport(root, 'Placeholder next step fixture');
    expect(createTaskFinishReport(root, second.taskId!, 'execute').ok).toBe(true);
    const afterSecond = readProjectCurrentState(root).state?.continuation;
    expect(afterSecond).toEqual(afterFirst);
  });
});
