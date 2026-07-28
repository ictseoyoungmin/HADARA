import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence, appendEvidenceWithResult } from '../../src/evidence/evidence';
import { createTaskAuditCloseReport, createTaskCloseReport, executeTaskCloseEvidence, formatTaskAuditCloseReport } from '../../src/task/close';
import { createTaskCloseTransactionReport } from '../../src/task/close';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskClosePlanReport } from '../../src/task/close';
import { createTaskWorkbenchReport } from '../../src/services/task-workbench';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-close-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, '.hadara'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.hadara', 'scaffold.json'), `${JSON.stringify({ hadaraProtocol: '0.4' }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    path.join(dir, '.hadara', 'slot-registry.json'),
    `${JSON.stringify({ schemaVersion: 'hadara.managedSlot.registry.v1', registryVersion: 1, slots: [], tableSchemas: [] }, null, 2)}\n`,
    'utf8'
  );
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task close report', () => {
  it('closes a clean capsule through the public v3 transaction without an exposed plan hash', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction clean');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);

    const report = createTaskCloseTransactionReport(root, task.id);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.close.v3',
      command: 'task.close',
      ok: true,
      mode: 'execute',
      taskId: task.id,
      closeState: 'closed-valid',
      terminal: true,
      operatorGuidance: expect.stringContaining('Report closed-valid and stop'),
      planStatus: 'satisfied',
      readOnly: false,
      transaction: {
        strategy: 'close-auto',
        internalReview: true,
        proofLast: true,
        stalePlanGuard: true,
        markerPersistence: {
          cleanupWrites: 1,
          progressWrites: 0
        }
      },
      writeSummary: {
        executedMutationSteps: 1,
        evidenceAppends: 2,
        closeProofAppended: true,
        idempotentNoop: false
      },
      source: {
        closePlan: {
          schemaVersion: 'hadara.task.close_plan.v1',
          command: 'task.close-plan',
          ok: true,
          state: 'closed-valid'
        }
      }
    });
    expect(report.transaction.planHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.transaction.markerPersistence.contentWrites).toBeLessThanOrEqual(4);
    expect(report.transaction.markerPersistence.cleanupWrites).toBeLessThanOrEqual(1);
    expect(report.transaction.lockOrder).toEqual(['project-lifecycle', 'task-board', 'task-scoped', 'evidence-append']);
    expect(report.transaction.locks.map((lock) => lock.name)).toEqual(['project-lifecycle', 'task-board', 'task-scoped']);
    expect(report.transaction.locks.every((lock) => lock.path.startsWith('.hadara/local/locks/'))).toBe(true);
    expect(report.transaction.operation).toMatchObject({
      taskId: task.id,
      phase: 'closed-valid',
      persisted: false,
      pendingSteps: []
    });
    expect(report.transaction.operation?.planHash).toBe(report.transaction.planHash);
    expect(report.source.closePlan.execution?.requestedPlanHash).toBe(report.transaction.planHash);
    expect(fs.existsSync(path.join(root, '.hadara', 'local', 'task-close', `${task.id}.json`))).toBe(false);
    expect(report.writeSummary.executedSteps).toEqual(['bookkeeping', 'ready', 'close', 'audit-close']);
    expect(report.primaryNextAction).toBeUndefined();
    expect(report.nextActions).toEqual([]);
    expect(report.operatorGuidance).toContain('do not run task status');
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('Task close validation');
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('returns blocked recovery without lifecycle-owned writes when public close cannot proceed', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction blocked');
    const before = snapshotFiles(root);

    const report = createTaskCloseTransactionReport(root, task.id);

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.close.v3',
      command: 'task.close',
      ok: false,
      mode: 'dry-run',
      closeState: 'blocked',
      readOnly: true,
      writeSummary: {
        executedWrites: 0,
        executedMutationSteps: 0,
        evidenceAppends: 0,
        executedSteps: [],
        closeProofAppended: false
      },
      recovery: {
        required: true
      }
    });
    expect(report.recovery?.action.writeBoundary).not.toBe('read-only');
    expect(report.transaction.markerPersistence).toMatchObject({ contentWrites: 1, cleanupWrites: 1, progressWrites: 0 });
    expect(report.recovery?.action.command).not.toContain('task close');
    expect(report.nextActions.map((action) => action.command ?? '').join('\n')).not.toContain('task close');
    expect(report.source.closePlan.mode).toBe('dry-run');
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('does not expose bookkeeping-owned Draft bookkeeping as a full-status blocker', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close status bookkeeping');
    completeTask(root, task.id, task.dir);
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(taskPath, fs.readFileSync(taskPath, 'utf8').replace('| Status | Done |', '| Status | Draft |'), 'utf8');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(boardPath, fs.readFileSync(boardPath, 'utf8').replace('| Done |', '| Draft |'), 'utf8');

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-06-02T00:00:00.000Z'), { detail: 'full' });

    expect(report.state.ready).toBe(true);
    expect(report.issues.map((issue) => issue.code)).not.toEqual(
      expect.arrayContaining(['HARNESS_TASK_STATUS_NOT_DONE', 'HARNESS_TASK_BOARD_STATUS_NOT_DONE'])
    );
    expect(report.nextActions).toContainEqual(expect.objectContaining({ command: `hadara task close --task ${task.id} --dry-run --json` }));
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('fails closed with zero lifecycle-owned writes when a transaction lock is contended', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction lock timeout');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'task-board.lock');
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(path.join(lockDir, 'lock.json'), `${JSON.stringify({ pid: process.pid, token: 'fixture-live-lock', command: 'test-holder', createdAt: new Date().toISOString() })}\n`, 'utf8');
    const beforeTask = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    const beforeBoard = fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8');
    const beforeEvidence = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    const report = createTaskCloseTransactionReport(root, task.id, { lockTimeoutMs: 25 });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.close.v3',
      command: 'task.close',
      ok: false,
      mode: 'execute-refused',
      closeState: 'blocked',
      planStatus: 'blocked',
      readOnly: true,
      writeSummary: {
        plannedWrites: 0,
        executedWrites: 0,
        executedSteps: [],
        closeProofAppended: false
      }
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CLOSE_TRANSACTION_LOCK_TIMEOUT' }));
    expect(report.recovery?.action.command).toBe(`hadara task close --task ${task.id} --json`);
    expect(report.recovery?.action.writeBoundary).toBe('task-close-transaction');
    expect(report.primaryNextAction).toMatchObject({
      command: `hadara task close --task ${task.id} --json`,
      writeBoundary: 'task-close-transaction'
    });
    expect(report.transaction.locks.map((lock) => lock.name)).toEqual(['project-lifecycle']);
    expect(report.transaction.locks[0]?.path).toBe('.hadara/local/locks/project-lifecycle.lock');
    expect(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8')).toBe(beforeTask);
    expect(fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')).toBe(beforeBoard);
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe(beforeEvidence);
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('reclaims stale transaction locks with dead owners before retrying close', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction stale lock reclaim');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'task-board.lock');
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(
      path.join(lockDir, 'lock.json'),
      `${JSON.stringify({ pid: 999999999, token: 'dead-owner', command: 'task.close', createdAt: new Date().toISOString() })}\n`,
      'utf8'
    );

    const report = createTaskCloseTransactionReport(root, task.id, { lockTimeoutMs: 100 });

    expect(report.ok).toBe(true);
    expect(report.transaction.locks).toContainEqual(
      expect.objectContaining({
        name: 'task-board',
        contended: true,
        staleReclaimed: true,
        staleReason: 'owner-dead',
        ownerPid: 999999999
      })
    );
    expect(report.closeState).toBe('closed-valid');
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('does not reclaim a fresh metadata gap while another process is acquiring a lock', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction fresh metadata gap');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'task-board.lock');
    fs.mkdirSync(lockDir, { recursive: true });

    const report = createTaskCloseTransactionReport(root, task.id, { lockTimeoutMs: 25 });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CLOSE_TRANSACTION_LOCK_TIMEOUT' }));
    expect(report.transaction.locks).not.toContainEqual(expect.objectContaining({ name: 'task-board', staleReclaimed: true }));
    expect(fs.existsSync(lockDir)).toBe(true);
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('reclaims old invalid metadata through the stale-lock path', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction invalid metadata reclaim');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'task-board.lock');
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(path.join(lockDir, 'lock.json'), '{not json', 'utf8');
    const old = new Date(Date.now() - 10_000);
    fs.utimesSync(lockDir, old, old);

    const report = createTaskCloseTransactionReport(root, task.id, { lockTimeoutMs: 100 });

    expect(report.ok).toBe(true);
    expect(report.transaction.locks).toContainEqual(
      expect.objectContaining({
        name: 'task-board',
        contended: true,
        staleReclaimed: true,
        staleReason: 'metadata-invalid'
      })
    );
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('does not reclaim a live-owner lock only because it is old', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction live old lock');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'task-board.lock');
    fs.mkdirSync(lockDir, { recursive: true });
    const old = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    fs.writeFileSync(
      path.join(lockDir, 'lock.json'),
      `${JSON.stringify({ pid: process.pid, token: 'live-old-owner', command: 'task.close', createdAt: old })}\n`,
      'utf8'
    );

    const report = createTaskCloseTransactionReport(root, task.id, { lockTimeoutMs: 25 });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CLOSE_TRANSACTION_LOCK_TIMEOUT' }));
    expect(report.transaction.locks).not.toContainEqual(expect.objectContaining({ name: 'task-board', staleReclaimed: true }));
    expect(fs.existsSync(lockDir)).toBe(true);
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('leaves a recreated lock in place when release cannot prove token ownership', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction release ownership');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8').replace(`| ${task.id} | Close transaction release ownership | Done |`, `| ${task.id} | Close transaction release ownership | Draft |`),
      'utf8'
    );
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'task-close', `${task.id}.lock`);
    let replaced = false;

    const report = createTaskCloseTransactionReport(root, task.id, {
      onProgress(event) {
        if (replaced || event.step !== 'bookkeeping' || event.phase !== 'executed') return;
        replaced = true;
        fs.rmSync(lockDir, { recursive: true, force: true });
        fs.mkdirSync(lockDir, { recursive: true });
      }
    });

    expect(report.ok).toBe(true);
    expect(replaced).toBe(true);
    expect(fs.existsSync(lockDir)).toBe(true);
    expect(fs.existsSync(path.join(lockDir, 'lock.json'))).toBe(false);
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('keeps the explicit reviewed plan hash on both the operation marker and the execute refusal report', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction reviewed hash');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const review = createTaskClosePlanReport(root, task.id);
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(
      boardPath,
      fs
        .readFileSync(boardPath, 'utf8')
        .split(/\r?\n/)
        .map((line) => (line.startsWith(`| ${task.id} |`) ? line.replace('| Done |', '| Draft |') : line))
        .join('\n'),
      'utf8'
    );

    const report = createTaskCloseTransactionReport(root, task.id, { planHash: review.planHash });

    expect(report).toMatchObject({
      ok: false,
      mode: 'execute-refused',
      transaction: {
        strategy: 'close-reviewed-plan',
        internalReview: false
      }
    });
    expect(report.transaction.planHash).toBe(review.planHash);
    expect(report.transaction.operation?.planHash).toBe(review.planHash);
    expect(report.source.closePlan.execution?.requestedPlanHash).toBe(review.planHash);
    expect(report.source.closePlan.execution?.planHashMatched).toBe(false);
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('keeps the shared reviewed hash across the public auto-close minute-boundary refusal', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-28T13:59:59.000+09:00'));
    try {
      const root = tempProject();
      const task = createTaskCapsule(root, 'Close transaction minute boundary');
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

      let reviewedPlanHash: string | undefined;
      const report = createTaskCloseTransactionReport(root, task.id, {
        onAutoReview(review) {
          reviewedPlanHash = review.planHash;
          vi.setSystemTime(new Date('2026-07-28T14:00:00.000+09:00'));
        }
      });

      expect(report).toMatchObject({
        ok: false,
        mode: 'execute-refused',
        transaction: {
          strategy: 'close-auto',
          internalReview: true
        }
      });
      expect(reviewedPlanHash).toMatch(/^sha256:[a-f0-9]{64}$/);
      expect(report.transaction.planHash).toBe(reviewedPlanHash);
      expect(report.transaction.operation?.planHash).toBe(reviewedPlanHash);
      expect(report.source.closePlan.execution?.requestedPlanHash).toBe(reviewedPlanHash);
      expect(report.source.closePlan.execution?.planHashMatched).toBe(false);
      expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('persists local operation state when execution writes lifecycle state then stops on a later blocker', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction partial recovery');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8').replace(`| ${task.id} | Close transaction partial recovery | Done |`, `| ${task.id} | Close transaction partial recovery | Draft |`),
      'utf8'
    );
    let mutated = false;

    const report = createTaskCloseTransactionReport(root, task.id, {
      onProgress(event) {
        if (event.step !== 'bookkeeping' || event.phase !== 'executed' || mutated) return;
        mutated = true;
        fs.writeFileSync(path.join(task.dir, 'TASK.md'), fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8').replace('| TBD | reference | active | TBD |', '| docs/TASK_BOARD.md | constrains | active | Invalid role fixture. |'), 'utf8');
      }
    });

    const operationPath = path.join(root, '.hadara', 'local', 'task-close', `${task.id}.json`);
    expect(report.ok).toBe(false);
    expect(report.writeSummary.executedWrites).toBeGreaterThan(0);
    expect(report.writeSummary.closeProofAppended).toBe(false);
    expect(report.transaction.operation).toMatchObject({
      taskId: task.id,
      phase: 'recovery-required',
      persisted: true,
      completedSteps: ['ready', 'bookkeeping'],
      pendingSteps: ['close', 'audit-close'],
      mutationSummary: {
        executedWrites: 1,
        closeProofAppended: false,
        idempotentNoop: false
      }
    });
    expect(report.transaction.operation?.stepJournal).toEqual(expect.arrayContaining([
      expect.objectContaining({ step: 'bookkeeping', phase: 'intent', status: 'start', mutated: false }),
      expect.objectContaining({ step: 'bookkeeping', phase: 'outcome', status: 'executed', mutated: true }),
      expect.objectContaining({ step: 'ready', phase: 'outcome', status: 'satisfied', mutated: false }),
      expect.objectContaining({ step: 'close', phase: 'outcome', status: 'blocked', mutated: false })
    ]));
    expect(report.transaction.operation?.attempts).toHaveLength(1);
    expect(fs.existsSync(operationPath)).toBe(true);
    const persisted = JSON.parse(fs.readFileSync(operationPath, 'utf8'));
    expect(persisted).toMatchObject({
      taskId: task.id,
      phase: 'recovery-required',
      completedSteps: ['ready', 'bookkeeping'],
      mutationSummary: {
        executedWrites: 1,
        closeProofAppended: false,
        idempotentNoop: false
      }
    });
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).not.toContain('close-proof');
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('recovers a persisted partial operation by rerunning the same public close command after repair', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction partial retry');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8').replace(`| ${task.id} | Close transaction partial retry | Done |`, `| ${task.id} | Close transaction partial retry | Draft |`),
      'utf8'
    );
    let mutated = false;
    const taskPath = path.join(task.dir, 'TASK.md');

    const partial = createTaskCloseTransactionReport(root, task.id, {
      onProgress(event) {
        if (event.step !== 'bookkeeping' || event.phase !== 'executed' || mutated) return;
        mutated = true;
        fs.writeFileSync(taskPath, fs.readFileSync(taskPath, 'utf8').replace('| TBD | reference | active | TBD |', '| docs/TASK_BOARD.md | constrains | active | Invalid role fixture. |'), 'utf8');
      }
    });

    const operationPath = path.join(root, '.hadara', 'local', 'task-close', `${task.id}.json`);
    expect(partial.ok).toBe(false);
    expect(partial.transaction.operation).toMatchObject({ phase: 'recovery-required', persisted: true });
    expect(fs.existsSync(operationPath)).toBe(true);

    fs.writeFileSync(taskPath, fs.readFileSync(taskPath, 'utf8').replace('| docs/TASK_BOARD.md | constrains | active | Invalid role fixture. |', '| docs/TASK_BOARD.md | reference | active | Repaired role fixture. |'), 'utf8');
    const recovered = createTaskCloseTransactionReport(root, task.id);

    expect(recovered).toMatchObject({
      ok: true,
      closeState: 'closed-valid',
      writeSummary: {
        closeProofAppended: true,
        idempotentNoop: false
      },
      transaction: {
        operation: {
          phase: 'closed-valid',
          persisted: false,
          pendingSteps: []
        }
      }
    });
    expect(fs.existsSync(operationPath)).toBe(false);
    const records = fs
      .readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')
      .trim()
      .split(/\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    expect(records.filter((record) => (record.tags ?? []).includes('close-proof'))).toHaveLength(1);
    expect(validateSchema('hadara.task.close.v3', recovered).ok).toBe(true);
  });

  it('does not count an execute-time duplicate close proof as a mutating write', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction existing noop');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    let raced = false;

    const report = createTaskCloseTransactionReport(root, task.id, {
      onProgress(event) {
        if (raced || event.step !== 'close' || event.phase !== 'start') return;
        raced = true;
        const concurrent = createTaskCloseReport(root, task.id, 'execute');
        expect(concurrent.ok).toBe(true);
        executeTaskCloseEvidence(root, concurrent);
      }
    });

    expect(raced).toBe(true);
    expect(report).toMatchObject({
      ok: true,
      closeState: 'closed-valid',
      writeSummary: {
        executedWrites: 0,
        executedMutationSteps: 0,
        evidenceAppends: 1,
        closeProofAppended: false,
        idempotentNoop: true
      }
    });
    expect(report.transaction.markerPersistence).toMatchObject({ progressWrites: 0 });
    expect(report.source.closePlan.execution?.executedSteps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'close', status: 'executed', writeOutcome: 'existing-noop' })
      ])
    );
    expect(report.transaction.operation?.mutationSummary).toMatchObject({
      executedWrites: 0,
      closeProofAppended: false,
      idempotentNoop: true
    });
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
  });

  it('recovers an interrupted run after close proof append without duplicating proof', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction proof append fault');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const operationPath = path.join(root, '.hadara', 'local', 'task-close', `${task.id}.json`);
    let interrupted = false;

    expect(() => createTaskCloseTransactionReport(root, task.id, {
      faultHooks: {
        afterCloseProofAppend() {
          interrupted = true;
          throw new Error('fault after close proof append');
        }
      }
    })).toThrow('fault after close proof append');

    expect(interrupted).toBe(true);
    expect(fs.existsSync(operationPath)).toBe(true);
    expect(closeProofCount(task.dir)).toBe(1);

    const recovered = createTaskCloseTransactionReport(root, task.id);

    expect(recovered).toMatchObject({
      ok: true,
      closeState: 'closed-valid',
      writeSummary: {
        closeProofAppended: false,
        idempotentNoop: true
      }
    });
    expect(fs.existsSync(operationPath)).toBe(false);
    expect(closeProofCount(task.dir)).toBe(1);
    expect(validateSchema('hadara.task.close.v3', recovered).ok).toBe(true);
  });

  it('recovers an interrupted run before terminal cleanup without duplicating proof', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction terminal cleanup fault');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const operationPath = path.join(root, '.hadara', 'local', 'task-close', `${task.id}.json`);

    expect(() => createTaskCloseTransactionReport(root, task.id, {
      faultHooks: {
        beforeTerminalCleanup() {
          throw new Error('fault before terminal cleanup');
        }
      }
    })).toThrow('fault before terminal cleanup');

    expect(fs.existsSync(operationPath)).toBe(true);
    expect(closeProofCount(task.dir)).toBe(1);

    const recovered = createTaskCloseTransactionReport(root, task.id);

    expect(recovered).toMatchObject({
      ok: true,
      closeState: 'closed-valid',
      writeSummary: {
        closeProofAppended: false,
        idempotentNoop: true
      }
    });
    expect(fs.existsSync(operationPath)).toBe(false);
    expect(closeProofCount(task.dir)).toBe(1);
    expect(validateSchema('hadara.task.close.v3', recovered).ok).toBe(true);
  });

  it('journals post-proof recovery only after bookkeeping already succeeded', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction proof before bookkeeping failure');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8').replace(`| ${task.id} | Close transaction proof before bookkeeping failure | Done |`, `| ${task.id} | Close transaction proof before bookkeeping failure | Draft |`),
      'utf8'
    );
    const taskPath = path.join(task.dir, 'TASK.md');
    const originalTask = fs.readFileSync(taskPath, 'utf8');
    let sabotaged = false;

    const partial = createTaskCloseTransactionReport(root, task.id, {
      onProgress(event) {
        if (sabotaged || event.step !== 'close' || event.phase !== 'executed') return;
        sabotaged = true;
        fs.writeFileSync(taskPath, `${fs.readFileSync(taskPath, 'utf8')}\n`, 'utf8');
      }
    });

    const operationPath = path.join(root, '.hadara', 'local', 'task-close', `${task.id}.json`);
    expect(partial.ok).toBe(false);
    expect(partial.writeSummary).toMatchObject({
      executedWrites: 2,
      closeProofAppended: true
    });
    expect(partial.transaction.operation).toMatchObject({
      phase: 'recovery-required',
      persisted: true,
      mutationSummary: {
        executedWrites: 2,
        closeProofAppended: true,
        idempotentNoop: false
      }
    });
    expect(partial.transaction.operation?.stepJournal).toEqual(expect.arrayContaining([
      expect.objectContaining({ step: 'ready', phase: 'outcome', status: 'satisfied', mutated: false }),
      expect.objectContaining({ step: 'close', phase: 'intent', status: 'start', mutated: false }),
      expect.objectContaining({ step: 'close', phase: 'outcome', status: 'executed', mutated: true, writeOutcome: 'appended' }),
      expect.objectContaining({ step: 'bookkeeping', phase: 'outcome', status: 'executed', mutated: true })
    ]));
    expect(fs.existsSync(operationPath)).toBe(true);

    fs.writeFileSync(taskPath, originalTask, 'utf8');
    const recovered = createTaskCloseTransactionReport(root, task.id);

    expect(recovered).toMatchObject({
      ok: true,
      closeState: 'closed-valid',
      writeSummary: {
        executedWrites: 0,
        closeProofAppended: false,
        idempotentNoop: true
      },
      transaction: {
        operation: {
          phase: 'closed-valid',
          persisted: false
        }
      }
    });
    expect(recovered.transaction.operation?.attempts?.length).toBeGreaterThanOrEqual(1);
    expect(fs.existsSync(operationPath)).toBe(false);
    expect(validateSchema('hadara.task.close.v3', recovered).ok).toBe(true);
  });

  it('rejects malformed operation journal entries through the close schema', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close schema negative fixture');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);

    const report = createTaskCloseTransactionReport(root, task.id);
    expect(validateSchema('hadara.task.close.v3', report).ok).toBe(true);
    expect(validateSchema('hadara.task.close.v3', {
      ...report,
      transaction: {
        ...report.transaction,
        operation: report.transaction.operation ? {
          ...report.transaction.operation,
          stepJournal: [{
            seq: 1,
            step: 'bookkeeping',
            phase: 'intent',
            status: 'not-real',
            writeBoundary: 'read-only',
            mutated: false,
            at: report.generatedAt
          }]
        } : report.transaction.operation
      }
    }).ok).toBe(false);
  });

  it('treats public close retry on an already closed capsule as an idempotent no-op', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close transaction retry');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const first = createTaskCloseTransactionReport(root, task.id);
    expect(first.ok).toBe(true);
    const afterFirst = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    const retry = createTaskCloseTransactionReport(root, task.id);
    const afterRetry = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    expect(retry).toMatchObject({
      ok: true,
      closeState: 'closed-valid',
      planStatus: 'satisfied',
      writeSummary: {
        executedWrites: 0,
        closeProofAppended: false,
        idempotentNoop: true
      }
    });
    expect(retry.writeSummary.executedSteps).toEqual(['bookkeeping', 'ready', 'close', 'audit-close']);
    expect(retry.primaryNextAction).toBeUndefined();
    expect(retry.nextActions).toEqual([]);
    expect(afterRetry).toBe(afterFirst);
    expect(validateSchema('hadara.task.close.v3', retry).ok).toBe(true);
  });

  it('prints compact task close JSON by default and keeps the v3 transaction behind --detail full', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI close transaction');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (message?: unknown) => {
      output.push(String(message));
    };
    try {
      expect(handleTaskCommand({ args: ['task', 'close', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.close.summary.v1',
      command: 'task.close',
      ok: true,
      mode: 'execute',
      closeState: 'closed-valid',
      terminal: true,
      writes: {
        closeProofAppended: true
      },
      diagnostics: {
        generatedBy: 'cli',
        commandPath: 'task.close',
        slow: false
      },
      detailCommand: `hadara task close --task ${task.id} --detail full --json`
    });

    output.length = 0;
    console.log = (message?: unknown) => {
      output.push(String(message));
    };
    try {
      expect(handleTaskCommand({ args: ['task', 'close', '--task', task.id, '--detail', 'full', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }
    const full = JSON.parse(output.join('\n'));
    expect(full.schemaVersion).toBe('hadara.task.close.v3');
    expect(full.source.closePlan.schemaVersion).toBe('hadara.task.close_plan.v1');
    expect(validateSchema('hadara.task.close.v3', full).ok).toBe(true);
  });

  it('creates a read-only closePlan with loop-boundary next actions for a completed task', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close ready task');
    completeTask(root, task.id, task.dir);

    const report = createTaskCloseReport(root, task.id, 'dry-run');

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.close.v1',
      command: 'task.close',
      ok: true,
      mode: 'dry-run',
      taskId: task.id,
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null },
      validation: {
        ok: true,
        level: 'done',
        issueCount: 0
      },
      evidenceLint: { ok: true, issueCount: 0 },
      protocolDoctor: { ok: true, issueCount: 0 },
      closeEvidence: {
        planned: true,
        appended: false,
        kind: 'command-log',
        result: 'passed',
        excludedFromCurrentValidationLoop: true
      },
      closeEvidenceWrite: {
        duplicateFound: false,
        duplicateAction: 'append'
      }
    });
    expect(report.closeEvidenceWrite?.idempotencyKey).toBe(`close:${task.id}:${report.validation.validatedBeforeCloseEvidenceSourceHash}:${report.validation.validatedBeforeCloseEvidenceReportHash}`);
    expect(report.validation.validatedBeforeCloseEvidenceReportHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.validation.validatedBeforeCloseEvidenceSourceHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.validation.slotRegistryVersion).toBe(1);
    expect(report.validation.slotRegistryHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.closeEvidence.slotRegistryVersion).toBe(1);
    expect(report.closeEvidence.slotRegistryHash).toBe(report.validation.slotRegistryHash);
    expect(report.closeEvidence.closeEvidenceSnapshot).toMatchObject({
      requiredAcceptanceIds: ['AC-1'],
      latestFailedOrBlockedEvidenceRefs: [],
      unresolvedEvidenceClassifications: []
    });
    expect(report.closeEvidence.closeEvidenceSnapshot?.evidenceSummaryHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.closeEvidence.summary).toContain(`slotRegistryHash ${report.validation.slotRegistryHash}`);
    expect(report.validation.validatedBeforeCloseEvidenceHash).toBe(report.validation.validatedBeforeCloseEvidenceReportHash);
    expect(report.lifecycle).toMatchObject({
      model: 'validation-close-audit',
      reportPhase: 'pre-close-plan',
      nextPhaseAfterSuccess: 'close-execute',
      validationPhase: {
        role: 'prove-readiness',
        command: `hadara task close --task ${task.id} --dry-run --json`,
        includesCloseEvidenceAppend: false
      },
      closePhase: {
        role: 'record-proof',
        command: `hadara task close --task ${task.id} --json`,
        writes: 'close-evidence-only'
      },
      auditPhase: {
        role: 'check-close-record',
        command: `hadara task status --task ${task.id} --detail full --json`,
        writes: 'none'
      },
      closeEvidenceLoopBoundary: {
        excludedFromCurrentValidationLoop: true
      }
    });
    expect(report.nextActions.map((action) => action.id)).toEqual(['append-close-evidence']);
    expect(report.primaryNextAction).toMatchObject({
      id: 'append-close-evidence',
      loopBoundary: true,
      command: `hadara task close --task ${task.id} --json`,
      writeBoundary: 'evidence-append',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'low'
    });
    expect(report.primaryNextAction).not.toHaveProperty('message');
  });

  it('reports blockers for tasks that are not done-ready', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close blocked task');

    const report = createTaskCloseReport(root, task.id, 'dry-run');

    expect(report.ok).toBe(false);
    expect(report.summary.blockers).toBeGreaterThan(0);
    expect(report.closeEvidence.planned).toBe(false);
    expect(report.primaryNextAction).toMatchObject({ id: 'run-done-validation', writeBoundary: 'read-only' });
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'resolve-close-blockers', required: true }));
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'HARNESS_ACCEPTANCE_INCOMPLETE',
          path: `tasks/${task.id}-close-blocked-task/TASK.md`,
          heading: 'Acceptance Criteria',
          fixHint: expect.stringContaining('acceptance criterion'),
          remediationHint: expect.objectContaining({
            path: `tasks/${task.id}-close-blocked-task/TASK.md`,
            heading: 'Acceptance Criteria',
            blocking: true
          })
        })
      ])
    );
  });

  it('appends only close evidence in execute mode after blockers pass', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close execute evidence');
    completeTask(root, task.id, task.dir);

    const report = createTaskCloseReport(root, task.id, 'execute');
    const before = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');
    executeTaskCloseEvidence(root, report);
    const after = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    expect(report.ok).toBe(true);
    expect(report.closeEvidence.appended).toBe(true);
    expect(report.lifecycle).toMatchObject({
      reportPhase: 'close-execute',
      nextPhaseAfterSuccess: 'post-close-audit',
      closePhase: { writes: 'close-evidence-only' },
      auditPhase: { command: `hadara task status --task ${task.id} --detail full --json`, writes: 'none' }
    });
    expect(report.closeEvidence.sourceHash).toBe(report.validation.validatedBeforeCloseEvidenceSourceHash);
    expect(after.split(/\r?\n/).filter(Boolean).length).toBe(before.split(/\r?\n/).filter(Boolean).length + 1);
    expect(after).toContain('"kind":"command-log"');
    expect(after).toContain('"Task close validation for ' + task.id);
    expect(report.closeEvidence.markdownPath).toBe(`tasks/${task.id}-close-execute-evidence/EVIDENCE.md`);
    expect(report.closeEvidence.evidencePath).toBe(`tasks/${task.id}-close-execute-evidence/evidence.jsonl`);
    const closeRecord = JSON.parse(after.trim().split(/\r?\n/).at(-1) ?? '{}');
    expect(closeRecord).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      idempotencyKey: report.closeEvidenceWrite?.idempotencyKey,
      closeEvidenceSnapshot: report.closeEvidence.closeEvidenceSnapshot,
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null }
    });
    expect(report.closeEvidenceWrite?.executeRecheck).toEqual({ performed: true, duplicateFound: false, action: 'append' });
    expect(closeRecord.tags).toEqual(expect.arrayContaining(['close-proof', `idempotency:${report.closeEvidenceWrite?.idempotencyKey}`]));
    expect(report.nextActions.map((action) => action.id)).toEqual(['close-evidence-appended', 'audit-close']);
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'audit-close', command: `hadara task status --task ${task.id} --detail full --json`, writeBoundary: 'read-only', recommendedActorRole: 'reviewer' }));
    expect(report.nextActions[0]).not.toHaveProperty('message');
  });

  it('does not append duplicate close evidence for the same source and report hash', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close duplicate evidence');
    completeTask(root, task.id, task.dir);
    const firstReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, firstReport);
    const afterFirst = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    const duplicateReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, duplicateReport);
    const afterDuplicate = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    expect(duplicateReport.closeEvidenceWrite).toMatchObject({
      idempotencyKey: firstReport.closeEvidenceWrite?.idempotencyKey,
      duplicateFound: true,
      duplicateAction: 'no-op'
    });
    expect(duplicateReport.closeEvidence.planned).toBe(false);
    expect(duplicateReport.closeEvidence.appended).toBe(false);
    expect(duplicateReport.nextActions).toContainEqual(expect.objectContaining({ id: 'close-evidence-duplicate-noop', writeBoundary: 'read-only' }));
    expect(afterDuplicate).toBe(afterFirst);
    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit.closeEvidenceAudit).toMatchObject({
      latestCloseEvidenceId: expect.stringMatching(new RegExp(`^ev:${task.id}:`)),
      supersededCloseEvidenceIds: [],
      duplicateCloseEvidenceCount: 0,
      verdict: 'valid'
    });
  });

  it('rechecks evidence immediately before append and no-ops a stale same-hash execute report', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close race recheck');
    completeTask(root, task.id, task.dir);
    const staleExecuteReport = createTaskCloseReport(root, task.id, 'execute');
    const firstReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, firstReport);
    const afterFirst = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    executeTaskCloseEvidence(root, staleExecuteReport);
    const afterStaleExecute = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    expect(staleExecuteReport.closeEvidenceWrite).toMatchObject({
      idempotencyKey: firstReport.closeEvidenceWrite?.idempotencyKey,
      duplicateFound: true,
      duplicateAction: 'no-op',
      executeRecheck: {
        performed: true,
        duplicateFound: true,
        action: 'no-op'
      }
    });
    expect(staleExecuteReport.closeEvidence.planned).toBe(false);
    expect(staleExecuteReport.closeEvidence.appended).toBe(false);
    expect(staleExecuteReport.nextActions).toContainEqual(expect.objectContaining({ id: 'close-evidence-duplicate-noop', writeBoundary: 'read-only' }));
    expect(afterStaleExecute).toBe(afterFirst);
    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit.closeEvidenceAudit).toMatchObject({
      duplicateCloseEvidenceCount: 0,
      verdict: 'valid'
    });
  });

  it('appends changed close evidence and marks the previous proof as superseded', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close supersedes evidence');
    completeTask(root, task.id, task.dir);
    const firstReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, firstReport);
    const firstRecord = JSON.parse(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim().split(/\r?\n/).at(-1) ?? '{}');

    fs.appendFileSync(path.join(task.dir, 'TASK.md'), '\n<!-- close-source drift for supersede fixture -->\n', 'utf8');
    const secondReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, secondReport);
    const records = fs
      .readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')
      .trim()
      .split(/\r?\n/)
      .map((line) => JSON.parse(line));
    const secondRecord = records.at(-1);

    expect(secondReport.closeEvidenceWrite).toMatchObject({
      duplicateFound: false,
      duplicateAction: 'append',
      supersedes: [firstRecord.id]
    });
    expect(secondRecord.tags).toEqual(expect.arrayContaining([`supersedes:${firstRecord.id}`, `idempotency:${secondReport.closeEvidenceWrite?.idempotencyKey}`]));
    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit.latestCloseEvidence?.id).toBe(secondRecord.id);
    expect(audit.closeEvidenceAudit).toMatchObject({
      latestCloseEvidenceId: secondRecord.id,
      supersededCloseEvidenceIds: [firstRecord.id],
      duplicateCloseEvidenceCount: 0,
      verdict: 'valid'
    });
    expect(audit.auditVerdict).toMatchObject({
      verdict: 'closed-valid',
      reportHashMatches: true,
      sourceHashMatches: true
    });
  });

  it('audits close evidence and reports hash drift as a warning', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close audit evidence');
    completeTask(root, task.id, task.dir);
    const closeReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, closeReport);

    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit).toMatchObject({
      schemaVersion: 'hadara.task.audit_close.v1',
      command: 'task.audit-close',
      ok: true,
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null },
      summary: { closeEvidenceRecords: 1, blockers: 0 }
    });
    expect(audit.nextActions).toEqual([]);
    expect(audit.latestCloseEvidence?.validationReportHash).toBe(closeReport.validation.validatedBeforeCloseEvidenceReportHash);
    expect(audit.latestCloseEvidence?.sourceHash).toBe(closeReport.validation.validatedBeforeCloseEvidenceSourceHash);
    expect(audit.latestCloseEvidence?.slotRegistryHash).toBe(closeReport.validation.slotRegistryHash);
    expect(audit.latestCloseEvidence?.slotRegistryVersion).toBe(closeReport.validation.slotRegistryVersion);
    expect(audit.latestCloseEvidence?.closeEvidenceSnapshot).toEqual(closeReport.closeEvidence.closeEvidenceSnapshot);
    expect(audit.currentCloseEvidenceSnapshot).toEqual(closeReport.closeEvidence.closeEvidenceSnapshot);
    expect(audit.currentSlotRegistryHash).toBe(closeReport.validation.slotRegistryHash);
    expect(audit.currentSlotRegistryVersion).toBe(closeReport.validation.slotRegistryVersion);
    expect(audit.closeEvidenceAudit).toMatchObject({
      latestCloseEvidenceId: expect.stringMatching(new RegExp(`^ev:${task.id}:`)),
      supersededCloseEvidenceIds: [],
      duplicateCloseEvidenceCount: 0,
      verdict: 'valid'
    });
    expect(audit.auditVerdict).toMatchObject({
      phase: 'post-close-audit',
      verdict: 'closed-valid',
      closeEvidenceFound: true,
      closeEvidenceValid: true,
      reportHashMatches: true,
      sourceHashMatches: true,
      slotRegistryHashMatches: true,
      recordedValidationReportHash: closeReport.validation.validatedBeforeCloseEvidenceReportHash,
      recordedSourceHash: closeReport.validation.validatedBeforeCloseEvidenceSourceHash,
      recordedSlotRegistryHash: closeReport.validation.slotRegistryHash,
      recordedSlotRegistryVersion: closeReport.validation.slotRegistryVersion,
      currentValidationReportHash: audit.currentValidationReportHash,
      currentSourceHash: audit.currentSourceHash,
      currentSlotRegistryHash: audit.currentSlotRegistryHash,
      currentSlotRegistryVersion: audit.currentSlotRegistryVersion,
      blockers: 0,
      warnings: 0,
      writeBoundary: 'read-only',
      model: 'validation-close-audit'
    });
    expect(formatTaskAuditCloseReport(audit)).toContain('State\n- Closed: yes');
    expect(formatTaskAuditCloseReport(audit)).toContain('Close Evidence\n- Latest: passed');
    expect(formatTaskAuditCloseReport(audit)).toContain('- Slot registry hash: sha256:');
    expect(formatTaskAuditCloseReport(audit)).toContain('Audit\n- Verdict: closed-valid');
    expect(formatTaskAuditCloseReport(audit)).toContain('- Blockers: 0');
    expect(formatTaskAuditCloseReport(audit)).toContain('Suggested next');

    fs.appendFileSync(path.join(task.dir, 'TASK.md'), '\n<!-- close-source drift for audit fixture -->\n', 'utf8');
    const drift = createTaskAuditCloseReport(root, task.id);
    expect(drift.ok).toBe(true);
    expect(drift.auditVerdict).toMatchObject({
      verdict: 'closed-with-drift-warnings',
      closeEvidenceFound: true,
      closeEvidenceValid: true,
      reportHashMatches: true,
      sourceHashMatches: false,
      writeBoundary: 'read-only'
    });
    expect(drift.issues).toContainEqual(expect.objectContaining({ severity: 'warning', code: 'TASK_CLOSE_AUDIT_SOURCE_HASH_DRIFT' }));

    fs.appendFileSync(path.join(root, '.hadara', 'slot-registry.json'), '\n', 'utf8');
    const registryDrift = createTaskAuditCloseReport(root, task.id);
    expect(registryDrift.auditVerdict).toMatchObject({
      verdict: 'closed-with-drift-warnings',
      slotRegistryHashMatches: false
    });
    expect(registryDrift.issues).toContainEqual(expect.objectContaining({ severity: 'warning', code: 'TASK_CLOSE_AUDIT_SLOT_REGISTRY_HASH_DRIFT' }));
  });

  it('reports evidence snapshot drift without placing proof in close-source docs', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close snapshot drift');
    completeTask(root, task.id, task.dir);
    const closeReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, closeReport);

    appendEvidence(root, { taskId: task.id, kind: 'command-log', summary: 'Post-close validation failed.', result: 'failed', visibility: 'public', category: 'validation' });
    const drift = createTaskAuditCloseReport(root, task.id);

    expect(drift.auditVerdict.verdict).toBe('closed-with-drift-warnings');
    expect(drift.issues).toContainEqual(expect.objectContaining({ severity: 'warning', code: 'EVIDENCE_SNAPSHOT_DRIFT' }));
    expect(drift.currentCloseEvidenceSnapshot?.latestFailedOrBlockedEvidenceRefs).toHaveLength(1);
    expect(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8')).not.toContain('## Close Proof');
    expect(fs.readFileSync(path.join(task.dir, 'HANDOFF.md'), 'utf8')).not.toContain('CloseState');
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain('## Close Proof');
  });

  it('does not flag a failed evidence record as unresolved once a later record resolves it', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close snapshot resolution reuse');
    completeTask(root, task.id, task.dir);

    const failed = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Full validation failed on a transient environment issue.',
      result: 'failed',
      category: 'validation',
      outcome: 'failed',
      visibility: 'public'
    });
    const failedId = failed.evidence.schemaVersion === 'hadara.evidence.v2' ? failed.evidence.id : undefined;
    expect(failedId).toBeDefined();

    const beforeResolution = createTaskCloseReport(root, task.id, 'dry-run');
    expect(beforeResolution.closeEvidence.closeEvidenceSnapshot?.latestFailedOrBlockedEvidenceRefs).toContain(failedId);

    appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Full validation passed after re-running in a clean environment.',
      result: 'passed',
      category: 'validation',
      outcome: 'passed',
      visibility: 'public',
      tags: [`resolves:${failedId}`]
    });

    const afterResolution = createTaskCloseReport(root, task.id, 'dry-run');
    expect(afterResolution.closeEvidence.closeEvidenceSnapshot?.latestFailedOrBlockedEvidenceRefs).not.toContain(failedId);
    expect(afterResolution.closeEvidence.closeEvidenceSnapshot?.unresolvedEvidenceClassifications).not.toContainEqual(expect.objectContaining({ evidenceRef: failedId }));
  });

  it('reports missing close evidence during audit', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close audit missing');
    completeTask(root, task.id, task.dir);

    const audit = createTaskAuditCloseReport(root, task.id);

    expect(audit.ok).toBe(false);
    expect(audit.auditVerdict).toMatchObject({
      verdict: 'not-closed',
      closeEvidenceFound: false,
      closeEvidenceValid: false,
      blockers: 1,
      writeBoundary: 'read-only'
    });
    expect(audit.primaryNextAction).toMatchObject({
      id: 'close-first',
      command: `hadara task close --task ${task.id} --dry-run --json`,
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    });
    expect(audit.closeEvidenceAudit).toMatchObject({
      supersededCloseEvidenceIds: [],
      duplicateCloseEvidenceCount: 0,
      verdict: 'not-closed'
    });
    expect(audit.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CLOSE_EVIDENCE_MISSING' }));
  });
});

function completeTask(root: string, taskId: string, taskDir: string): void {
  const validation = appendEvidenceWithResult(root, {
    taskId,
    kind: 'test-log',
    summary: 'Close-ready fixture validation passed.',
    result: 'passed',
    visibility: 'public'
  });
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-02 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-02 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise task closening. | Fixture verifies close readiness. |')
      .replace('| TBD | TBD |', '| Complete fixture documents. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace(/\| \d{4}-\d{2}-\d{2} \| Draft \| Initial task scaffold\. \|/, '| 2026-06-02 | Done | Fixture complete. |'),
    'utf8'
  );
  updateTaskBoardDone(root, taskId);
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Read-only closePlan. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/close/proof.ts | Add | Close plan. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), `# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Fixture complete. | Met | ${validation.evidence.id} |\n`, 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise close. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use fixture. | Accepted | Test closePlan. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
}

function updateTaskBoardDone(root: string, taskId: string): void {
  const taskBoard = path.join(root, 'docs', 'TASK_BOARD.md');
  fs.writeFileSync(
    taskBoard,
    fs
      .readFileSync(taskBoard, 'utf8')
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', '| Done |') : line))
      .join('\n'),
    'utf8'
  );
}

function markStateDocsCurrent(root: string, taskId: string): void {
  const projectStatePath = path.join(root, 'docs', 'PROJECT_STATE.md');
  const agentHandoffPath = path.join(root, 'docs', 'AGENT_HANDOFF.md');
  fs.writeFileSync(projectStatePath, `# Project State\n\n${taskId} is current and complete.\n`, 'utf8');
  fs.writeFileSync(agentHandoffPath, `# Agent Handoff\n\n${taskId} is current and complete.\n`, 'utf8');
}

function closeProofCount(taskDir: string): number {
  return fs
    .readFileSync(path.join(taskDir, 'evidence.jsonl'), 'utf8')
    .trim()
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { tags?: string[] })
    .filter((record) => (record.tags ?? []).includes('close-proof'))
    .length;
}

function snapshotFiles(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      result[path.relative(root, full).split(path.sep).join('/')] = fs.readFileSync(full, 'utf8');
    }
  }
  walk(root);
  return result;
}
