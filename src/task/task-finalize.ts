import crypto from 'node:crypto';
import type { HadaraActorContext } from '../core/actor-context';
import type { HadaraNextAction } from '../core/next-action';
import { createTaskAuditCloseReport, createTaskCloseReport, executeTaskCloseEvidence, TaskAuditCloseReport, TaskCloseReport } from './task-close';
import { createTaskFinishReport, TaskFinishReport } from './task-finish';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor } from './lifecycle-next-actions';
import { createTaskReadyReportFromClosePlan, TaskReadyReport } from './task-ready';
import { createTaskAuthoringGuidance, TaskAuthoringGuidance } from './authoring-guidance';

export type TaskFinalizeMode = 'dry-run' | 'execute' | 'execute-refused';
export type TaskFinalizeStepId = 'finish' | 'ready' | 'close' | 'audit-close';
export type TaskFinalizeStepStatus = 'satisfied' | 'required' | 'blocked' | 'pending' | 'unknown';

export interface TaskFinalizeReport {
  schemaVersion: 'hadara.task.finalize.v1';
  command: 'task.finalize';
  ok: boolean;
  state: 'blocked' | 'ready-to-close' | 'closed-valid' | 'closed-stale' | 'in-progress';
  planStatus: 'blocked' | 'executable' | 'satisfied' | 'pending';
  blockingIssues: TaskFinalizeIssue[];
  pendingWrites: Array<{
    step: TaskFinalizeStepId;
    writeBoundary: TaskFinalizeStep['writeBoundary'];
    paths: string[];
  }>;
  readOnly: boolean;
  mode: TaskFinalizeMode;
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
    evaluatedReports?: string[];
    skippedReports?: string[];
  };
  steps: TaskFinalizeStep[];
  execution?: TaskFinalizeExecution;
  authoringGuidance: TaskAuthoringGuidance;
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  issues: TaskFinalizeIssue[];
}

export interface TaskFinalizeStep {
  id: TaskFinalizeStepId;
  status: TaskFinalizeStepStatus;
  summary: string;
  command: string;
  mode: 'dry-run' | 'execute' | 'read-only';
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
  expectedWritePaths: string[];
  alreadySatisfied: boolean;
  sourceReport: string;
}

export interface TaskFinalizeIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
  fixHint?: string;
  example?: string;
}

export interface TaskFinalizeExecution {
  requestedPlanHash?: string;
  currentPlanHash?: string;
  planHashMatched: boolean;
  executedSteps: TaskFinalizeExecutedStep[];
  stoppedAt?: TaskFinalizeStepId;
}

export interface TaskFinalizeExecutedStep {
  id: TaskFinalizeStepId;
  status: 'executed' | 'satisfied' | 'blocked' | 'skipped';
  command: string;
  ok: boolean;
  reportHash: string;
  summary: string;
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
}

export interface TaskFinalizeOptions {
  executeRequested?: boolean;
  planHash?: string;
  actor?: HadaraActorContext;
}

interface FinalizeReports {
  finish: TaskFinishReport;
  ready?: TaskReadyReport;
  close?: TaskCloseReport;
  audit?: TaskAuditCloseReport;
}

export function createTaskFinalizeReport(projectRoot: string, taskId: string, options: TaskFinalizeOptions = {}): TaskFinalizeReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const reports = createFinalizeReports(projectRoot, taskId, actor);
  const steps = createSteps(taskId, reports);
  const issues = collectIssues(taskId, reports);
  const planHash = hashPlan(taskId, steps);
  if (options.executeRequested) return executeFinalizePlan(projectRoot, taskId, actor, reports, steps, issues, planHash, options.planHash);
  return createFinalizeReport(taskId, actor, 'dry-run', true, steps, issues, planHash, undefined, reports);
}

export function formatTaskFinalizeReport(report: TaskFinalizeReport): string {
  const lines = [`[HADARA] task finalize ${report.taskId}: ${report.mode}`];
  lines.push(`readOnly=${report.readOnly} ok=${report.ok} planHash=${report.planHash ?? 'none'}`);
  if (report.diagnostics) lines.push(`durationMs=${report.diagnostics.durationMs}${report.diagnostics.slow ? ' slow=true' : ''}`);
  if (report.primaryNextAction) lines.push(`next=${report.primaryNextAction.command ?? report.primaryNextAction.summary ?? report.primaryNextAction.id}`);
  lines.push(`authoring=${report.authoringGuidance.status}\t${report.authoringGuidance.summary}`);
  for (const step of report.steps) lines.push(`${step.status.toUpperCase()}\t${step.id}\t${step.command}`);
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function executeFinalizePlan(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  initialReports: FinalizeReports,
  initialSteps: TaskFinalizeStep[],
  initialIssues: TaskFinalizeIssue[],
  currentPlanHash: string,
  requestedPlanHash?: string
): TaskFinalizeReport {
  if (!requestedPlanHash) return createExecuteRefusal(taskId, actor, 'TASK_FINALIZE_PLAN_HASH_REQUIRED', 'task finalize --execute requires a reviewed --plan-hash from a dry-run report.', currentPlanHash, initialSteps);
  if (requestedPlanHash !== currentPlanHash) {
    return createExecuteRefusal(
      taskId,
      actor,
      'TASK_FINALIZE_PLAN_HASH_MISMATCH',
      'task finalize --execute refused because --plan-hash does not match the current dry-run plan.',
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

  const executedSteps: TaskFinalizeExecutedStep[] = [];
  const initialBlocker = initialSteps.find((step) => step.status === 'blocked');
  if (initialBlocker) {
    return createFinalizeReport(
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
  let finishStep = steps.find((step) => step.id === 'finish');
  if (finishStep?.status === 'required') {
    const finishReport = createTaskFinishReport(projectRoot, taskId, 'execute', { actor });
    executedSteps.push(createExecutedStep(finishStep, finishReport.ok, finishReport, finishReport.ok ? 'executed' : 'blocked'));
    if (!finishReport.ok) return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'finish');
    reports = createFinalizeReports(projectRoot, taskId, actor);
    steps = createSteps(taskId, reports);
  } else if (finishStep?.status === 'satisfied') {
    executedSteps.push(createExecutedStep(finishStep, true, reports.finish, 'satisfied'));
  }

  const readyStep = steps.find((step) => step.id === 'ready');
  if (readyStep?.status !== 'satisfied') {
    const readyReport = reports.ready;
    executedSteps.push(createExecutedStep(readyStep ?? fallbackStep(taskId, 'ready'), readyReport?.ok ?? false, readyReport, readyReport?.ok ? 'satisfied' : 'blocked'));
    return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'ready');
  }
  executedSteps.push(createExecutedStep(readyStep, true, reports.ready, 'satisfied'));

  const closeStep = steps.find((step) => step.id === 'close');
  if (closeStep?.status === 'required') {
    const closeReport = createTaskCloseReport(projectRoot, taskId, 'execute', { actor });
    if (closeReport.ok) executeTaskCloseEvidence(projectRoot, closeReport);
    executedSteps.push(createExecutedStep(closeStep, closeReport.ok, closeReport, closeReport.ok ? 'executed' : 'blocked'));
    if (!closeReport.ok) return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'close');
    reports = createFinalizeReports(projectRoot, taskId, actor);
    steps = createSteps(taskId, reports);
  } else if (closeStep?.status === 'satisfied') {
    executedSteps.push(createExecutedStep(closeStep, true, reports.close, 'satisfied'));
  } else {
    executedSteps.push(createExecutedStep(closeStep ?? fallbackStep(taskId, 'close'), false, reports.close, 'blocked'));
    return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'close');
  }

  const auditStep = steps.find((step) => step.id === 'audit-close');
  const auditReport = reports.audit;
  executedSteps.push(createExecutedStep(auditStep ?? fallbackStep(taskId, 'audit-close'), auditReport?.ok ?? false, auditReport, auditReport?.ok ? 'satisfied' : 'blocked'));
  return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, auditReport?.ok ? undefined : 'audit-close');
}

function createPostExecutionReport(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  requestedPlanHash: string,
  reviewedPlanHash: string,
  executedSteps: TaskFinalizeExecutedStep[],
  stoppedAt?: TaskFinalizeStepId
): TaskFinalizeReport {
  const reports = createFinalizeReports(projectRoot, taskId, actor);
  const steps = createSteps(taskId, reports);
  const issues = collectIssues(taskId, reports);
  const nextAction = createPrimaryNextAction(taskId, steps, issues);
  const finalAudit = reports.audit?.auditVerdict.verdict === 'closed-valid';
  const authoringGuidance = createTaskAuthoringGuidance(projectRoot, taskId);
  const state = deriveFinalizeState(steps, issues, reports);
  const blockingIssues = finalizeBlockingIssues(issues);
  const execution: TaskFinalizeExecution = {
    requestedPlanHash,
    currentPlanHash: reviewedPlanHash,
    planHashMatched: true,
    executedSteps,
    ...(stoppedAt ? { stoppedAt } : {})
  };
  return {
    schemaVersion: 'hadara.task.finalize.v1',
    command: 'task.finalize',
    ok: finalAudit && blockingIssues.length === 0 && steps.every((step) => step.status === 'satisfied'),
    state,
    planStatus: derivePlanStatus(state, steps),
    blockingIssues,
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
    authoringGuidance,
    ...(nextAction ? { primaryNextAction: nextAction } : {}),
    nextActions: nextAction ? [nextAction] : [],
    issues
  };
}

function createFinalizeReport(
  taskId: string,
  actor: HadaraActorContext,
  mode: TaskFinalizeMode,
  readOnly: boolean,
  steps: TaskFinalizeStep[],
  issues: TaskFinalizeIssue[],
  planHash?: string,
  execution?: TaskFinalizeExecution,
  reports?: FinalizeReports
): TaskFinalizeReport {
  const nextAction = createPrimaryNextAction(taskId, steps, issues);
  const projectRoot = reports?.finish.projectRoot ?? '';
  const authoringGuidance: TaskAuthoringGuidance = projectRoot ? createTaskAuthoringGuidance(projectRoot, taskId) : missingTaskAuthoringGuidance();
  const state = deriveFinalizeState(steps, issues, reports);
  const blockingIssues = finalizeBlockingIssues(issues);
  return {
    schemaVersion: 'hadara.task.finalize.v1',
    command: 'task.finalize',
    ok: mode === 'execute' ? false : state === 'closed-valid' || state === 'ready-to-close',
    state,
    planStatus: derivePlanStatus(state, steps),
    blockingIssues,
    pendingWrites: pendingWrites(steps),
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
    issues
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
  steps: TaskFinalizeStep[],
  execution?: TaskFinalizeExecution
): TaskFinalizeReport {
  return {
    ...createFinalizeReport(taskId, actor, 'execute-refused', true, steps, [{ severity: 'error', code, message }], currentPlanHash, execution),
    ok: false
  };
}

function createFinalizeReports(projectRoot: string, taskId: string, actor: HadaraActorContext): FinalizeReports {
  const finish = createTaskFinishReport(projectRoot, taskId, 'dry-run', { actor });
  const finishStatus = getFinishStatus(finish);
  if (finishStatus === 'blocked') return { finish };
  if (finishStatus === 'required' && finish.status.taskStatus !== 'Done') return { finish };

  const close = createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor });
  const ready = createTaskReadyReportFromClosePlan(projectRoot, taskId, 'done', close, actor);
  if (!ready.ok) return { finish, ready, close };

  const audit = createTaskAuditCloseReport(projectRoot, taskId, { actor });
  return { finish, ready, close, audit };
}

function createSteps(taskId: string, reports: FinalizeReports): TaskFinalizeStep[] {
  const finishStatus = getFinishStatus(reports.finish);
  const readyStatus = finishStatus === 'satisfied' ? (reports.ready ? (reports.ready.ok ? 'satisfied' : 'required') : 'pending') : 'pending';
  const closeStatus =
    readyStatus === 'satisfied'
      ? reports.audit?.auditVerdict.closeEvidenceFound
        ? 'satisfied'
        : reports.close?.ok
          ? 'required'
          : 'blocked'
      : 'pending';
  const auditStatus = reports.audit ? (reports.audit.auditVerdict.closeEvidenceFound ? (reports.audit.auditVerdict.verdict === 'closed-valid' ? 'satisfied' : 'required') : 'pending') : 'pending';
  return [
    {
      id: 'finish',
      status: finishStatus,
      summary: finishStatus === 'required' ? 'Apply bounded finish bookkeeping.' : finishStatus === 'satisfied' ? 'Finish bookkeeping is current.' : 'Finish blockers must be resolved.',
      command: finishStatus === 'required' ? `hadara task finish --task ${taskId} --execute --json` : `hadara task finish --task ${taskId} --json`,
      mode: finishStatus === 'required' ? 'execute' : 'dry-run',
      writeBoundary: finishStatus === 'required' ? 'task-local' : 'read-only',
      expectedWritePaths: reports.finish.writes.map((write) => write.path),
      alreadySatisfied: finishStatus === 'satisfied',
      sourceReport: 'hadara.task.finish.v1'
    },
    {
      id: 'ready',
      status: readyStatus,
      summary: readyStatus === 'satisfied' ? 'Done-level readiness passed.' : readyStatus === 'pending' ? 'Ready waits for finish.' : 'Run readiness and resolve blockers.',
      command: `hadara task ready --task ${taskId} --level done --json`,
      mode: 'read-only',
      writeBoundary: 'read-only',
      expectedWritePaths: [],
      alreadySatisfied: readyStatus === 'satisfied',
      sourceReport: 'hadara.task.ready.v1'
    },
    {
      id: 'close',
      status: closeStatus,
      summary: closeStatus === 'required' ? 'Append close evidence after reviewing close dry-run.' : closeStatus === 'satisfied' ? 'Close evidence exists.' : closeStatus === 'pending' ? 'Close waits for readiness.' : 'Close preconditions have blockers.',
      command: closeStatus === 'required' ? `hadara task close --task ${taskId} --execute --json` : `hadara task close --task ${taskId} --json`,
      mode: closeStatus === 'required' ? 'execute' : 'dry-run',
      writeBoundary: closeStatus === 'required' ? 'evidence-append' : 'read-only',
      expectedWritePaths: closeStatus === 'required' && reports.finish.task ? [`${reports.finish.task.capsule}/evidence.jsonl`] : [],
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
              ? 'Close audit found close-source drift; review repair plan, then append fresh close proof.'
              : 'Run close audit and repair any drift.',
      command: `hadara task audit-close --task ${taskId} --json`,
      mode: 'read-only',
      writeBoundary: 'read-only',
      expectedWritePaths: [],
      alreadySatisfied: auditStatus === 'satisfied',
      sourceReport: 'hadara.task.audit_close.v1'
    }
  ];
}

function collectIssues(taskId: string, reports: FinalizeReports): TaskFinalizeIssue[] {
  const seen = new Set<string>();
  const issues: TaskFinalizeIssue[] = [];
  const reportIssues = [...reports.finish.issues, ...(reports.ready?.issues ?? []), ...(reports.close?.issues ?? []), ...(reports.audit?.issues ?? [])];
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
      code: 'TASK_FINALIZE_EVIDENCE_QUALITY_HINT',
      message: 'Done-level evidence is missing substantive passed proof. Record validation evidence with --result passed and --category validation after a meaningful check succeeds.',
      path: evidenceQualityIssue.path,
      fixHint: 'Use evidence add-command with an explicit passed result/category for real validation output; do not rewrite existing unknown/failed evidence.',
      example: 'hadara evidence add-command --task T-XXXX --summary "Focused validation passed." --result passed --category validation --json'
    });
  }
  if (issues.some(isCloseDriftIssue)) {
    issues.push({
      severity: 'info',
      code: 'TASK_FINALIZE_CLOSE_SOURCE_DRIFT_GUIDANCE',
      message: 'Close-source files changed after the recorded close proof. Review the repair plan, finish intended doc edits, then append a fresh close proof and audit it.',
      fixHint: 'Use close-repair-plan for the read-only diagnosis, then rerun the guarded close/finalize path after close-source edits are complete.',
      example: `hadara task close-repair-plan --task ${taskId} --json`
    });
  }
  return issues;
}

function deriveFinalizeState(steps: TaskFinalizeStep[], issues: TaskFinalizeIssue[], reports?: FinalizeReports): TaskFinalizeReport['state'] {
  if (finalizeBlockingIssues(issues).length > 0 || steps.some((step) => step.status === 'blocked')) return 'blocked';
  if (reports?.audit?.auditVerdict.verdict === 'closed-valid' && steps.every((step) => step.status === 'satisfied')) return 'closed-valid';
  if (reports?.audit?.auditVerdict.closeEvidenceFound && reports.audit.auditVerdict.verdict !== 'closed-valid') return 'closed-stale';
  const close = steps.find((step) => step.id === 'close');
  const ready = steps.find((step) => step.id === 'ready');
  const finish = steps.find((step) => step.id === 'finish');
  if (finish?.status === 'satisfied' && ready?.status === 'satisfied' && close?.status === 'required') return 'ready-to-close';
  return 'in-progress';
}

function derivePlanStatus(state: TaskFinalizeReport['state'], steps: TaskFinalizeStep[]): TaskFinalizeReport['planStatus'] {
  if (state === 'blocked' || state === 'closed-stale') return 'blocked';
  if (state === 'ready-to-close') return 'executable';
  if (state === 'closed-valid') return 'satisfied';
  return steps.some((step) => step.status === 'required') ? 'executable' : 'pending';
}

function finalizeBlockingIssues(issues: TaskFinalizeIssue[]): TaskFinalizeIssue[] {
  return issues.filter((issue) => issue.severity === 'error' && issue.code !== 'TASK_CLOSE_EVIDENCE_MISSING');
}

function pendingWrites(steps: TaskFinalizeStep[]): TaskFinalizeReport['pendingWrites'] {
  return steps
    .filter((step) => step.status === 'required' && step.writeBoundary !== 'read-only')
    .map((step) => ({
      step: step.id,
      writeBoundary: step.writeBoundary,
      paths: step.expectedWritePaths
    }));
}

function createPrimaryNextAction(taskId: string, steps: TaskFinalizeStep[], issues: TaskFinalizeIssue[]): HadaraNextAction | undefined {
  const nextStep = steps.find((step) => step.status === 'required' || step.status === 'blocked');
  if (!nextStep) return undefined;
  if (nextStep.id === 'ready' && issues.some(isEvidenceQualityIssue)) {
    return createTaskLifecycleNextAction({
      id: 'finalize-record-passed-evidence',
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
  if (nextStep.id === 'audit-close' && issues.some(isCloseDriftIssue)) {
    return createTaskLifecycleNextAction({
      id: 'finalize-review-close-repair-plan',
      kind: 'command',
      required: true,
      command: `hadara task close-repair-plan --task ${taskId} --json`,
      message: 'Close-source drift was detected. Review the close repair plan before appending fresh close proof.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'reviewer',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    });
  }
  return createTaskLifecycleNextAction({
    id: `finalize-${nextStep.id}`,
    kind: nextStep.status === 'blocked' ? 'review' : 'command',
    required: true,
    command: nextStep.status === 'blocked' ? undefined : nextStep.command,
    message: nextStep.summary,
    writeBoundary: nextStep.writeBoundary,
    recommendedActorRole: nextStep.writeBoundary === 'read-only' ? 'reviewer' : 'worker',
    requiresBeforeHash: false,
    stalePlanRisk: nextStep.writeBoundary === 'read-only' ? 'none' : 'low'
  });
}

function isCloseDriftIssue(issue: TaskFinalizeIssue): boolean {
  return issue.code === 'TASK_CLOSE_AUDIT_SOURCE_HASH_DRIFT' || issue.code === 'TASK_CLOSE_AUDIT_CURRENT_REPORT_HASH_DRIFT';
}

function summarizeSteps(steps: TaskFinalizeStep[], reports?: FinalizeReports): TaskFinalizeReport['summary'] {
  const evaluatedReports = evaluatedReportNames(steps, reports);
  const skippedReports = ['finish', 'ready', 'close', 'audit-close'].filter((name) => !evaluatedReports.includes(name));
  return {
    steps: steps.length,
    required: steps.filter((step) => step.status === 'required').length,
    blocked: steps.filter((step) => step.status === 'blocked').length,
    satisfied: steps.filter((step) => step.status === 'satisfied').length,
    executeSupported: true,
    evaluatedReports,
    skippedReports
  };
}

function createExecutedStep(step: TaskFinalizeStep, ok: boolean, report: unknown, status: TaskFinalizeExecutedStep['status']): TaskFinalizeExecutedStep {
  return {
    id: step.id,
    status,
    command: step.command,
    ok,
    reportHash: hashReport(report),
    summary: step.summary,
    writeBoundary: step.writeBoundary
  };
}

function hashReport(report: unknown): string {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(report)).digest('hex')}`;
}

function reportKeyForStep(stepId: TaskFinalizeStepId): keyof FinalizeReports {
  if (stepId === 'finish') return 'finish';
  if (stepId === 'ready') return 'ready';
  if (stepId === 'close') return 'close';
  return 'audit';
}

function getFinishStatus(finish: TaskFinishReport): TaskFinalizeStepStatus {
  return finish.ok ? (finish.summary.plannedWrites > 0 ? 'required' : 'satisfied') : 'blocked';
}

function evaluatedReportNames(steps: TaskFinalizeStep[], reports?: FinalizeReports): string[] {
  if (reports) return ['finish', ...(reports.ready ? ['ready'] : []), ...(reports.close ? ['close'] : []), ...(reports.audit ? ['audit-close'] : [])];
  const evaluated = new Set<string>(['finish']);
  for (const step of steps) {
    if (step.id === 'ready' && step.status !== 'pending') evaluated.add('ready');
    if (step.id === 'close' && step.status !== 'pending') evaluated.add('close');
    if (step.id === 'audit-close' && step.status !== 'pending') evaluated.add('audit-close');
  }
  return [...evaluated];
}

function isEvidenceQualityIssue(issue: TaskFinalizeIssue): boolean {
  return (
    issue.code.includes('TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE') ||
    issue.code.includes('TASK_DONE_WITH_ONLY_WEAK_EVIDENCE') ||
    issue.code.includes('EVIDENCE_REQUIRED') ||
    issue.code.includes('WITHOUT_SUBSTANTIVE_EVIDENCE') ||
    issue.code.includes('ONLY_WEAK_EVIDENCE')
  );
}

function fallbackStep(taskId: string, id: TaskFinalizeStepId): TaskFinalizeStep {
  return {
    id,
    status: 'unknown',
    summary: 'Step state could not be determined.',
    command: id === 'audit-close' ? `hadara task audit-close --task ${taskId} --json` : `hadara task ${id} --task ${taskId} --json`,
    mode: 'read-only',
    writeBoundary: 'read-only',
    expectedWritePaths: [],
    alreadySatisfied: false,
    sourceReport: 'unknown'
  };
}

function hashPlan(taskId: string, steps: TaskFinalizeStep[]): string {
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
    }))
  };
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(stable)).digest('hex')}`;
}
