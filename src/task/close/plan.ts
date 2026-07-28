import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { HadaraActorContext } from '../../core/actor-context';
import type { HadaraNextAction } from '../../core/next-action';
import { appendEvidenceWithResult, EvidenceAppendResult } from '../../evidence/evidence';
import { createTaskAuditCloseReport, createTaskCloseReport, executeTaskCloseEvidence, TaskAuditCloseReport, TaskCloseIssue, TaskCloseNextAction, TaskCloseReport } from './proof';
import { createCloseBookkeepingReport, executeReviewedCloseBookkeepingPlan, CloseBookkeepingReport } from './bookkeeping';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor, selectPrimaryNextAction } from '../lifecycle-next-actions';
import { createTaskAuthoringGuidance, TaskAuthoringGuidance } from '../authoring-guidance';

export type TaskClosePlanMode = 'dry-run' | 'execute' | 'execute-refused';

// Done-level blockers that the bookkeeping step's bounded bookkeeping write is
// defined to resolve (TASK.md/Task Board status cells). --auto treats these
// as executable-through, matching the manual dry-run -> execute pattern.
const FINISH_RESOLVABLE_BLOCKER_CODES = new Set([
  'HARNESS_TASK_STATUS_NOT_DONE',
  'HARNESS_TASK_STATUS_HISTORY_NOT_DONE',
  'HARNESS_TASK_BOARD_STATUS_NOT_DONE',
  'HARNESS_TASK_BOARD_CAPSULE_MISMATCH'
]);

export function isCloseBookkeepingResolvableBlocker(code: string): boolean {
  return FINISH_RESOLVABLE_BLOCKER_CODES.has(code);
}
export type TaskClosePlanStepId = 'bookkeeping' | 'ready' | 'close' | 'audit-close';
export type TaskClosePlanStepStatus = 'satisfied' | 'required' | 'blocked' | 'pending' | 'unknown';

export interface TaskClosePlanReport {
  schemaVersion: 'hadara.task.close_plan.v1';
  command: 'task.close-plan';
  ok: boolean;
  state: 'blocked' | 'ready-to-close' | 'closed-valid' | 'closed-stale' | 'in-progress';
  planStatus: 'blocked' | 'executable' | 'executable-with-deferred-checks' | 'satisfied' | 'pending';
  blockingIssues: TaskClosePlanIssue[];
  deferredChecks: TaskClosePlanStepId[];
  partialExecutionRisk: boolean;
  pendingWrites: Array<{
    step: TaskClosePlanStepId;
    writeBoundary: TaskClosePlanStep['writeBoundary'];
    paths: string[];
  }>;
  readOnly: boolean;
  mode: TaskClosePlanMode;
  taskId: string;
  generatedAt: string;
  actor: HadaraActorContext;
  planHash?: string;
  summary: {
    steps: number;
    required: number;
    blocked: number;
    satisfied: number;
    executeSupported: boolean;
    deferredChecks?: TaskClosePlanStepId[];
    partialExecutionRisk?: boolean;
    evaluatedReports?: string[];
    skippedReports?: string[];
  };
  steps: TaskClosePlanStep[];
  execution?: TaskClosePlanExecution;
  readinessEvidence?: TaskClosePlanReadinessEvidence;
  authoringGuidance: TaskAuthoringGuidance;
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  issues: TaskClosePlanIssue[];
}

export interface TaskClosePlanStep {
  id: TaskClosePlanStepId;
  status: TaskClosePlanStepStatus;
  summary: string;
  command: string;
  mode: 'dry-run' | 'execute' | 'read-only';
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
  expectedWritePaths: string[];
  alreadySatisfied: boolean;
  sourceReport: string;
}

export interface TaskClosePlanIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
  fixHint?: string;
  example?: string;
}

export interface TaskClosePlanExecution {
  requestedPlanHash?: string;
  currentPlanHash?: string;
  planHashMatched: boolean;
  executedSteps: TaskClosePlanExecutedStep[];
  stoppedAt?: TaskClosePlanStepId;
}

export interface TaskClosePlanReadinessEvidence {
  attempted: boolean;
  reason: 'close-required' | 'blocked';
  id?: string;
  existing?: boolean;
  jsonlAppended?: boolean;
  markdownAppended?: boolean;
  summary?: string;
}

export interface TaskClosePlanExecutedStep {
  id: TaskClosePlanStepId;
  status: 'executed' | 'satisfied' | 'blocked' | 'skipped';
  command: string;
  ok: boolean;
  reportHash: string;
  summary: string;
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
  writeOutcome?: 'appended' | 'existing-noop' | 'blocked';
}

export interface TaskClosePlanProgressEvent {
  step: TaskClosePlanStepId | 'refresh';
  phase: 'start' | 'executed' | 'satisfied' | 'blocked';
  summary: string;
  ok?: boolean;
  writeBoundary?: TaskClosePlanExecutedStep['writeBoundary'];
  writeOutcome?: TaskClosePlanExecutedStep['writeOutcome'];
  mutated?: boolean;
}

export interface TaskClosePlanOptions {
  executeRequested?: boolean;
  planHash?: string;
  /**
   * FD-010 low-ceremony path: run an internal dry-run review first, refuse
   * with zero writes when blockers exist, then execute against a freshly
   * recomputed plan through the existing plan-hash mismatch guard. Mutually
   * exclusive with an explicit `planHash`.
   */
  auto?: boolean;
  recordReadinessEvidence?: boolean;
  actor?: HadaraActorContext;
  onProgress?: (event: TaskClosePlanProgressEvent) => void;
  /**
   * Internal orchestration seam: reuse a previously reviewed closePlan artifact
   * instead of recomputing the same dry-run state.
   */
  reviewedPlan?: ReviewedTaskClosePlan;
  /**
   * Test seam: invoked after the `auto` review pass and before the execute
   * pass so race fixtures can mutate close-source state in the window the
   * plan-hash guard must protect. Not used by CLI callers.
   */
  onAutoReview?: (review: TaskClosePlanReport) => void;
}

export interface ReviewedTaskClosePlan {
  reports: ClosePlanReports;
  steps: TaskClosePlanStep[];
  issues: TaskClosePlanIssue[];
  planHash: string;
  review: TaskClosePlanReport;
}

interface ClosePlanReports {
  bookkeeping: CloseBookkeepingReport;
  ready?: CloseReadinessReport;
  close?: TaskCloseReport;
  audit?: TaskAuditCloseReport;
}

interface VirtualCloseReports {
  ready?: CloseReadinessReport;
  close?: TaskCloseReport;
  audit?: TaskAuditCloseReport;
}

interface CloseReadinessReport {
  ok: boolean;
  summary: {
    ready: boolean;
    blockers: number;
    warnings: number;
  };
  checks: {
    validation: boolean;
    evidence: boolean;
    protocol: boolean;
  };
  nextActions: TaskCloseNextAction[];
  primaryNextAction?: TaskCloseNextAction;
  issues: TaskCloseIssue[];
}

export function createTaskClosePlanReport(projectRoot: string, taskId: string, options: TaskClosePlanOptions = {}): TaskClosePlanReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  if (options.executeRequested && options.auto) {
    return executeAutoClosePlan(projectRoot, taskId, actor, options);
  }
  const reviewed = options.reviewedPlan ?? createReviewedTaskClosePlan(projectRoot, taskId, actor);
  if (options.executeRequested) {
    return executeTaskClosePlan(
      projectRoot,
      taskId,
      actor,
      reviewed.reports,
      reviewed.steps,
      reviewed.issues,
      reviewed.planHash,
      options.planHash,
      options.onProgress,
      options.recordReadinessEvidence ?? false
    );
  }
  const report = reviewed.review;
  const steps = reviewed.steps;
  const bookkeepingRequired = steps.some((step) => step.id === 'bookkeeping' && step.status === 'required');
  const preflightBlockers = bookkeepingRequired && report.authoringGuidance.status !== 'needs-authoring'
    ? createAutoClosePlanPreflightBlockers(projectRoot, taskId, actor).filter(isDryRunPreflightBlocker)
    : [];
  const reportPreflightBlockers = report.blockingIssues.filter(isDryRunPreflightBlocker);
  if (preflightBlockers.length > 0 || reportPreflightBlockers.length > 0) return createAutoPreflightBlockedReport(taskId, report, preflightBlockers);
  return report;
}

function executeAutoClosePlan(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  options: TaskClosePlanOptions
): TaskClosePlanReport {
  if (options.planHash) {
    const reviewed = options.reviewedPlan ?? createReviewedTaskClosePlan(projectRoot, taskId, actor);
    return createExecuteRefusal(
      taskId,
      actor,
      'TASK_CLOSE_PLAN_AUTO_PLAN_HASH_CONFLICT',
      'task close --execute --auto is mutually exclusive with --plan-hash. Use --auto alone, or review a dry-run and pass its --plan-hash without --auto.',
      reviewed.planHash,
      reviewed.steps
    );
  }

  // Review pass: identical to a manual dry-run. Zero writes.
  const reviewed = options.reviewedPlan ?? createReviewedTaskClosePlan(projectRoot, taskId, actor);
  const review = reviewed.review;
  options.onAutoReview?.(review);
  const current = createReviewedTaskClosePlan(projectRoot, taskId, actor);
  if (current.planHash !== reviewed.planHash) {
    return createExecuteRefusal(
      taskId,
      actor,
      'TASK_CLOSE_PLAN_PLAN_HASH_MISMATCH',
      'task close --execute refused because --auto review became stale before execution.',
      current.planHash,
      current.steps,
      {
        requestedPlanHash: reviewed.planHash,
        currentPlanHash: current.planHash,
        planHashMatched: false,
        executedSteps: []
      }
    );
  }
  // Board bookkeeping blockers are owned and resolved by the bookkeeping step;
  // the manual flow executes through them, so --auto must not refuse on
  // them while a required bookkeeping step is part of the reviewed plan.
  const bookkeepingRequired = reviewed.steps.some((step) => step.id === 'bookkeeping' && step.status === 'required');
  const preflightBlockers = bookkeepingRequired ? createAutoClosePlanPreflightBlockers(projectRoot, taskId, actor) : [];
  if (preflightBlockers.length > 0) return createAutoPreflightBlockedReport(taskId, review, preflightBlockers);

  const unresolvedBlockers = review.blockingIssues.filter(
    (issue) => !(bookkeepingRequired && FINISH_RESOLVABLE_BLOCKER_CODES.has(issue.code))
  );
  const hasBlockers = unresolvedBlockers.length > 0 || !review.summary.executeSupported || !review.planHash;
  if (hasBlockers) return review;

  // Execute pass: recompute the plan from scratch and pass the reviewed hash
  // through the existing mismatch guard, so any close-source change between
  // the two passes aborts exactly like a stale manual --plan-hash would.
  return executeTaskClosePlan(
    projectRoot,
    taskId,
    actor,
    reviewed.reports,
    reviewed.steps,
    reviewed.issues,
    reviewed.planHash,
    reviewed.planHash,
    options.onProgress,
    true
  );
}

export function createReviewedTaskClosePlan(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext
): ReviewedTaskClosePlan {
  const reports = createClosePlanReports(projectRoot, taskId, actor);
  const steps = createSteps(taskId, reports);
  const issues = collectIssues(taskId, reports);
  const planHash = hashPlan(taskId, steps, reports);
  const review = createClosePlanReport(taskId, actor, 'dry-run', true, steps, issues, planHash, undefined, reports);
  return { reports, steps, issues, planHash, review };
}

function createAutoClosePlanPreflightBlockers(projectRoot: string, taskId: string, actor: HadaraActorContext): TaskClosePlanIssue[] {
  const bookkeepingPlan = createCloseBookkeepingReport(projectRoot, taskId, 'dry-run', { actor });
  if (!bookkeepingPlan.ok) return bookkeepingPlan.issues.map(closeBookkeepingIssueToClosePlanIssue);
  const tempRoot = createVirtualBookkeptProjectRoot(projectRoot, taskId, bookkeepingPlan);
  try {
    const closePlan = createTaskCloseReport(tempRoot, taskId, 'dry-run', { actor });
    return closePlan.issues
      .filter((issue) => issue.severity === 'error')
      .map((issue) => ({
        severity: issue.severity,
        code: issue.code,
        message: issue.message,
        ...(issue.path ? { path: issue.path } : {}),
        ...(issue.fixHint ? { fixHint: issue.fixHint } : {}),
        ...(issue.example ? { example: issue.example } : {})
      }));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function closeBookkeepingIssueToClosePlanIssue(issue: CloseBookkeepingReport['issues'][number]): TaskClosePlanIssue {
  return {
    severity: issue.severity,
    code: issue.code,
    message: issue.message,
    ...(issue.path ? { path: issue.path } : {})
  };
}

function isDryRunPreflightBlocker(issue: TaskClosePlanIssue): boolean {
  if (FINISH_RESOLVABLE_BLOCKER_CODES.has(issue.code)) return false;
  return issue.code.includes('INVALID_TOKEN') || issue.code === 'HARNESS_TASK_PLAN_STATUS_DRIFT';
}

function createVirtualBookkeptProjectRoot(projectRoot: string, taskId: string, bookkeepingPlan: CloseBookkeepingReport): string {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-closePlan-preflight-'));
  const task = bookkeepingPlan.task;
  if (!task) return tempRoot;

  copyIfExists(path.join(projectRoot, task.capsule), path.join(tempRoot, task.capsule));
  for (const docPath of [
    path.join('docs', 'TASK_BOARD.md'),
    path.join('docs', 'PROJECT_STATE.md'),
    path.join('docs', 'AGENT_HANDOFF.md'),
    path.join('docs', 'DEVELOPMENT_SLICES.md'),
    path.join('docs', 'DECISIONS.md')
  ]) {
    copyIfExists(path.join(projectRoot, docPath), path.join(tempRoot, docPath));
  }
  for (const statePath of [
    path.join('.hadara', 'state'),
    path.join('.hadara', 'context'),
    path.join('.hadara', 'docs-registry.json'),
    path.join('.hadara', 'slot-registry.json'),
    path.join('.hadara', 'scaffold.json')
  ]) {
    copyIfExists(path.join(projectRoot, statePath), path.join(tempRoot, statePath));
  }

  for (const write of bookkeepingPlan.writes) {
    const absolutePath = path.join(tempRoot, write.path);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    if (write.contentAfter !== undefined) {
      fs.writeFileSync(absolutePath, write.contentAfter, 'utf8');
      continue;
    }
    if (write.field === 'task-status') {
      const current = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
      fs.writeFileSync(absolutePath, current.replace(/^(\|\s*Status\s*\|\s*)[^|]*(\|)$/m, `$1${write.after} $2`), 'utf8');
    }
  }

  // Ensure the task id is visible in the virtual root even if an unusual
  // fixture omitted the board row before bookkeeping planning.
  if (!fs.existsSync(path.join(tempRoot, task.capsule, 'TASK.md'))) {
    fs.mkdirSync(path.join(tempRoot, task.capsule), { recursive: true });
    fs.writeFileSync(path.join(tempRoot, task.capsule, 'TASK.md'), `# ${taskId}\n`, 'utf8');
  }
  return tempRoot;
}

function copyIfExists(source: string, destination: string): void {
  if (!fs.existsSync(source)) return;
  const stat = fs.statSync(source);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (stat.isDirectory()) {
    fs.cpSync(source, destination, {
      recursive: true,
      filter: (candidate) => !candidate.includes(`${path.sep}.hadara${path.sep}local${path.sep}`)
    });
    return;
  }
  fs.copyFileSync(source, destination);
}

function createAutoPreflightBlockedReport(taskId: string, review: TaskClosePlanReport, preflightBlockers: TaskClosePlanIssue[]): TaskClosePlanReport {
  const mergedIssues = mergeClosePlanIssues(
    review.issues.filter((issue) => issue.code !== 'TASK_CLOSE_PLAN_DEFERRED_CHECKS' && !FINISH_RESOLVABLE_BLOCKER_CODES.has(issue.code)),
    preflightBlockers
  );
  const steps = review.steps.map((step): TaskClosePlanStep => {
    if (step.id === 'bookkeeping' && step.status === 'required') {
      return {
        ...step,
        status: 'pending',
        summary: 'Bookkeeping waits for preflight blockers to be resolved.',
        command: `hadara task status --task ${taskId} --detail full --json`,
        mode: 'read-only',
        writeBoundary: 'read-only',
        expectedWritePaths: []
      };
    }
    if (step.id === 'ready' && step.status === 'pending') {
      return {
        ...step,
        status: 'blocked',
        summary: 'Resolve done-level preflight blockers before bookkeeping writes.',
        command: `hadara task status --task ${taskId} --detail full --json`
      };
    }
    return step;
  });
  const nextAction = createPrimaryNextAction(taskId, steps, mergedIssues, review.planHash);
  const blockedReport: TaskClosePlanReport = {
    ...review,
    ok: false,
    state: 'blocked',
    planStatus: 'blocked',
    blockingIssues: closePlanBlockingIssues(mergedIssues),
    deferredChecks: [],
    partialExecutionRisk: false,
    pendingWrites: [],
    summary: summarizeSteps(steps),
    steps,
    issues: mergedIssues,
    nextActions: nextAction ? [nextAction] : []
  };
  delete blockedReport.primaryNextAction;
  if (nextAction) blockedReport.primaryNextAction = nextAction;
  return blockedReport;
}

function mergeClosePlanIssues(first: TaskClosePlanIssue[], second: TaskClosePlanIssue[]): TaskClosePlanIssue[] {
  const seen = new Set<string>();
  const merged: TaskClosePlanIssue[] = [];
  for (const issue of [...first, ...second]) {
    const key = `${issue.severity}:${issue.code}:${issue.path ?? ''}:${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(issue);
  }
  return merged;
}

export function formatTaskClosePlanReport(report: TaskClosePlanReport): string {
  const lines = [`[HADARA] task close ${report.taskId}: ${report.mode}`];
  lines.push(`readOnly=${report.readOnly} ok=${report.ok} planHash=${report.planHash ?? 'none'}`);
  if (report.diagnostics) lines.push(`durationMs=${report.diagnostics.durationMs}${report.diagnostics.slow ? ' slow=true' : ''}`);
  if (report.primaryNextAction) lines.push(`next=${report.primaryNextAction.command ?? report.primaryNextAction.summary ?? report.primaryNextAction.id}`);
  lines.push(`authoring=${report.authoringGuidance.status}\t${report.authoringGuidance.summary}`);
  for (const step of report.steps) lines.push(`${step.status.toUpperCase()}\t${step.id}\t${step.command}`);
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function executeTaskClosePlan(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  initialReports: ClosePlanReports,
  initialSteps: TaskClosePlanStep[],
  initialIssues: TaskClosePlanIssue[],
  currentPlanHash: string,
  requestedPlanHash?: string,
  onProgress?: (event: TaskClosePlanProgressEvent) => void,
  recordReadinessEvidence = false
): TaskClosePlanReport {
  if (!requestedPlanHash) return createExecuteRefusal(taskId, actor, 'TASK_CLOSE_PLAN_PLAN_HASH_REQUIRED', 'task close --execute requires a reviewed --plan-hash from a dry-run report.', currentPlanHash, initialSteps);
  if (requestedPlanHash !== currentPlanHash) {
    return createExecuteRefusal(
      taskId,
      actor,
      'TASK_CLOSE_PLAN_PLAN_HASH_MISMATCH',
      'task close --execute refused because --plan-hash does not match the current dry-run plan.',
      currentPlanHash,
      initialSteps,
      {
        requestedPlanHash,
        currentPlanHash,
        planHashMatched: false,
        executedSteps: []
      }
    );
  }

  const executedSteps: TaskClosePlanExecutedStep[] = [];
  const initialBlocker = initialSteps.find((step) => step.status === 'blocked');
  if (initialBlocker) {
    return createClosePlanReport(
      taskId,
      actor,
      'execute',
      false,
      initialSteps,
      initialIssues,
      currentPlanHash,
      {
        requestedPlanHash,
        currentPlanHash,
        planHashMatched: true,
        executedSteps: [createExecutedStep(initialBlocker, false, initialReports[reportKeyForStep(initialBlocker.id)], 'blocked')],
        stoppedAt: initialBlocker.id
      },
      initialReports
    );
  }

  let reports = initialReports;
  let steps = initialSteps;
  let bookkeepingStep = steps.find((step) => step.id === 'bookkeeping');
  if (bookkeepingStep?.status === 'required') {
    // Verify close would succeed against a virtual post-bookkeeping snapshot
    // before writing TASK.md/Task Board Done. The
    // --auto path already runs this same preflight before ever calling this
    // function; this guard closes the gap for the reviewed --plan-hash path,
    // which otherwise wrote bookkeeping first and could discover a close/ready
    // blocker only afterward, leaving Done written without valid close proof.
    emitClosePlanProgress(onProgress, bookkeepingStep.id, 'start', 'Verifying close would succeed before writing Done.');
    const preflightBlockers = createAutoClosePlanPreflightBlockers(projectRoot, taskId, actor);
    if (preflightBlockers.length > 0) {
      const refusalReview = createClosePlanReport(
        taskId,
        actor,
        'execute-refused',
        true,
        steps,
        initialIssues,
        currentPlanHash,
        { requestedPlanHash, currentPlanHash, planHashMatched: true, executedSteps: [], stoppedAt: 'bookkeeping' },
        initialReports
      );
      emitClosePlanProgress(onProgress, bookkeepingStep.id, 'blocked', 'Close would not succeed after bookkeeping; bookkeeping was not applied.', false);
      return createAutoPreflightBlockedReport(taskId, refusalReview, preflightBlockers);
    }
    const virtualReports = createVirtualCloseReports(projectRoot, taskId, actor, reports.bookkeeping);
    const virtualReadyStep = steps.find((step) => step.id === 'ready');
    if (virtualReadyStep) {
      emitClosePlanProgress(onProgress, virtualReadyStep.id, 'start', virtualReadyStep.summary);
      const virtualReadyOk = virtualReports.ready?.ok ?? false;
      executedSteps.push(
        createExecutedStep(
          virtualReadyStep,
          virtualReadyOk,
          virtualReports.ready,
          virtualReadyOk ? 'satisfied' : 'blocked'
        )
      );
      emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
      if (!virtualReadyOk) return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'ready');
    }

    emitClosePlanProgress(onProgress, bookkeepingStep.id, 'start', bookkeepingStep.summary);
    const bookkeepingReport = executeReviewedCloseBookkeepingPlan(projectRoot, reports.bookkeeping);
    executedSteps.push(createExecutedStep(bookkeepingStep, bookkeepingReport.ok, bookkeepingReport, bookkeepingReport.ok ? 'executed' : 'blocked'));
    emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
    if (!bookkeepingReport.ok) return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'bookkeeping');
    emitClosePlanProgress(onProgress, 'refresh', 'start', 'Recomputing close plan state after bookkeeping.');
    reports = createClosePlanReports(projectRoot, taskId, actor);
    steps = createSteps(taskId, reports);
    emitClosePlanProgress(onProgress, 'refresh', 'satisfied', 'ClosePlan state refreshed after bookkeeping.', true);
  } else if (bookkeepingStep?.status === 'satisfied') {
    executedSteps.push(createExecutedStep(bookkeepingStep, true, reports.bookkeeping, 'satisfied'));
    emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
  }

  const readyStep = steps.find((step) => step.id === 'ready');
  const readyAlreadyExecuted = executedSteps.some((step) => step.id === 'ready');
  const closeAlreadyExecuted = executedSteps.some((step) => step.id === 'close');
  emitClosePlanProgress(onProgress, readyStep?.id ?? 'ready', 'start', readyStep?.summary ?? 'Checking done-level readiness.');
  if (!readyAlreadyExecuted && readyStep?.status !== 'satisfied') {
    const readyReport = reports.ready;
    executedSteps.push(createExecutedStep(readyStep ?? fallbackStep(taskId, 'ready'), readyReport?.ok ?? false, readyReport, readyReport?.ok ? 'satisfied' : 'blocked'));
    emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
    return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'ready');
  }
  if (!readyAlreadyExecuted && readyStep) {
    executedSteps.push(createExecutedStep(readyStep, true, reports.ready, 'satisfied'));
    emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
  }

  const closeStep = steps.find((step) => step.id === 'close');
  let readinessEvidence: TaskClosePlanReadinessEvidence | undefined;
  if (!closeAlreadyExecuted && closeStep?.status === 'required') {
    if (recordReadinessEvidence) {
      readinessEvidence = appendTaskClosePlanReadinessEvidence(projectRoot, taskId, actor, reports.close);
      emitClosePlanProgress(onProgress, 'refresh', 'start', 'Recomputing close plan state after readiness evidence.');
      reports = createClosePlanReports(projectRoot, taskId, actor);
      steps = createSteps(taskId, reports);
      emitClosePlanProgress(onProgress, 'refresh', 'satisfied', 'ClosePlan state refreshed after readiness evidence.', true);
    }
    emitClosePlanProgress(onProgress, closeStep.id, 'start', closeStep.summary);
    const closeReport = createTaskCloseReport(projectRoot, taskId, 'execute', { actor });
    if (closeReport.ok) executeTaskCloseEvidence(projectRoot, closeReport);
    executedSteps.push(
      createExecutedStep(
        closeStep,
        closeReport.ok,
        closeReport,
        closeReport.ok ? 'executed' : 'blocked',
        closeWriteOutcome(closeReport, closeReport.ok)
      )
    );
    emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
    if (!closeReport.ok) return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'close', readinessEvidence);
    emitClosePlanProgress(onProgress, 'refresh', 'start', 'Recomputing close plan state after close evidence.');
    reports = createClosePlanReports(projectRoot, taskId, actor);
    steps = createSteps(taskId, reports);
    emitClosePlanProgress(onProgress, 'refresh', 'satisfied', 'ClosePlan state refreshed after close evidence.', true);
  } else if (!closeAlreadyExecuted && closeStep?.status === 'satisfied') {
    executedSteps.push(createExecutedStep(closeStep, true, reports.close, 'satisfied'));
    emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
  } else if (!closeAlreadyExecuted) {
    executedSteps.push(createExecutedStep(closeStep ?? fallbackStep(taskId, 'close'), false, reports.close, 'blocked'));
    emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
    return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'close', readinessEvidence);
  }

  const auditStep = steps.find((step) => step.id === 'audit-close');
  emitClosePlanProgress(onProgress, auditStep?.id ?? 'audit-close', 'start', auditStep?.summary ?? 'Auditing close evidence.');
  const auditReport = reports.audit;
  executedSteps.push(createExecutedStep(auditStep ?? fallbackStep(taskId, 'audit-close'), auditReport?.ok ?? false, auditReport, auditReport?.ok ? 'satisfied' : 'blocked'));
  emitClosePlanStepProgress(onProgress, executedSteps[executedSteps.length - 1]!);
  return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, auditReport?.ok ? undefined : 'audit-close', readinessEvidence);
}

function appendTaskClosePlanReadinessEvidence(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  closeReport?: TaskCloseReport
): TaskClosePlanReadinessEvidence {
  if (!closeReport?.ok) return { attempted: false, reason: 'blocked' };
  const validationHash = closeReport.validation.validatedBeforeCloseEvidenceReportHash;
  const sourceHash = closeReport.validation.validatedBeforeCloseEvidenceSourceHash;
  const summary = [
    `Task closePlan done-level readiness for ${taskId} passed before close evidence append`,
    `harnessOk=${closeReport.validation.ok}`,
    `evidenceLintOk=${closeReport.evidenceLint.ok}`,
    `protocolDoctorOk=${closeReport.protocolDoctor.ok}`,
    `validationReportHash=${validationHash}`,
    `sourceHash=${sourceHash}`
  ].join('; ');
  const result: EvidenceAppendResult = appendEvidenceWithResult(projectRoot, {
    taskId,
    kind: 'command-log',
    summary,
    result: 'passed',
    category: 'validation',
    outcome: 'passed',
    visibility: 'public',
    tags: ['task-close-plan-readiness', `validation-report:${validationHash}`, `source:${sourceHash}`],
    idempotencyKey: `task-close-plan-readiness:${taskId}:${validationHash}:${sourceHash}`,
    actor
  });
  return {
    attempted: true,
    reason: 'close-required',
    id: result.evidence.schemaVersion === 'hadara.evidence.v2' ? result.evidence.id : 'evidence.jsonl',
    existing: result.existing,
    jsonlAppended: result.jsonlAppended,
    markdownAppended: result.markdownAppended,
    summary
  };
}

function emitClosePlanProgress(
  onProgress: ((event: TaskClosePlanProgressEvent) => void) | undefined,
  step: TaskClosePlanProgressEvent['step'],
  phase: TaskClosePlanProgressEvent['phase'],
  summary: string,
  ok?: boolean,
  details: Omit<Partial<TaskClosePlanProgressEvent>, 'step' | 'phase' | 'summary' | 'ok'> = {}
): void {
  onProgress?.({ step, phase, summary, ...(ok === undefined ? {} : { ok }), ...details });
}

function createPostExecutionReport(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  requestedPlanHash: string,
  reviewedPlanHash: string,
  executedSteps: TaskClosePlanExecutedStep[],
  stoppedAt?: TaskClosePlanStepId,
  readinessEvidence?: TaskClosePlanReadinessEvidence
): TaskClosePlanReport {
  const reports = createClosePlanReports(projectRoot, taskId, actor);
  const steps = createSteps(taskId, reports);
  const issues = collectIssues(taskId, reports);
  const nextAction = createPrimaryNextAction(taskId, steps, issues, reviewedPlanHash);
  const finalAudit = reports.audit?.auditVerdict.verdict === 'closed-valid';
  const authoringGuidance = createTaskAuthoringGuidance(projectRoot, taskId);
  const state = deriveClosePlanState(steps, issues, reports);
  const blockingIssues = closePlanBlockingIssues(issues);
  const deferredChecks = deferredChecksForPlan(steps);
  const execution: TaskClosePlanExecution = {
    requestedPlanHash,
    currentPlanHash: reviewedPlanHash,
    planHashMatched: true,
    executedSteps,
    ...(stoppedAt ? { stoppedAt } : {})
  };
  return {
    schemaVersion: 'hadara.task.close_plan.v1',
    command: 'task.close-plan',
    ok: finalAudit && blockingIssues.length === 0 && steps.every((step) => step.status === 'satisfied'),
    state,
    planStatus: derivePlanStatus(state, steps),
    blockingIssues,
    deferredChecks,
    partialExecutionRisk: deferredChecks.length > 0,
    pendingWrites: pendingWrites(steps),
    readOnly: false,
    mode: 'execute',
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    planHash: reviewedPlanHash,
    summary: summarizeSteps(steps, reports),
    steps,
    execution,
    ...(readinessEvidence ? { readinessEvidence } : {}),
    authoringGuidance,
    ...(nextAction ? { primaryNextAction: nextAction } : {}),
    nextActions: nextAction ? [nextAction] : [],
    issues
  };
}

function createClosePlanReport(
  taskId: string,
  actor: HadaraActorContext,
  mode: TaskClosePlanMode,
  readOnly: boolean,
  steps: TaskClosePlanStep[],
  issues: TaskClosePlanIssue[],
  planHash?: string,
  execution?: TaskClosePlanExecution,
  reports?: ClosePlanReports
): TaskClosePlanReport {
  const nextAction = createPrimaryNextAction(taskId, steps, issues, planHash);
  const projectRoot = reports?.bookkeeping.projectRoot ?? '';
  const authoringGuidance: TaskAuthoringGuidance = projectRoot ? createTaskAuthoringGuidance(projectRoot, taskId) : missingTaskAuthoringGuidance();
  const state = deriveClosePlanState(steps, issues, reports);
  const blockingIssues = closePlanBlockingIssues(issues);
  const blocked = mode === 'dry-run' && (state === 'blocked' || blockingIssues.length > 0);
  const deferredChecks = blocked ? [] : deferredChecksForPlan(steps);
  const pendingWriteList = blocked ? [] : pendingWrites(steps);
  const allIssues = [...issues, ...deferredCheckIssues(deferredChecks)];
  return {
    schemaVersion: 'hadara.task.close_plan.v1',
    command: 'task.close-plan',
    ok: mode === 'execute' ? false : state === 'closed-valid' || state === 'ready-to-close' || (state === 'closed-stale' && pendingWrites(steps).length > 0),
    state,
    planStatus: derivePlanStatus(state, steps),
    blockingIssues,
    deferredChecks,
    partialExecutionRisk: deferredChecks.length > 0,
    pendingWrites: pendingWriteList,
    readOnly,
    mode,
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    ...(planHash ? { planHash } : {}),
    summary: summarizeSteps(steps, reports),
    steps,
    ...(execution ? { execution } : {}),
    authoringGuidance,
    ...(nextAction ? { primaryNextAction: nextAction } : {}),
    nextActions: nextAction ? [nextAction] : [],
    issues: allIssues
  };
}

function missingTaskAuthoringGuidance(): TaskAuthoringGuidance {
  return {
    readOnly: true,
    writesProse: false,
    status: 'task-missing',
    summary: 'Task Capsule was not found; no task-owned prose can be inspected.',
    items: []
  };
}

function createExecuteRefusal(
  taskId: string,
  actor: HadaraActorContext,
  code: string,
  message: string,
  currentPlanHash: string,
  steps: TaskClosePlanStep[],
  execution?: TaskClosePlanExecution
): TaskClosePlanReport {
  return {
    ...createClosePlanReport(taskId, actor, 'execute-refused', true, steps, [{ severity: 'error', code, message }], currentPlanHash, execution),
    ok: false
  };
}

function createClosePlanReports(projectRoot: string, taskId: string, actor: HadaraActorContext): ClosePlanReports {
  const bookkeeping = createCloseBookkeepingReport(projectRoot, taskId, 'dry-run', { actor });
  const bookkeepingStatus = getBookkeepingStatus(bookkeeping);
  if (bookkeepingStatus === 'blocked') return { bookkeeping };
  if (bookkeepingStatus === 'required' && bookkeeping.status.taskStatus !== 'Done') {
    return { bookkeeping, ...createVirtualCloseReports(projectRoot, taskId, actor, bookkeeping) };
  }

  const close = createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor });
  const ready = createCloseReadinessReport(taskId, close);
  if (!ready.ok) return { bookkeeping, ready, close };

  const audit = createTaskAuditCloseReport(projectRoot, taskId, { actor, closePlan: close });
  return { bookkeeping, ready, close, audit };
}

function createVirtualCloseReports(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  bookkeepingPlan: CloseBookkeepingReport
): VirtualCloseReports {
  const tempRoot = createVirtualBookkeptProjectRoot(projectRoot, taskId, bookkeepingPlan);
  try {
    const close = createTaskCloseReport(tempRoot, taskId, 'dry-run', { actor });
    const ready = createCloseReadinessReport(taskId, close);
    const audit = ready.ok ? createTaskAuditCloseReport(tempRoot, taskId, { actor, closePlan: close }) : undefined;
    return { ready, close, audit };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function createCloseReadinessReport(taskId: string, closePlan: TaskCloseReport): CloseReadinessReport {
  const ready = closePlan.ok;
  const nextActions: TaskCloseNextAction[] = ready
    ? [
        createTaskLifecycleNextAction({
          id: 'run-task-close',
          required: false,
          command: `hadara task close --task ${taskId} --dry-run --json`,
          message: 'Review the task close plan before appending close evidence when explicit review is required.',
          writeBoundary: 'read-only',
          recommendedActorRole: 'worker',
          requiresBeforeHash: false,
          stalePlanRisk: 'none'
        })
      ]
    : closePlan.nextActions.filter((action) => action.id !== 'append-close-evidence');
  const primaryNextAction = selectPrimaryNextAction(nextActions);
  return {
    ok: ready,
    summary: {
      ready,
      blockers: closePlan.issues.filter((issue) => issue.severity === 'error').length,
      warnings: closePlan.issues.filter((issue) => issue.severity === 'warning').length
    },
    checks: {
      validation: closePlan.validation.ok,
      evidence: closePlan.evidenceLint.ok,
      protocol: closePlan.protocolDoctor.ok
    },
    nextActions,
    ...(primaryNextAction ? { primaryNextAction } : {}),
    issues: closePlan.issues
  };
}

function createSteps(taskId: string, reports: ClosePlanReports): TaskClosePlanStep[] {
  const bookkeepingStatus = getBookkeepingStatus(reports.bookkeeping);
  const readyStatus = bookkeepingStatus === 'satisfied' ? (reports.ready ? (reports.ready.ok ? 'satisfied' : 'required') : 'pending') : 'pending';
  const auditVerdict = reports.audit?.auditVerdict.verdict;
  const closeEvidenceIsCurrent = auditVerdict === 'closed-valid';
  const closeRepairNeeded = reports.audit?.auditVerdict.closeEvidenceFound === true && !closeEvidenceIsCurrent;
  const closeStatus =
    readyStatus === 'satisfied'
      ? closeEvidenceIsCurrent
        ? 'satisfied'
        : reports.close?.ok
          ? 'required'
          : 'blocked'
      : 'pending';
  const auditStatus = closeEvidenceIsCurrent ? 'satisfied' : closeStatus === 'required' ? 'pending' : reports.audit ? (reports.audit.auditVerdict.closeEvidenceFound ? 'required' : 'pending') : 'pending';
  return [
    {
      id: 'bookkeeping',
      status: bookkeepingStatus,
      summary: bookkeepingStatus === 'required' ? 'Apply bounded close bookkeeping.' : bookkeepingStatus === 'satisfied' ? 'Close bookkeeping is current.' : 'Bookkeeping blockers must be resolved.',
      command: bookkeepingStatus === 'required' ? `hadara task close --task ${taskId} --execute --auto --json` : `hadara task status --task ${taskId} --detail full --json`,
      mode: bookkeepingStatus === 'required' ? 'execute' : 'dry-run',
      writeBoundary: bookkeepingStatus === 'required' ? 'task-local' : 'read-only',
      expectedWritePaths: reports.bookkeeping.writes.map((write) => write.path),
      alreadySatisfied: bookkeepingStatus === 'satisfied',
      sourceReport: 'hadara.task.close_bookkeeping.v1'
    },
    {
      id: 'ready',
      status: readyStatus,
      summary: readyStatus === 'satisfied' ? 'Done-level readiness passed.' : readyStatus === 'pending' ? 'Ready waits for bookkeeping.' : 'Run readiness and resolve blockers.',
      command: `hadara task status --task ${taskId} --detail full --json`,
      mode: 'read-only',
      writeBoundary: 'read-only',
      expectedWritePaths: [],
      alreadySatisfied: readyStatus === 'satisfied',
      sourceReport: 'close-readiness'
    },
    {
      id: 'close',
      status: closeStatus,
      summary: closeStatus === 'required' ? (closeRepairNeeded ? 'Append fresh close evidence through closePlan repair.' : 'Append close evidence through closePlan execute.') : closeStatus === 'satisfied' ? 'Current close evidence is valid.' : closeStatus === 'pending' ? 'Close waits for readiness.' : 'Close preconditions have blockers.',
      command: closeStatus === 'required' ? `hadara task close --task ${taskId} --execute --auto --json` : `hadara task close --task ${taskId} --json`,
      mode: closeStatus === 'required' ? 'execute' : 'dry-run',
      writeBoundary: closeStatus === 'required' ? 'evidence-append' : 'read-only',
      expectedWritePaths: closeStatus === 'required' && reports.bookkeeping.task ? [`${reports.bookkeeping.task.capsule}/evidence.jsonl`] : [],
      alreadySatisfied: closeStatus === 'satisfied',
      sourceReport: 'hadara.task.close.v1'
    },
    {
      id: 'audit-close',
      status: auditStatus,
      summary:
        auditStatus === 'satisfied'
          ? 'Close audit passed.'
          : auditStatus === 'pending'
            ? 'Audit waits for close evidence.'
            : reports.audit?.auditVerdict.verdict === 'closed-with-drift-warnings'
              ? 'Audit waits for closePlan repair to append fresh close proof.'
              : 'Audit waits for close proof to be current.',
      command: `hadara task close --task ${taskId} --json`,
      mode: 'read-only',
      writeBoundary: 'read-only',
      expectedWritePaths: [],
      alreadySatisfied: auditStatus === 'satisfied',
      sourceReport: 'hadara.task.audit_close.v1'
    }
  ];
}

function collectIssues(taskId: string, reports: ClosePlanReports): TaskClosePlanIssue[] {
  const seen = new Set<string>();
  const issues: TaskClosePlanIssue[] = [];
  const reportIssues = [...reports.bookkeeping.issues, ...(reports.ready?.issues ?? []), ...(reports.close?.issues ?? []), ...(reports.audit?.issues ?? [])];
  for (const issue of reportIssues) {
    const key = `${issue.severity}:${issue.code}:${issue.path ?? ''}:${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const severity = issue.code === 'TASK_CLOSE_EVIDENCE_MISSING' && reports.ready?.ok && reports.close?.ok ? 'info' : issue.severity;
    issues.push({
      severity,
      code: issue.code,
      message: issue.message,
      ...(issue.path ? { path: issue.path } : {}),
      ...('fixHint' in issue && issue.fixHint ? { fixHint: issue.fixHint } : {}),
      ...('example' in issue && issue.example ? { example: issue.example } : {})
    });
  }
  const evidenceQualityIssue = issues.find(isEvidenceQualityIssue);
  if (evidenceQualityIssue) {
    issues.push({
      severity: 'info',
      code: 'TASK_CLOSE_PLAN_EVIDENCE_QUALITY_HINT',
      message: 'Done-level evidence is missing substantive passed proof. Record validation evidence with --result passed and --category validation after a meaningful check succeeds.',
      path: evidenceQualityIssue.path,
      fixHint: 'Use evidence add-command with an explicit passed result/category for real validation output; do not rewrite existing unknown/failed evidence.',
      example: 'hadara evidence add-command --task T-XXXX --summary "Focused validation passed." --result passed --category validation --json'
    });
  }
  if (issues.some(isCloseDriftIssue)) {
    issues.push({
      severity: 'info',
      code: 'TASK_CLOSE_PLAN_CLOSE_SOURCE_DRIFT_GUIDANCE',
      message: 'Close-source files changed after the recorded close proof. Bookkeeping intended edits, review a fresh close dry-run, then execute closePlan with its current plan hash to append fresh close proof.',
      fixHint: 'Use close dry-run as the repair plan; do not run low-level close or audit commands in the ordinary worker loop.',
      example: `hadara task close --task ${taskId} --json`
    });
  }
  return issues;
}

function deriveClosePlanState(steps: TaskClosePlanStep[], issues: TaskClosePlanIssue[], reports?: ClosePlanReports): TaskClosePlanReport['state'] {
  if (closePlanBlockingIssues(issues).length > 0 || steps.some((step) => step.status === 'blocked')) return 'blocked';
  if (reports?.audit?.auditVerdict.verdict === 'closed-valid' && steps.every((step) => step.status === 'satisfied')) return 'closed-valid';
  if (reports?.audit?.auditVerdict.closeEvidenceFound && reports.audit.auditVerdict.verdict !== 'closed-valid') return 'closed-stale';
  const close = steps.find((step) => step.id === 'close');
  const ready = steps.find((step) => step.id === 'ready');
  const bookkeeping = steps.find((step) => step.id === 'bookkeeping');
  if (bookkeeping?.status === 'satisfied' && ready?.status === 'satisfied' && close?.status === 'required') return 'ready-to-close';
  return 'in-progress';
}

function derivePlanStatus(state: TaskClosePlanReport['state'], steps: TaskClosePlanStep[]): TaskClosePlanReport['planStatus'] {
  if (state === 'blocked') return 'blocked';
  if (deferredChecksForPlan(steps).length > 0) return 'executable-with-deferred-checks';
  if (state === 'ready-to-close') return 'executable';
  if (state === 'closed-stale') return steps.some((step) => step.status === 'required') ? 'executable' : 'pending';
  if (state === 'closed-valid') return 'satisfied';
  return steps.some((step) => step.status === 'required') ? 'executable' : 'pending';
}

function deferredChecksForPlan(steps: TaskClosePlanStep[]): TaskClosePlanStepId[] {
  const firstRequiredWriteIndex = steps.findIndex((step) => step.status === 'required' && step.writeBoundary !== 'read-only');
  if (firstRequiredWriteIndex < 0) return [];
  return steps
    .slice(firstRequiredWriteIndex + 1)
    .filter((step) => step.status === 'pending' || step.status === 'required')
    .map((step) => step.id);
}

function deferredCheckIssues(deferredChecks: TaskClosePlanStepId[]): TaskClosePlanIssue[] {
  if (deferredChecks.length === 0) return [];
  return [
    {
      severity: 'info',
      code: 'TASK_CLOSE_PLAN_DEFERRED_CHECKS',
      message: `ClosePlan execute will re-evaluate ${deferredChecks.join(', ')} after the planned write step. Execution can stop after partial writes if those checks find blockers.`,
      fixHint: 'Review deferredChecks and partialExecutionRisk before running close --execute; rerun close dry-run after resolving any post-write blockers.',
      example: 'hadara task close --task T-XXXX --json'
    }
  ];
}

function closePlanBlockingIssues(issues: TaskClosePlanIssue[]): TaskClosePlanIssue[] {
  return issues.filter((issue) => issue.severity === 'error' && issue.code !== 'TASK_CLOSE_EVIDENCE_MISSING');
}

function pendingWrites(steps: TaskClosePlanStep[]): TaskClosePlanReport['pendingWrites'] {
  return steps
    .filter((step) => step.status === 'required' && step.writeBoundary !== 'read-only')
    .map((step) => ({
      step: step.id,
      writeBoundary: step.writeBoundary,
      paths: step.expectedWritePaths
    }));
}

function createPrimaryNextAction(taskId: string, steps: TaskClosePlanStep[], issues: TaskClosePlanIssue[], planHash?: string): HadaraNextAction | undefined {
  const nextStep = steps.find((step) => step.status === 'required' || step.status === 'blocked');
  if (!nextStep) return undefined;
  if (nextStep.id === 'ready' && issues.some(isEvidenceQualityIssue)) {
    return createTaskLifecycleNextAction({
      id: 'closePlan-record-passed-evidence',
      kind: 'command',
      required: true,
      command: `hadara evidence add-command --task ${taskId} --summary "Focused validation passed." --result passed --category validation --json`,
      message: 'Record substantive passed validation evidence before rerunning readiness.',
      writeBoundary: 'evidence-append',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'low'
    });
  }
  if (nextStep.status === 'required' && nextStep.writeBoundary !== 'read-only') {
    const closeRepair = nextStep.id === 'close' && issues.some(isCloseDriftIssue);
    return createTaskLifecycleNextAction({
      id: closeRepair ? 'closePlan-repair-close-proof' : 'closePlan-execute-reviewed-plan',
      kind: 'command',
      required: true,
      command: `hadara task close --task ${taskId} --execute --auto --json`,
      message: closeRepair
        ? 'Close-source drift was detected. After confirming all close-source edits are complete, execute the reviewed closePlan plan to append fresh close proof and audit it.'
        : nextActionMessage(nextStep, steps),
      writeBoundary: nextStep.writeBoundary,
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'low'
    });
  }
  return createTaskLifecycleNextAction({
    id: `closePlan-${nextStep.id}`,
    kind: nextStep.status === 'blocked' ? 'review' : 'command',
    required: true,
    command: nextStep.status === 'blocked' ? undefined : nextStep.command,
    message: nextActionMessage(nextStep, steps),
    writeBoundary: nextStep.writeBoundary,
    recommendedActorRole: nextStep.writeBoundary === 'read-only' ? 'reviewer' : 'worker',
    requiresBeforeHash: false,
    stalePlanRisk: nextStep.writeBoundary === 'read-only' ? 'none' : 'low'
  });
}

function nextActionMessage(nextStep: TaskClosePlanStep, steps: TaskClosePlanStep[]): string {
  const deferredChecks = deferredChecksForPlan(steps);
  if (nextStep.status !== 'blocked' && nextStep.writeBoundary !== 'read-only' && deferredChecks.length > 0) {
    return `${nextStep.summary} Then closePlan will re-evaluate ${deferredChecks.join(', ')} and may stop if blockers appear.`;
  }
  return nextStep.summary;
}

function isCloseDriftIssue(issue: TaskClosePlanIssue): boolean {
  return issue.code === 'TASK_CLOSE_AUDIT_SOURCE_HASH_DRIFT' || issue.code === 'TASK_CLOSE_AUDIT_CURRENT_REPORT_HASH_DRIFT';
}

function summarizeSteps(steps: TaskClosePlanStep[], reports?: ClosePlanReports): TaskClosePlanReport['summary'] {
  const evaluatedReports = evaluatedReportNames(steps, reports);
  const skippedReports = ['bookkeeping', 'ready', 'close', 'audit-close'].filter((name) => !evaluatedReports.includes(name));
  const deferredChecks = deferredChecksForPlan(steps);
  return {
    steps: steps.length,
    required: steps.filter((step) => step.status === 'required').length,
    blocked: steps.filter((step) => step.status === 'blocked').length,
    satisfied: steps.filter((step) => step.status === 'satisfied').length,
    executeSupported: true,
    ...(deferredChecks.length > 0 ? { deferredChecks, partialExecutionRisk: true } : {}),
    evaluatedReports,
    skippedReports
  };
}

function createExecutedStep(
  step: TaskClosePlanStep,
  ok: boolean,
  report: unknown,
  status: TaskClosePlanExecutedStep['status'],
  writeOutcome?: TaskClosePlanExecutedStep['writeOutcome']
): TaskClosePlanExecutedStep {
  return {
    id: step.id,
    status,
    command: step.command,
    ok,
    reportHash: hashReport(report),
    summary: step.summary,
    writeBoundary: step.writeBoundary,
    ...(writeOutcome ? { writeOutcome } : {})
  };
}

export function didClosePlanExecutedStepMutate(step: TaskClosePlanExecutedStep): boolean {
  return step.status === 'executed' && step.writeBoundary !== 'read-only' && step.writeOutcome !== 'existing-noop';
}

function emitClosePlanStepProgress(
  onProgress: ((event: TaskClosePlanProgressEvent) => void) | undefined,
  executedStep: TaskClosePlanExecutedStep
): void {
  if (executedStep.status === 'skipped') return;
  emitClosePlanProgress(onProgress, executedStep.id, executedStep.status, executedStep.summary, executedStep.ok, {
    writeBoundary: executedStep.writeBoundary,
    ...(executedStep.writeOutcome ? { writeOutcome: executedStep.writeOutcome } : {}),
    mutated: didClosePlanExecutedStepMutate(executedStep)
  });
}

function closeWriteOutcome(closeReport: TaskCloseReport | undefined, ok: boolean): TaskClosePlanExecutedStep['writeOutcome'] {
  if (!ok) return 'blocked';
  return closeReport?.closeEvidence.appended ? 'appended' : 'existing-noop';
}

function hashReport(report: unknown): string {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(report) ?? 'null').digest('hex')}`;
}

function reportKeyForStep(stepId: TaskClosePlanStepId): keyof ClosePlanReports {
  if (stepId === 'bookkeeping') return 'bookkeeping';
  if (stepId === 'ready') return 'ready';
  if (stepId === 'close') return 'close';
  return 'audit';
}

function getBookkeepingStatus(bookkeeping: CloseBookkeepingReport): TaskClosePlanStepStatus {
  return bookkeeping.ok ? (bookkeeping.summary.plannedWrites > 0 ? 'required' : 'satisfied') : 'blocked';
}

function evaluatedReportNames(steps: TaskClosePlanStep[], reports?: ClosePlanReports): string[] {
  if (reports) return ['bookkeeping', ...(reports.ready ? ['ready'] : []), ...(reports.close ? ['close'] : []), ...(reports.audit ? ['audit-close'] : [])];
  const evaluated = new Set<string>(['bookkeeping']);
  for (const step of steps) {
    if (step.id === 'ready' && step.status !== 'pending') evaluated.add('ready');
    if (step.id === 'close' && step.status !== 'pending') evaluated.add('close');
    if (step.id === 'audit-close' && step.status !== 'pending') evaluated.add('audit-close');
  }
  return [...evaluated];
}

function isEvidenceQualityIssue(issue: TaskClosePlanIssue): boolean {
  return (
    issue.code.includes('TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE') ||
    issue.code.includes('TASK_DONE_WITH_ONLY_WEAK_EVIDENCE') ||
    issue.code.includes('EVIDENCE_REQUIRED') ||
    issue.code.includes('WITHOUT_SUBSTANTIVE_EVIDENCE') ||
    issue.code.includes('ONLY_WEAK_EVIDENCE')
  );
}

function fallbackStep(taskId: string, id: TaskClosePlanStepId): TaskClosePlanStep {
  return {
    id,
    status: 'unknown',
    summary: 'Step state could not be determined.',
    command: id === 'bookkeeping' || id === 'close' ? `hadara task close --task ${taskId} --execute --auto --json` : `hadara task status --task ${taskId} --detail full --json`,
    mode: 'read-only',
    writeBoundary: 'read-only',
    expectedWritePaths: [],
    alreadySatisfied: false,
    sourceReport: 'unknown'
  };
}

function hashPlan(taskId: string, steps: TaskClosePlanStep[], reports?: ClosePlanReports): string {
  const stable = {
    taskId,
    steps: steps.map((step) => ({
      id: step.id,
      status: step.status,
      command: step.command,
      mode: step.mode,
      writeBoundary: step.writeBoundary,
      expectedWritePaths: step.expectedWritePaths,
      alreadySatisfied: step.alreadySatisfied,
      sourceReport: step.sourceReport
    })),
    reports: reports
      ? {
          bookkeeping: stableBookkeepingPlanFingerprint(reports.bookkeeping),
          ready: reports.ready ? stableReportFingerprint(reports.ready) : null,
          close: reports.close ? stableReportFingerprint(reports.close) : null,
          audit: reports.audit ? stableReportFingerprint(reports.audit) : null
        }
      : undefined
  };
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(stable)).digest('hex')}`;
}

function stableBookkeepingPlanFingerprint(report: CloseBookkeepingReport): string {
  return hashReport({
    schemaVersion: report.schemaVersion,
    command: report.command,
    ok: report.ok,
    taskId: report.taskId,
    task: report.task,
    status: report.status,
    summary: {
      plannedWrites: report.summary.plannedWrites,
      advisoryOnly: report.summary.advisoryOnly,
      stateDocsPending: report.summary.stateDocsPending
    },
    writes: report.writes.map((write) => ({
      path: write.path,
      action: write.action,
      field: write.field,
      before: write.before,
      expectedBeforeExists: write.expectedBeforeExists,
      expectedBeforeHash: write.expectedBeforeHash
    })),
    advisories: report.advisories,
    stateDocs: report.stateDocs,
    issues: report.issues
  });
}

function stableReportFingerprint(report: unknown): string {
  return hashReport(stripVolatilePlanFields(report));
}

function stripVolatilePlanFields(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((entry) => stripVolatilePlanFields(entry));
  if (!value || typeof value !== 'object') return value;
  const output: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (
      key === 'generatedAt'
      || key === 'diagnostics'
      || key === 'execution'
      || key === 'planHash'
      || key === 'projectRoot'
      || key.endsWith('SourceHash')
      || key.endsWith('ReportHash')
    ) continue;
    output[key] = stripVolatilePlanFields(entry);
  }
  return output;
}
