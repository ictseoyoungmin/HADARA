import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskFinalizeReport } from '../../src/task/task-finalize';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-finalize-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task finalize dry-run plan', () => {
  it('returns a read-only finish-required plan with a stable plan hash for a draft task', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize draft');
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id);
    const second = createTaskFinalizeReport(root, task.id);

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.finalize.v1',
      command: 'task.finalize',
      ok: false,
      readOnly: true,
      mode: 'dry-run',
      taskId: task.id,
      planStatus: 'executable-with-deferred-checks',
      deferredChecks: ['ready', 'close', 'audit-close'],
      partialExecutionRisk: true,
      summary: {
        steps: 4,
        required: 1,
        blocked: 0,
        executeSupported: true,
        deferredChecks: ['ready', 'close', 'audit-close'],
        partialExecutionRisk: true,
        evaluatedReports: ['finish'],
        skippedReports: ['ready', 'close', 'audit-close']
      },
      primaryNextAction: {
        id: 'finalize-execute-reviewed-plan',
        command: `hadara task finalize --task ${task.id} --execute --auto --json`,
        writeBoundary: 'task-local',
        summary: 'Apply bounded finish bookkeeping. Then finalize will re-evaluate ready, close, audit-close and may stop if blockers appear.'
      },
      authoringGuidance: {
        readOnly: true,
        writesProse: false,
        status: 'needs-authoring'
      }
    });
    expect(report.authoringGuidance.items).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'validation', status: 'placeholder' })]));
    expect(report.planHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(second.planHash).toBe(report.planHash);
    expect(report.steps.map((step) => step.id)).toEqual(['finish', 'ready', 'close', 'audit-close']);
    expect(report.steps.find((step) => step.id === 'ready')).toMatchObject({ status: 'pending', sourceReport: 'hadara.task.ready.v1' });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'TASK_FINALIZE_DEFERRED_CHECKS', severity: 'info' })]));
    expect(report.primaryNextAction).not.toHaveProperty('message');
    expect(report.steps.find((step) => step.id === 'finish')).toMatchObject({
      status: 'required',
      mode: 'execute',
      writeBoundary: 'task-local',
      expectedWritePaths: expect.arrayContaining([`tasks/${task.id}-finalize-draft/TASK.md`, 'docs/TASK_BOARD.md'])
    });
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('points weak done evidence blockers at passed validation evidence instead of another readiness rerun', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize weak evidence');
    completeTask(root, task.id, task.dir, 'unknown');
    markStateDocsCurrent(root, task.id);

    const report = createTaskFinalizeReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.state).toBe('blocked');
    expect(report.planStatus).toBe('blocked');
    expect(report.summary.evaluatedReports).toEqual(['finish', 'ready', 'close']);
    expect(report.summary.skippedReports).toEqual(['audit-close']);
    expect(report.primaryNextAction).toMatchObject({
      id: 'finalize-record-passed-evidence',
      command: `hadara evidence add-command --task ${task.id} --summary "Focused validation passed." --result passed --category validation --json`,
      writeBoundary: 'evidence-append'
    });
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'TASK_FINALIZE_EVIDENCE_QUALITY_HINT',
          severity: 'info',
          example: 'hadara evidence add-command --task T-XXXX --summary "Focused validation passed." --result passed --category validation --json'
        })
      ])
    );
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('plans close evidence append after finish, state docs, and readiness are satisfied', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize close');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);

    const report = createTaskFinalizeReport(root, task.id);

    expect(report.ok).toBe(true);
    expect(report.state).toBe('ready-to-close');
    expect(report.planStatus).toBe('executable-with-deferred-checks');
    expect(report.deferredChecks).toEqual(['audit-close']);
    expect(report.partialExecutionRisk).toBe(true);
    expect(report.blockingIssues).toEqual([]);
    expect(report.pendingWrites).toEqual([
      {
        step: 'close',
        writeBoundary: 'evidence-append',
        paths: [`tasks/${task.id}-finalize-close/evidence.jsonl`]
      }
    ]);
    expect(report.summary).toMatchObject({ required: 1, blocked: 0, satisfied: 2, deferredChecks: ['audit-close'], partialExecutionRisk: true });
    expect(report.primaryNextAction).toMatchObject({
      id: 'finalize-execute-reviewed-plan',
      command: `hadara task finalize --task ${task.id} --execute --auto --json`,
      writeBoundary: 'evidence-append',
      summary: 'Append close evidence through finalize execute. Then finalize will re-evaluate audit-close and may stop if blockers appear.'
    });
    expect(report.primaryNextAction).not.toHaveProperty('message');
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CLOSE_EVIDENCE_MISSING', severity: 'info' }));
    expect(report.steps.find((step) => step.id === 'close')).toMatchObject({
      status: 'required',
      mode: 'execute',
      writeBoundary: 'evidence-append',
      expectedWritePaths: [`tasks/${task.id}-finalize-close/evidence.jsonl`],
      alreadySatisfied: false
    });
  });

  it('refuses execute without a reviewed plan hash and does not write', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize execute refused');
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      ok: false,
      readOnly: true,
      mode: 'execute-refused',
      summary: { executeSupported: true }
    });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'error', code: 'TASK_FINALIZE_PLAN_HASH_REQUIRED' })]));
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'info', code: 'TASK_FINALIZE_DEFERRED_CHECKS' })]));
    expect(report.planHash).toMatch(/^sha256:/);
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('refuses execute when the reviewed plan hash is stale and does not write', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize stale hash');
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, planHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000' });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      ok: false,
      readOnly: true,
      mode: 'execute-refused',
      execution: {
        requestedPlanHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
        planHashMatched: false,
        executedSteps: []
      }
    });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'error', code: 'TASK_FINALIZE_PLAN_HASH_MISMATCH' })]));
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'info', code: 'TASK_FINALIZE_DEFERRED_CHECKS' })]));
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('executes matching finish then stops before close when readiness blocks', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize stop on blocker');
    const plan = createTaskFinalizeReport(root, task.id);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, planHash: plan.planHash });

    expect(report).toMatchObject({
      ok: false,
      readOnly: false,
      mode: 'execute',
      execution: {
        requestedPlanHash: plan.planHash,
        planHashMatched: true,
        stoppedAt: 'ready'
      }
    });
    expect(report.execution?.executedSteps.map((step) => step.id)).toEqual(['finish', 'ready']);
    expect(report.execution?.executedSteps[0]).toMatchObject({ id: 'finish', status: 'executed', ok: true, writeBoundary: 'task-local' });
    expect(report.execution?.executedSteps[1]).toMatchObject({ id: 'ready', status: 'blocked', ok: false, writeBoundary: 'read-only' });
    expect(snapshotFiles(root)[`tasks/${task.id}-finalize-stop-on-blocker/evidence.jsonl`]).not.toContain('Task close validation');
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('executes matching close evidence append and returns closed-valid after audit', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize execute close');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const plan = createTaskFinalizeReport(root, task.id);
    const progress: string[] = [];

    const report = createTaskFinalizeReport(root, task.id, {
      executeRequested: true,
      planHash: plan.planHash,
      onProgress: (event) => progress.push(`${event.step}:${event.phase}:${event.ok ?? 'unknown'}`)
    });

    expect(report).toMatchObject({
      ok: true,
      readOnly: false,
      mode: 'execute',
      summary: { required: 0, blocked: 0, satisfied: 4 },
      execution: {
        requestedPlanHash: plan.planHash,
        planHashMatched: true
      },
      steps: expect.arrayContaining([
        expect.objectContaining({ id: 'close', status: 'satisfied' }),
        expect.objectContaining({ id: 'audit-close', status: 'satisfied' })
      ])
    });
    expect(report.execution?.executedSteps.map((step) => step.id)).toEqual(['finish', 'ready', 'close', 'audit-close']);
    expect(report.execution?.executedSteps.find((step) => step.id === 'close')).toMatchObject({ status: 'executed', ok: true, writeBoundary: 'evidence-append' });
    expect(report.readinessEvidence).toBeUndefined();
    expect(progress).toEqual(expect.arrayContaining([
      'ready:start:unknown',
      'ready:satisfied:true',
      'close:start:unknown',
      'close:executed:true',
      'refresh:start:unknown',
      'refresh:satisfied:true',
      'audit-close:start:unknown',
      'audit-close:satisfied:true'
    ]));
    expect(snapshotFiles(root)[`tasks/${task.id}-finalize-execute-close/evidence.jsonl`]).toContain('Task close validation');
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('repairs close-source drift through guarded finalize execute', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize drift guidance');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const plan = createTaskFinalizeReport(root, task.id);
    const closed = createTaskFinalizeReport(root, task.id, { executeRequested: true, planHash: plan.planHash });
    expect(closed.ok).toBe(true);

    fs.appendFileSync(path.join(task.dir, 'HANDOFF.md'), '\nPost-close close-source edit.\n', 'utf8');
    const report = createTaskFinalizeReport(root, task.id);

    expect(report.ok).toBe(true);
    expect(report.state).toBe('closed-stale');
    expect(report.planStatus).toBe('executable-with-deferred-checks');
    expect(report.pendingWrites).toEqual([
      {
        step: 'close',
        writeBoundary: 'evidence-append',
        paths: [`tasks/${task.id}-finalize-drift-guidance/evidence.jsonl`]
      }
    ]);
    expect(report.steps.find((step) => step.id === 'close')).toMatchObject({
      status: 'required',
      summary: 'Append fresh close evidence through finalize repair.'
    });
    expect(report.steps.find((step) => step.id === 'audit-close')).toMatchObject({
      status: 'pending',
      summary: 'Audit waits for close evidence.'
    });
    expect(report.primaryNextAction).toMatchObject({
      id: 'finalize-repair-close-proof',
      command: `hadara task finalize --task ${task.id} --execute --auto --json`,
      writeBoundary: 'evidence-append'
    });
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'TASK_CLOSE_AUDIT_SOURCE_HASH_DRIFT', severity: 'warning' }),
        expect.objectContaining({
          code: 'TASK_FINALIZE_CLOSE_SOURCE_DRIFT_GUIDANCE',
          severity: 'info',
          example: `hadara task finalize --task ${task.id} --json`
        })
      ])
    );
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);

    const repaired = createTaskFinalizeReport(root, task.id, { executeRequested: true, planHash: report.planHash });

    expect(repaired.ok).toBe(true);
    expect(repaired.state).toBe('closed-valid');
    expect(repaired.nextActions).toEqual([]);
    expect(repaired.execution?.executedSteps.map((step) => step.id)).toEqual(['finish', 'ready', 'close', 'audit-close']);
    expect(repaired.execution?.executedSteps.find((step) => step.id === 'close')).toMatchObject({ status: 'executed', ok: true });
    expect(validateSchema('hadara.task.finalize.v1', repaired).ok).toBe(true);
  });

  it('routes the CLI task finalize command through the read-only report', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI finalize');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (message?: unknown) => {
      output.push(String(message));
    };
    try {
      expect(handleTaskCommand({ args: ['task', 'finalize', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.schemaVersion).toBe('hadara.task.finalize.v1');
    expect(report.command).toBe('task.finalize');
    expect(report.mode).toBe('dry-run');
    expect(report.planHash).toMatch(/^sha256:/);
    expect(report.diagnostics).toMatchObject({
      generatedBy: 'cli',
      commandPath: 'task.finalize',
      slowThresholdMs: 10000,
      slow: false
    });
    expect(report.diagnostics.durationMs).toEqual(expect.any(Number));
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
    expect(process.exitCode).toBe(6);
  });
});

describe('task finalize --auto (FD-010)', () => {
  it('reaches closed-valid in a single auto call on a clean capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize auto clean');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });

    expect(report).toMatchObject({
      ok: true,
      readOnly: false,
      mode: 'execute',
      state: 'closed-valid',
      execution: { planHashMatched: true },
      readinessEvidence: {
        attempted: true,
        reason: 'close-required',
        existing: false,
        jsonlAppended: true
      }
    });
    expect(report.execution?.executedSteps.map((step) => step.id)).toEqual(['finish', 'ready', 'close', 'audit-close']);
    const evidenceJsonl = snapshotFiles(root)[`tasks/${task.id}-finalize-auto-clean/evidence.jsonl`];
    expect(evidenceJsonl).toContain('"category":"validation"');
    expect(evidenceJsonl).toContain('task-finalize-readiness');
    expect(evidenceJsonl).toContain('Task close validation');
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('does not append readiness evidence when auto finalize is already closed-valid', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize auto idempotent');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const closed = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });
    expect(closed.ok).toBe(true);
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });

    expect(report).toMatchObject({ ok: true, state: 'closed-valid', planStatus: 'satisfied' });
    expect(report.readinessEvidence).toBeUndefined();
    expect(snapshotFiles(root)).toEqual(before);
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('refuses with zero writes and dry-run-equivalent blockers when the capsule is blocked', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize auto blocked');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(taskPath, fs.readFileSync(taskPath, 'utf8').replace('| RF-1 | Follow-up | TBD | Open | TBD |', '| RF-1 | Follow-up | TBD | Resolved | TBD |'), 'utf8');
    const dryRun = createTaskFinalizeReport(root, task.id);
    expect(dryRun.blockingIssues.length).toBeGreaterThan(0);
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report.mode).toBe('dry-run');
    expect(report.ok).toBe(false);
    expect(report.blockingIssues.map((issue) => issue.code)).toEqual(dryRun.blockingIssues.map((issue) => issue.code));
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('preflights done-level table blockers before applying finish writes in auto mode', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize auto preflight blockers');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const taskPath = path.join(task.dir, 'TASK.md');
    const planPath = path.join(task.dir, 'PLAN.md');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace('| TBD | reference | active | TBD |', '| docs/TASK_BOARD.md | constrains | active | Invalid role fixture. |'),
      'utf8'
    );
    fs.writeFileSync(
      planPath,
      fs.readFileSync(planPath, 'utf8').replace('| 1 | Complete fixture. | Done | Fixture. |', '| 1 | Complete fixture. | In Progress | Fixture. |'),
      'utf8'
    );
    fs.writeFileSync(
      boardPath,
      fs
        .readFileSync(boardPath, 'utf8')
        .split(/\r?\n/)
        .map((line) => (line.startsWith(`| ${task.id} |`) ? line.replace('| Done |', '| Draft |') : line))
        .join('\n'),
      'utf8'
    );
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({ ok: false, mode: 'dry-run', state: 'blocked', planStatus: 'blocked' });
    expect(report.pendingWrites).toEqual([]);
    expect(report.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ severity: 'error', code: 'HARNESS_TASK_SOURCE_DOCUMENT_ROLE_INVALID_TOKEN' }),
        expect.objectContaining({ severity: 'error', code: 'HARNESS_TASK_PLAN_STATUS_DRIFT' })
      ])
    );
    expect(report.blockingIssues.map((issue) => issue.code)).not.toContain('HARNESS_TASK_BOARD_STATUS_NOT_DONE');
    expect(report.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'finish', status: 'pending', writeBoundary: 'read-only' }),
        expect.objectContaining({ id: 'ready', status: 'blocked' })
      ])
    );
    expect(snapshotFiles(root)[`tasks/${task.id}-finalize-auto-preflight-blockers/TASK.md`]).toContain('| Status | Done |');
    expect(snapshotFiles(root)['docs/TASK_BOARD.md']).toContain(`| ${task.id} | Finalize auto preflight blockers | Draft |`);
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('preflights hidden post-finish blockers before writing Draft lifecycle status in auto mode', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize auto hidden blocker');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const taskPath = path.join(task.dir, 'TASK.md');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace('| Status | Done |', '| Status | Draft |')
        .replace('| TBD | reference | active | TBD |', '| docs/TASK_BOARD.md | constrains | active | Invalid role fixture. |'),
      'utf8'
    );
    fs.writeFileSync(
      boardPath,
      fs
        .readFileSync(boardPath, 'utf8')
        .split(/\r?\n/)
        .map((line) => (line.startsWith(`| ${task.id} |`) ? line.replace('| Done |', '| Draft |') : line))
        .join('\n'),
      'utf8'
    );
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({ ok: false, mode: 'dry-run', state: 'blocked', planStatus: 'blocked', partialExecutionRisk: false });
    expect(report.pendingWrites).toEqual([]);
    expect(report.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ severity: 'error', code: 'HARNESS_TASK_SOURCE_DOCUMENT_ROLE_INVALID_TOKEN' })
      ])
    );
    expect(report.blockingIssues.map((issue) => issue.code)).not.toContain('HARNESS_TASK_STATUS_NOT_DONE');
    expect(report.blockingIssues.map((issue) => issue.code)).not.toContain('HARNESS_TASK_BOARD_STATUS_NOT_DONE');
    expect(snapshotFiles(root)[`tasks/${task.id}-finalize-auto-hidden-blocker/TASK.md`]).toContain('| Status | Draft |');
    expect(snapshotFiles(root)['docs/TASK_BOARD.md']).toContain(`| ${task.id} | Finalize auto hidden blocker | Draft |`);
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('closes a clean first-capsule style Draft task without manual lifecycle status edits', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize auto first capsule');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const taskPath = path.join(task.dir, 'TASK.md');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(
      taskPath,
      fs.readFileSync(taskPath, 'utf8').replace('| Status | Done |', '| Status | Draft |'),
      'utf8'
    );
    fs.writeFileSync(
      boardPath,
      fs
        .readFileSync(boardPath, 'utf8')
        .split(/\r?\n/)
        .map((line) => (line.startsWith(`| ${task.id} |`) ? line.replace('| Done |', '| Draft |') : line))
        .join('\n'),
      'utf8'
    );

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });

    expect(report).toMatchObject({ ok: true, mode: 'execute', state: 'closed-valid', partialExecutionRisk: false });
    expect(snapshotFiles(root)[`tasks/${task.id}-finalize-auto-first-capsule/TASK.md`]).toContain('| Status | Done |');
    expect(snapshotFiles(root)['docs/TASK_BOARD.md']).toContain(`| ${task.id} | Finalize auto first capsule | Done |`);
    expect(report.execution?.executedSteps.map((step) => step.id)).toEqual(['finish', 'ready', 'close', 'audit-close']);
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('surfaces missing v2 History Done row before execute', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize missing history done');
    completeTask(root, task.id, task.dir, 'passed', { keepHistoryDraft: true });
    markStateDocsCurrent(root, task.id);
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({ ok: false, mode: 'dry-run', state: 'blocked', planStatus: 'blocked' });
    expect(report.authoringGuidance.items).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'history',
        status: 'pending',
        required: true,
        summary: expect.stringContaining('Before finalize execute')
      })
    ]));
    expect(report.blockingIssues).toEqual(expect.arrayContaining([
      expect.objectContaining({ severity: 'error', code: 'HARNESS_TASK_HISTORY_NOT_DONE' })
    ]));
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('aborts through the plan-hash mismatch guard when close-source changes between review and execute', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize auto race');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');

    const report = createTaskFinalizeReport(root, task.id, {
      executeRequested: true,
      auto: true,
      onAutoReview: () => {
        fs.writeFileSync(
          boardPath,
          fs
            .readFileSync(boardPath, 'utf8')
            .split(/\r?\n/)
            .map((line) => (line.startsWith(`| ${task.id} |`) ? line.replace('| Done |', '| Draft |') : line))
            .join('\n'),
          'utf8'
        );
      }
    });

    expect(report).toMatchObject({ ok: false, mode: 'execute-refused', execution: { planHashMatched: false } });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'error', code: 'TASK_FINALIZE_PLAN_HASH_MISMATCH' })]));
    expect(snapshotFiles(root)[`tasks/${task.id}-finalize-auto-race/evidence.jsonl`]).not.toContain('Task close validation');
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('rejects --auto combined with an explicit --plan-hash without writing', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize auto conflict');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, {
      executeRequested: true,
      auto: true,
      planHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000'
    });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report.mode).toBe('execute-refused');
    expect(report.ok).toBe(false);
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'error', code: 'TASK_FINALIZE_AUTO_PLAN_HASH_CONFLICT' })]));
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });
});

function snapshotFiles(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  walk(root, (filePath) => {
    files[toPortablePath(path.relative(root, filePath))] = fs.readFileSync(filePath, 'utf8');
  });
  return files;
}

function walk(dir: string, visit: (filePath: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, visit);
    if (entry.isFile()) visit(fullPath);
  }
}

function completeTask(
  root: string,
  taskId: string,
  taskDir: string,
  evidenceResult: 'passed' | 'failed' | 'blocked' | 'unknown' = 'passed',
  options: { keepHistoryDraft?: boolean } = {}
): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-07 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-07 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise finalize planning. | Fixture verifies finalize plan. |')
      .replace('| TBD | TBD |', '| Complete fixture capsule. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace(/\| \d{4}-\d{2}-\d{2} \| Draft \| Initial task scaffold\. \|/, options.keepHistoryDraft ? '| 2026-06-07 | In Progress | Fixture still active. |' : '| 2026-06-07 | Done | Fixture complete. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', options.keepHistoryDraft ? '| 2026-06-07T00:00:00.000Z | In Progress | Fixture still active. | Evidence. |' : '| 2026-06-07T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    fs
      .readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', '| Done |') : line))
      .join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Finalize is read-only. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/task-finalize.ts | Add | Finalize plan. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Fixture complete. | Met | Evidence. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise finalize plan. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use finalize fixture. | Accepted | Test plan report. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
  appendEvidence(root, { taskId, kind: 'test-log', summary: 'Finalize fixture validation passed.', result: evidenceResult, visibility: 'public' });
}

function markStateDocsCurrent(root: string, taskId: string): void {
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), `# Development Slices\n\n| ID | Task |\n|---|---|\n| 1 | ${taskId} |\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), `# Project State\n\nLatest completed task: ${taskId}.\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# Agent Handoff\n\nActive task context includes ${taskId}.\n`, 'utf8');
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
