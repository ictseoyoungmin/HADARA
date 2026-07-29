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
import { createCloseGuardedWritePlan } from '../../src/task/close/guardedWrites';
import { createTaskSelectionStatusV2Report } from '../../src/services/task-selection-status-v2';

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

  it('returns null for a self-close step so task-close reminders do not become project continuation', () => {
    expect(continuationFromTaskHandoffStep({
      step: 'ClosePlan shared-state prose and run `hadara task close --task T-0691 --json` once the close-source docs are reviewed.',
      reason: 'The implementation and focused validation are complete; the remaining work is proof-last capsule close.',
      requiredReading: 'docs/TASK_WORKFLOW_COMMANDS.md',
      sourceTaskId: 'T-0691',
      sourceCapsulePath: 'tasks/T-0691-x'
    })).toBeNull();
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

  it('strips Markdown inline-code fences from continuation reference paths', () => {
    const continuation = continuationFromTaskHandoffStep({
      step: 'Continue close hardening.',
      reason: 'Reviewer requested another pass.',
      requiredReading: '`docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md`; `docs/TASK_WORKFLOW_COMMANDS.md`',
      sourceTaskId: 'T-0731',
      sourceCapsulePath: 'tasks/T-0731-x'
    });

    expect(continuation?.references).toEqual([
      { path: 'docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md', required: true },
      { path: 'docs/TASK_WORKFLOW_COMMANDS.md', required: true }
    ]);
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

  it('defaults non-actionable structured dispositions to no task creation', () => {
    const continuation = continuationFromTaskHandoffStep({
      step: 'Wait for operator review',
      disposition: 'waiting-for-operator',
      reason: 'External review is required.',
      requiredReading: 'docs/RELEASE_READINESS.md',
      sourceTaskId: 'T-0677',
      sourceCapsulePath: 'tasks/T-0677-x'
    });
    expect(continuation).toMatchObject({
      disposition: 'waiting-for-operator',
      createCommandAllowed: false
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
      continuation: { disposition: 'actionable', kind: 'task-handoff', title: 'Publish 0.5.0 stable' },
      continuations: [{ disposition: 'actionable', kind: 'task-handoff', title: 'Publish 0.5.0 stable' }]
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

describe('continuation selection guidance', () => {
  it('reviews persisted continuation without generating a task-create command or title', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const completed = createTaskCreateReport(root, 'Completed history fixture');
    completeProjectCurrentTask(root, { id: completed.taskId!, title: 'Completed history fixture' });
    const taskMarkdownPath = path.join(root, completed.task!.capsule, 'TASK.md');
    fs.writeFileSync(taskMarkdownPath, fs.readFileSync(taskMarkdownPath, 'utf8').replace(/\bDraft\b/g, 'Done'), 'utf8');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(boardPath, fs.readFileSync(boardPath, 'utf8').replace('| Draft |', '| Done |'), 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\nNo queued task.\n', 'utf8');
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    state.continuation = continuationFromTaskHandoffStep({
      step: 'Implement every remaining DAG capability and revise all affected documentation',
      reason: 'Persisted handoff suggestion.',
      requiredReading: 'docs/PROJECT_STATE.md, docs/AGENT_HANDOFF.md',
      sourceTaskId: completed.taskId!,
      sourceCapsulePath: completed.task!.capsule
    });
    state.continuations = [state.continuation];
    fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    expect(readProjectCurrentState(root).state?.continuation).toMatchObject({ disposition: 'actionable' });

    const report = createTaskSelectionStatusV2Report(root, new Date('2026-06-02T00:00:00.000Z'));

    expect(report.primaryNextAction).toMatchObject({
      id: 'review-continuation',
      kind: 'review',
      writes: false,
      message: expect.stringContaining('Current human/reviewer direction has priority')
    });
    expect(report.primaryNextAction).not.toHaveProperty('command');
    expect(JSON.stringify(report)).not.toContain("hadara task create 'Implement every remaining");
    expect(validateSchema('hadara.taskSelection.status.v2', report).ok).toBe(true);
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
    expect(readProjectCurrentState(root).state?.continuations).toEqual([continuation]);
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
      expect(JSON.parse(write.after).continuations).toEqual([continuation]);
    }
  });

  it('clears an existing continuation when it came from the same task being completed', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Self-owned continuation fixture');
    const continuation = continuationFromTaskHandoffStep({
      step: 'Follow-up work',
      reason: '',
      requiredReading: '',
      sourceTaskId: created.taskId!,
      sourceCapsulePath: created.task!.capsule
    })!;
    completeProjectCurrentTask(root, { id: created.taskId!, title: 'Self-owned continuation fixture' }, continuation);

    expect(completeProjectCurrentTask(root, { id: created.taskId!, title: 'Self-owned continuation fixture' })).toEqual([]);
    expect(readProjectCurrentState(root).state?.continuation).toBeNull();
  });

  it('planCompletedProjectCurrentStateWrites clears a stale continuation when it came from the same task being completed', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Stale continuation cleanup fixture');
    const continuation = continuationFromTaskHandoffStep({
      step: 'Follow-up work',
      reason: '',
      requiredReading: '',
      sourceTaskId: created.taskId!,
      sourceCapsulePath: created.task!.capsule
    })!;
    completeProjectCurrentTask(root, { id: created.taskId!, title: 'Stale continuation cleanup fixture' }, continuation);

    const plan = planCompletedProjectCurrentStateWrites(root, { id: created.taskId!, title: 'Stale continuation cleanup fixture' });
    expect(plan.writes.length).toBeGreaterThan(0);
    for (const write of plan.writes) {
      if (write.path !== '.hadara/state/current.json') continue;
      expect(JSON.parse(write.after).continuation).toBeNull();
      expect(JSON.parse(write.after).continuations).toEqual([]);
    }
  });

  it('preserves independent continuation backlog entries while replacing same-task entries', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const first = createTaskCreateReport(root, 'Archived init authority fixture');
    const firstContinuation = continuationFromTaskHandoffStep({
      step: 'Restore archived Init v1 frozen-spec authority routing',
      reason: 'Historical archive authority is still unresolved.',
      requiredReading: 'docs/PROJECT_STATE.md',
      sourceTaskId: first.taskId!,
      sourceCapsulePath: first.task!.capsule
    })!;
    completeProjectCurrentTask(root, { id: first.taskId!, title: 'Archived init authority fixture' }, firstContinuation);

    const second = createTaskCreateReport(root, 'Close journal fixture');
    const secondContinuation = continuationFromTaskHandoffStep({
      step: 'Review close journal hardening follow-up',
      reason: 'Retry semantics still need review.',
      requiredReading: 'docs/TASK_WORKFLOW_COMMANDS.md',
      sourceTaskId: second.taskId!,
      sourceCapsulePath: second.task!.capsule
    })!;
    completeProjectCurrentTask(root, { id: second.taskId!, title: 'Close journal fixture' }, secondContinuation);

    const state = readProjectCurrentState(root).state!;
    expect(state.continuation).toEqual(secondContinuation);
    expect(state.continuations).toEqual([secondContinuation, firstContinuation]);

    expect(completeProjectCurrentTask(root, { id: second.taskId!, title: 'Close journal fixture' })).toEqual([]);
    const after = readProjectCurrentState(root).state!;
    expect(after.continuation).toEqual(firstContinuation);
    expect(after.continuations).toEqual([firstContinuation]);
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

    const executed = createCloseGuardedWritePlan(root, created.taskId!, 'execute');
    expect(executed.ok).toBe(true);

    const continuation = readProjectCurrentState(root).state?.continuation;
    expect(continuation).toMatchObject({
      disposition: 'actionable',
      title: 'Publish 0.5.0 stable',
      reason: 'rc.0 validation is complete.',
      references: [{ path: 'docs/ROADMAP.md', required: true }]
    });
  });

  it('does not persist a continuation when the HANDOFF step only tells the same task to close', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Self-close handoff fixture');
    const statePath = path.join(root, '.hadara', 'state', 'current.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    state.continuation = {
      disposition: 'waiting-for-operator',
      kind: 'task-handoff',
      title: 'ClosePlan shared-state prose and run `hadara task close --task T-0691 --json` once the close-source docs are reviewed.',
      reason: 'Fixture stale continuation.',
      createCommandAllowed: false,
      source: { type: 'work-handoff', workId: created.taskId!, path: `${created.task!.capsule}/HANDOFF.md` }
    };
    fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');

    const handoffPath = path.join(root, created.task!.capsule, 'HANDOFF.md');
    const handoff = fs.readFileSync(handoffPath, 'utf8').replace(
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| TBD | TBD | TBD | TBD | TBD |',
      `| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| ClosePlan shared-state prose and run \`hadara task close --task ${created.taskId!} --json\` once the close-source docs are reviewed. | waiting-for-operator | no | The implementation and focused validation are complete; the remaining work is proof-last capsule close. | docs/TASK_WORKFLOW_COMMANDS.md |`
    );
    fs.writeFileSync(handoffPath, handoff, 'utf8');

    const executed = createCloseGuardedWritePlan(root, created.taskId!, 'execute');
    expect(executed.ok).toBe(true);
    expect(readProjectCurrentState(root).state?.continuation).toBeNull();
  });

  it('blocks task bookkeeping when structured handoff disposition is malformed', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Malformed continuation fixture');
    const handoffPath = path.join(root, created.task!.capsule, 'HANDOFF.md');
    const handoff = fs.readFileSync(handoffPath, 'utf8').replace(
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| TBD | TBD | TBD | TBD | TBD |',
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| Continue later | maybe | yes | Fixture. | docs/TASK_BOARD.md |'
    );
    fs.writeFileSync(handoffPath, handoff, 'utf8');

    const report = createCloseGuardedWritePlan(root, created.taskId!, 'execute');
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'HANDOFF_CONTINUATION_DISPOSITION_INVALID'
    }));
  });

  it('blocks task bookkeeping when structured handoff create-task value is malformed', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Malformed create task fixture');
    const handoffPath = path.join(root, created.task!.capsule, 'HANDOFF.md');
    const handoff = fs.readFileSync(handoffPath, 'utf8').replace(
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| TBD | TBD | TBD | TBD | TBD |',
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| Continue later | actionable | flase | Fixture. | docs/TASK_BOARD.md |'
    );
    fs.writeFileSync(handoffPath, handoff, 'utf8');

    const report = createCloseGuardedWritePlan(root, created.taskId!, 'execute');
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'HANDOFF_CONTINUATION_CREATE_TASK_INVALID'
    }));
  });

  it('blocks task bookkeeping when structured handoff disposition and create-task conflict', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Conflicting continuation fixture');
    const handoffPath = path.join(root, created.task!.capsule, 'HANDOFF.md');
    const handoff = fs.readFileSync(handoffPath, 'utf8').replace(
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| TBD | TBD | TBD | TBD | TBD |',
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| No publish follow-up is queued. | terminal | yes | Done. | docs/RELEASE_READINESS.md |'
    );
    fs.writeFileSync(handoffPath, handoff, 'utf8');

    const report = createCloseGuardedWritePlan(root, created.taskId!, 'execute');
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'HANDOFF_CONTINUATION_SEMANTIC_CONFLICT'
    }));
  });

  it('blocks task bookkeeping when actionable structured handoff disables task creation', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Actionable no-create fixture');
    const handoffPath = path.join(root, created.task!.capsule, 'HANDOFF.md');
    const handoff = fs.readFileSync(handoffPath, 'utf8').replace(
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| TBD | TBD | TBD | TBD | TBD |',
      '| Step | Disposition | Create Task | Reason | Required Reading |\n|---|---|---|---|---|\n| Prepare rc2 readiness. | actionable | no | Real task should be created. | docs/RELEASE_READINESS.md |'
    );
    fs.writeFileSync(handoffPath, handoff, 'utf8');

    const report = createCloseGuardedWritePlan(root, created.taskId!, 'execute');
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'HANDOFF_CONTINUATION_SEMANTIC_CONFLICT'
    }));
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
    expect(createCloseGuardedWritePlan(root, first.taskId!, 'execute').ok).toBe(true);
    const afterFirst = readProjectCurrentState(root).state?.continuation;
    expect(afterFirst?.title).toBe('Publish 0.5.0 stable');

    const second = createTaskCreateReport(root, 'Placeholder next step fixture');
    expect(createCloseGuardedWritePlan(root, second.taskId!, 'execute').ok).toBe(true);
    const afterSecond = readProjectCurrentState(root).state?.continuation;
    expect(afterSecond).toEqual(afterFirst);
  });
});
