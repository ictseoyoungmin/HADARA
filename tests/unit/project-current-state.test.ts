import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { initProject } from '../../src/init/project';
import { createInitUpgradeReport } from '../../src/init/upgrade';
import {
  completeProjectCurrentTask,
  PROJECT_CURRENT_STATE_PATH,
  planCompletedProjectCurrentStateWrites,
  planProjectValidationBaselinePromotion,
  readProjectCurrentState,
  renderHandoffCanonSection,
  renderProjectStateCanonSection
} from '../../src/services/project-current-state';
import { createStateProjectionReport } from '../../src/services/state-projection';
import { createOpsStatusReport } from '../../src/services/operations-status-service';
import { createTaskCreateReport } from '../../src/task/task-create';
import { createTaskFinishReport } from '../../src/task/task-finish';

function tempRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-current-state-'));
}

function writeEvidence(root: string, capsule: string, taskId: string, id: string, outcome: 'passed' | 'failed'): void {
  fs.appendFileSync(path.join(root, capsule, 'evidence.jsonl'), `${JSON.stringify({
    schemaVersion: 'hadara.evidence.v2',
    id,
    fingerprint: `sha256:${'a'.repeat(64)}`,
    idSource: 'persisted',
    idStability: 'durable',
    time: '2026-07-21T00:00:00.000Z',
    taskId,
    category: 'validation',
    outcome,
    visibility: 'public',
    summary: 'Fixture evidence.',
    artifacts: [],
    tags: [],
    legacy: { kind: 'command-log', result: outcome }
  })}\n`, 'utf8');
}

describe('project current-state canon', () => {
  it('scaffolds a schema-valid portable canon and deterministic Markdown projections', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const read = readProjectCurrentState(root);
    expect(read.issues).toEqual([]);
    expect(read.state).toMatchObject({
      schemaVersion: 'hadara.projectCurrentState.v1',
      rev: 1,
      profile: 'governed',
      latestCompletedTaskBasis: 'highest-done-task-id',
      latestCompletedTask: null,
      activeTask: null
    });
    expect(validateSchema('hadara.projectCurrentState.v1', read.state).ok).toBe(true);
    expect(fs.readFileSync(path.join(root, 'docs/PROJECT_STATE.md'), 'utf8')).toContain(renderProjectStateCanonSection(read.state!));
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), 'utf8')).toContain(renderHandoffCanonSection(read.state!));
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), 'utf8')).toContain('| Active Task | None | No active task; use next-work selection guidance. |');
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), 'utf8')).toContain('| Latest Completed Task Basis | highest-done-task-id | Out-of-order close chronology is not tracked here. |');
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), 'utf8')).toContain('| Current Trusted Validation Baseline | No validation baseline has been recorded yet. | No evidence ids recorded. |');
  });

  it('renders active task handoff notes based on whether a task is selected', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const initial = readProjectCurrentState(root).state!;
    expect(renderHandoffCanonSection(initial)).toContain('| Active Task | None | No active task; use next-work selection guidance. |');

    const created = createTaskCreateReport(root, 'Active handoff note fixture');
    const active = readProjectCurrentState(root).state!;
    expect(active.activeTask).toEqual({ id: created.taskId, title: 'Active handoff note fixture' });
    expect(renderHandoffCanonSection(active)).toContain(`| Active Task | ${created.taskId} Active handoff note fixture | Resume this capsule first. |`);
  });

  it('plans validation baseline promotion as a current-state/projection bundle', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const task = createTaskCreateReport(root, 'Baseline evidence fixture');
    writeEvidence(root, task.task!.capsule, task.taskId!, 'ev:T-0001:abc', 'passed');
    writeEvidence(root, task.task!.capsule, task.taskId!, 'ev:T-0001:def', 'passed');

    const plan = planProjectValidationBaselinePromotion(root, {
      summary: 'Focused validation and Docker sync-build passed.',
      evidence: ['ev:T-0001:abc', ' ev:T-0001:def '],
      release: '0.5.0-rc.1',
      taskId: task.taskId!
    });

    expect(plan.issues).toEqual([]);
    expect(plan.planHash).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(plan.writes.map((write) => write.path).sort()).toEqual([
      '.hadara/state/current.json',
      'docs/AGENT_HANDOFF.md',
      'docs/PROJECT_STATE.md'
    ]);
    const currentAfter = JSON.parse(plan.writes.find((write) => write.path === '.hadara/state/current.json')!.after);
    expect(currentAfter.validationBaseline).toEqual({
      summary: 'Focused validation and Docker sync-build passed.',
      evidence: ['ev:T-0001:abc', 'ev:T-0001:def']
    });
    expect(currentAfter.currentRelease).toBe('0.5.0-rc.1');
    expect(plan.after.currentRelease).toBe('0.5.0-rc.1');
    expect(plan.writes.find((write) => write.path === 'docs/AGENT_HANDOFF.md')!.after).toContain('ev:T-0001:abc, ev:T-0001:def');
  });

  it('rejects missing or non-passed evidence during baseline promotion planning', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const task = createTaskCreateReport(root, 'Baseline failed evidence fixture');
    writeEvidence(root, task.task!.capsule, task.taskId!, 'ev:T-0001:failed', 'failed');

    expect(planProjectValidationBaselinePromotion(root, {
      summary: 'Should not promote.',
      evidence: ['ev:T-0001:missing'],
      taskId: task.taskId!
    }).issues).toContainEqual(expect.objectContaining({ code: 'PROJECT_CURRENT_STATE_BASELINE_EVIDENCE_NOT_FOUND' }));
    expect(planProjectValidationBaselinePromotion(root, {
      summary: 'Should not promote.',
      evidence: ['ev:T-0001:failed'],
      taskId: task.taskId!
    }).issues).toContainEqual(expect.objectContaining({ code: 'PROJECT_CURRENT_STATE_BASELINE_EVIDENCE_NOT_PASSED' }));
  });

  it('synchronizes active and latest task facts through create and finish without a new command', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const created = createTaskCreateReport(root, 'Canon lifecycle fixture');
    expect(created.ok).toBe(true);
    expect(created.issues).toEqual([]);
    const active = readProjectCurrentState(root).state!;
    expect(active.activeTask).toEqual({ id: created.taskId, title: 'Canon lifecycle fixture' });
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), 'utf8')).toContain(`| Active Task | ${created.taskId} Canon lifecycle fixture |`);
    expect(createOpsStatusReport(root, { includeDebt: false })).toMatchObject({
      tasks: {
        lastCompleted: [],
        nextRecommended: created.taskId
      },
      validation: {
        latestFullCheck: 'No validation baseline has been recorded yet.'
      }
    });

    const dryRun = createTaskFinishReport(root, created.taskId!, 'dry-run');
    expect(dryRun.writes.map((write) => write.field)).toEqual(expect.arrayContaining([
      'task-status',
      'task-board-row',
      'current-state',
      'project-state-projection',
      'handoff-projection'
    ]));
    const executed = createTaskFinishReport(root, created.taskId!, 'execute');
    expect(executed.ok).toBe(true);
    const completed = readProjectCurrentState(root).state!;
    expect(completed.latestCompletedTask).toEqual({ id: created.taskId, title: 'Canon lifecycle fixture' });
    expect(completed.activeTask).toBeNull();
    expect(fs.readFileSync(path.join(root, 'docs/PROJECT_STATE.md'), 'utf8')).toContain(`| Latest Completed Task | ${created.taskId} Canon lifecycle fixture |`);
  });

  it('keeps latestCompletedTask on the highest Done task id when older tasks close later', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const first = createTaskCreateReport(root, 'First out-of-order fixture');
    const second = createTaskCreateReport(root, 'Second out-of-order fixture');

    expect(completeProjectCurrentTask(root, { id: second.taskId!, title: 'Second out-of-order fixture' })).toEqual([]);
    expect(readProjectCurrentState(root).state?.latestCompletedTask).toEqual({
      id: second.taskId,
      title: 'Second out-of-order fixture'
    });

    expect(completeProjectCurrentTask(root, { id: first.taskId!, title: 'First out-of-order fixture' })).toEqual([]);
    const completed = readProjectCurrentState(root).state!;
    expect(completed.latestCompletedTask).toEqual({
      id: second.taskId,
      title: 'Second out-of-order fixture'
    });
    expect(completed.activeTask).toBeNull();

    const plan = planCompletedProjectCurrentStateWrites(root, { id: first.taskId!, title: 'First out-of-order fixture' });
    expect(plan).toEqual({ writes: [], issues: [] });
  });

  it('retires nextWork when the completed task matches the structured recommendation', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const currentPath = path.join(root, PROJECT_CURRENT_STATE_PATH);
    const current = readProjectCurrentState(root).state!;
    fs.writeFileSync(
      currentPath,
      `${JSON.stringify({
        ...current,
        nextWork: {
          title: 'Retry interrupted onboarding task',
          state: 'candidate',
          operatorGuidance: 'Resume the interrupted user-requested work.',
          createCommandAllowed: true
        },
        nextOperatorIntent: 'Retry interrupted onboarding task.'
      }, null, 2)}\n`,
      'utf8'
    );

    expect(completeProjectCurrentTask(root, { id: 'T-0007', title: 'Retry interrupted onboarding task' })).toEqual([]);
    const completed = readProjectCurrentState(root).state!;
    expect(completed.nextWork).toBeNull();
    expect(completed.nextOperatorIntent).toBe('No next work selected. Run `hadara task status --json` for current task-selection guidance.');
  });

  it('orders current-state task refs by numeric suffix beyond four digits', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const currentPath = path.join(root, PROJECT_CURRENT_STATE_PATH);
    const current = readProjectCurrentState(root).state!;
    fs.writeFileSync(
      currentPath,
      `${JSON.stringify({
        ...current,
        latestCompletedTask: { id: 'T-9999', title: 'Pre-five-digit task' },
        activeTask: { id: 'T-10000', title: 'Five-digit task' }
      }, null, 2)}\n`,
      'utf8'
    );

    expect(validateSchema('hadara.projectCurrentState.v1', readProjectCurrentState(root).state).ok).toBe(true);
    expect(completeProjectCurrentTask(root, { id: 'T-10000', title: 'Five-digit task' })).toEqual([]);
    expect(readProjectCurrentState(root).state?.latestCompletedTask).toEqual({
      id: 'T-10000',
      title: 'Five-digit task'
    });
  });

  it('keeps legacy v1 current-state JSON schema-compatible while readers normalize latest basis', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const currentPath = path.join(root, PROJECT_CURRENT_STATE_PATH);
    const legacy = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
    delete legacy.latestCompletedTaskBasis;
    fs.writeFileSync(currentPath, `${JSON.stringify(legacy, null, 2)}\n`, 'utf8');

    expect(validateSchema('hadara.projectCurrentState.v1', legacy).ok).toBe(true);
    const read = readProjectCurrentState(root);
    expect(read.issues).toEqual([]);
    expect(read.state?.latestCompletedTaskBasis).toBe('highest-done-task-id');
  });

  it('migrates a legacy project through reviewed init upgrade while preserving unrelated prose', () => {
    const root = tempRoot();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs/PROJECT_STATE.md'), `# PROJECT_STATE\n\n## Metadata\n\n| Field | Value |\n|---|---|\n| HADARA Profile | standard |\n| Stable Version | 0.4.2 |\n\n## Custom Notes\n\nKeep this project-authored prose.\n`, 'utf8');
    fs.writeFileSync(path.join(root, 'docs/TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');

    const dryRun = createInitUpgradeReport(root, 'standard', 'dry-run');
    expect(dryRun.ok).toBe(true);
    expect(dryRun.actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ action: 'upgrade-current-state', path: PROJECT_CURRENT_STATE_PATH, status: 'planned' })
    ]));
    expect(fs.existsSync(path.join(root, PROJECT_CURRENT_STATE_PATH))).toBe(false);

    const executed = createInitUpgradeReport(root, 'standard', 'execute');
    expect(executed.ok).toBe(true);
    expect(validateSchema('hadara.projectCurrentState.v1', readProjectCurrentState(root).state).ok).toBe(true);
    const projectState = fs.readFileSync(path.join(root, 'docs/PROJECT_STATE.md'), 'utf8');
    expect(projectState).toContain('hadara:managed:start current-state-canon');
    expect(projectState).toContain('Keep this project-authored prose.');
  });

  it('reports managed projection drift while keeping the structured state authoritative', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const projectStatePath = path.join(root, 'docs/PROJECT_STATE.md');
    fs.writeFileSync(projectStatePath, fs.readFileSync(projectStatePath, 'utf8').replace('| Current Release |', '| Current Release Drifted |'), 'utf8');

    const report = createStateProjectionReport(root);
    expect(report.sources.currentState).toMatchObject({ exists: true, rev: 1 });
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'STATE_CURRENT_CANON_PROJECTION_DRIFT', path: 'docs/PROJECT_STATE.md' })
    ]));
  });
});
