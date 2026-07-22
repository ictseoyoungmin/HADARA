import { readProjectCurrentState } from './project-current-state';
import type { ProjectContinuation } from './project-current-state';
import { createOpsStatusReport, OpsStatusReport } from './operations-status-service';
import { createTaskSelectionReport } from '../task/task-selection';

export type ProjectStatusHealth = 'ok' | 'attention' | 'blocked' | 'degraded' | 'unknown';
export type ProjectStatusPhase =
  | 'uninitialized'
  | 'adoption-review'
  | 'upgrade-required'
  | 'select-work'
  | 'active-work'
  | 'release-preparation'
  | 'integration-setup'
  | 'continuation-ready'
  | 'idle'
  | 'degraded';

export type EvaluationState = 'evaluated' | 'not-evaluated' | 'unavailable' | 'stale' | 'invalid' | 'partial';

export interface StatusReadinessV1 {
  intent: 'orient' | 'plan' | 'edit' | 'validate' | 'close' | 'release';
  status: 'ready' | 'needs-context' | 'needs-review' | 'not-evaluated' | 'blocked' | 'terminal';
  reason: string;
}

export interface StatusEvaluationV1 {
  id: string;
  state: EvaluationState;
  health: ProjectStatusHealth;
  summary: string;
}

export interface ProjectStatusNextActionV2 {
  id: string;
  kind: 'command' | 'review' | 'create' | 'none';
  command?: string;
  executeAlternative?: {
    command: string;
    writeBoundary: ProjectStatusNextActionV2['writeBoundary'];
    requiresReview: boolean;
  };
  message: string;
  writeBoundary: 'read-only' | 'task-local' | 'project-state' | 'evidence-append' | 'task-close-transaction' | 'none';
  risk: 'none' | 'low' | 'medium' | 'high';
  requiresReview: boolean;
  writes: boolean;
}

export interface ProjectStatusV2Report {
  schemaVersion: 'hadara.project.status.v2';
  command: 'status';
  ok: true;
  scope: 'project';
  generatedAt: string;
  projectRoot: string;
  phase: ProjectStatusPhase;
  health: ProjectStatusHealth;
  readiness: StatusReadinessV1;
  evaluations: StatusEvaluationV1[];
  primaryNextAction: ProjectStatusNextActionV2 | null;
  compatibility: {
    legacySchemaVersion: 'hadara.ops.status.v1';
    legacyCommand: 'hadara status --compat v1 --json';
    migration: string;
  };
  sources: {
    currentState: {
      present: boolean;
      activeTask: string | null;
      nextWork: string | null;
      currentRelease: string | null;
      validationBaseline: string | null;
      validationBaselineMeaning: string;
    };
    taskSelection: {
      recommendations: number;
      source: string;
    };
    opsStatusV1: {
      detail: 'fast' | 'full';
      health: OpsStatusReport['health'];
      issues: number;
      debt?: {
        open: number;
        highOpen: number;
      };
      stateConsistency?: {
        evaluated: boolean;
        consistent: boolean;
        errors: number;
        warnings: number;
      };
      activeRun?: {
        present: boolean;
      };
      knownProblems?: number;
    };
  };
  issues: Array<{
    severity: 'error' | 'warning';
    code: string;
    message: string;
  }>;
}

export function createProjectStatusV2Report(projectRoot: string, now = new Date(), options: { detail?: 'fast' | 'full' } = {}): ProjectStatusV2Report {
  const detail = options.detail ?? 'fast';
  const currentStateRead = readProjectCurrentState(projectRoot);
  const currentState = currentStateRead.state;
  const opsStatus = createOpsStatusReport(projectRoot, detail === 'full'
    ? { includeStateConsistency: true }
    : {
        includeDebt: false,
        includeKnownProblems: false,
        includeStateConsistency: false,
        taskStatusSource: 'task-board',
        maxTextLength: 240
      });
  const taskSelection = createTaskSelectionReport(projectRoot);
  const currentStateIssues = currentStateRead.issues.map((issue) => ({
    severity: issue.severity,
    code: issue.code,
    message: issue.message
  }));
  const opsStatusIssues = projectStatusIssuesFromOpsStatus(opsStatus);
  const phase = determineProjectPhase({ currentState, currentStateIssues, opsStatus, taskSelection });
  const health = determineHealth(opsStatus, phase, [...currentStateIssues, ...opsStatusIssues]);
  const primaryNextAction = buildPrimaryNextAction({ phase, currentState, taskSelection, health, issues: [...currentStateIssues, ...opsStatusIssues] });

  return {
    schemaVersion: 'hadara.project.status.v2',
    command: 'status',
    ok: true,
    scope: 'project',
    generatedAt: now.toISOString(),
    projectRoot,
    phase,
    health,
    readiness: buildReadiness(phase, health, primaryNextAction),
    evaluations: buildEvaluations({ currentStateRead, opsStatus, taskSelection }),
    primaryNextAction,
    compatibility: {
      legacySchemaVersion: 'hadara.ops.status.v1',
      legacyCommand: 'hadara status --compat v1 --json',
      migration: 'Use this v2 report for project/session ingress. Use the explicit v1 compatibility command only for legacy dashboard/read-model consumers during 0.5.x.'
    },
    sources: {
      currentState: {
        present: Boolean(currentState),
        activeTask: currentState?.activeTask?.id ?? null,
        nextWork: currentState?.nextWork?.title ?? null,
        currentRelease: currentState?.currentRelease ?? null,
        validationBaseline: currentState?.validationBaseline.summary ?? null,
        validationBaselineMeaning: 'current trusted validation baseline; not necessarily the latest completed task evidence'
      },
      taskSelection: {
        recommendations: taskSelection.recommendations.length,
        source: taskSelection.summary.source
      },
      opsStatusV1: {
        detail,
        health: opsStatus.health,
        issues: opsStatus.issues.length + opsStatusIssues.length,
        ...(detail === 'full' ? {
          debt: {
            open: opsStatus.debt.open,
            highOpen: opsStatus.debt.highOpen
          },
          stateConsistency: opsStatus.stateConsistency ? {
            evaluated: true,
            consistent: opsStatus.stateConsistency.consistent,
            errors: opsStatus.stateConsistency.issueCounts.error,
            warnings: opsStatus.stateConsistency.issueCounts.warning
          } : {
            evaluated: false,
            consistent: true,
            errors: 0,
            warnings: 0
          },
          activeRun: {
            present: Boolean(opsStatus.activeRun.activeRun)
          },
          knownProblems: opsStatus.handoff.knownProblems.length
        } : {})
      }
    },
    issues: [...currentStateIssues, ...opsStatus.issues, ...opsStatusIssues]
  };
}

export function formatProjectStatusV2Report(report: ProjectStatusV2Report): string {
  return [
    `[HADARA] status ${report.phase} (${report.health})`,
    `readiness: ${report.readiness.status} - ${report.readiness.reason}`,
    report.primaryNextAction
      ? `next: ${report.primaryNextAction.command ?? report.primaryNextAction.message}`
      : 'next: none',
    `legacy: ${report.compatibility.legacyCommand}`
  ].join('\n');
}

function determineProjectPhase(input: {
  currentState: ReturnType<typeof readProjectCurrentState>['state'];
  currentStateIssues: ProjectStatusV2Report['issues'];
  opsStatus: OpsStatusReport;
  taskSelection: ReturnType<typeof createTaskSelectionReport>;
}): ProjectStatusPhase {
  if (input.currentStateIssues.some((issue) => issue.severity === 'error')) return 'degraded';
  if (input.opsStatus.issues.some((issue) => issue.code === 'PROJECT_STATE_MISSING' && input.opsStatus.issues.some((candidate) => candidate.code === 'TASK_BOARD_MISSING'))) return 'uninitialized';
  if (input.currentState?.activeTask?.id) return 'active-work';
  if (input.currentState?.nextWork?.state === 'waiting-for-operator') return 'adoption-review';
  if (input.currentState?.nextWork?.state === 'blocked') return 'degraded';
  if (input.taskSelection.recommendations.length > 0) return 'select-work';
  if (continuationNextAction(input.currentState?.continuation ?? null)) return 'continuation-ready';
  if (input.opsStatus.health !== 'ok') return 'degraded';
  return 'idle';
}

function determineHealth(opsStatus: OpsStatusReport, phase: ProjectStatusPhase, currentStateIssues: ProjectStatusV2Report['issues']): ProjectStatusHealth {
  if (currentStateIssues.some((issue) => issue.severity === 'error')) return 'blocked';
  if (opsStatus.health === 'error') return 'blocked';
  if (phase === 'uninitialized') return 'attention';
  if (currentStateIssues.some((issue) => issue.severity === 'warning')) return 'degraded';
  if (opsStatus.health === 'degraded') return 'degraded';
  return 'ok';
}

function buildPrimaryNextAction(input: {
  phase: ProjectStatusPhase;
  currentState: ReturnType<typeof readProjectCurrentState>['state'];
  taskSelection: ReturnType<typeof createTaskSelectionReport>;
  health: ProjectStatusHealth;
  issues: ProjectStatusV2Report['issues'];
}): ProjectStatusNextActionV2 | null {
  if (input.health === 'blocked') {
    if (input.issues.some((issue) => issue.code === 'STATUS_STATE_CONSISTENCY_ERROR')) {
      return {
        id: 'review-state-consistency',
        kind: 'review',
        message: 'Resolve blocking state-consistency diagnostics before routing into active work.',
        writeBoundary: 'read-only',
        risk: 'medium',
        requiresReview: true,
        writes: false
      };
    }
    return readOnlyCommandAction('inspect-status-full', 'hadara status --detail full --json', 'Inspect blocking status diagnostics.');
  }
  if (input.currentState?.activeTask?.id) {
    const taskId = input.currentState.activeTask.id;
    return readOnlyCommandAction('inspect-active-task', `hadara task status --task ${taskId} --json`, `Inspect active task ${taskId}.`);
  }
  if (input.phase === 'uninitialized') {
    return {
      id: 'initialize-project',
      kind: 'create',
      command: 'hadara init --json',
      message: 'Initialize HADARA or run adoption preview for an existing project.',
      writeBoundary: 'project-state',
      risk: 'low',
      requiresReview: true,
      writes: true
    };
  }
  if (input.phase === 'adoption-review') {
    return readOnlyCommandAction('review-adoption', 'hadara init --adopt --json', 'Review HADARA adoption before creating task capsules.');
  }
  const recommendation = input.taskSelection.recommendations[0];
  if (recommendation?.taskCapsulePresent && recommendation.taskId !== 'TBD') {
    return readOnlyCommandAction('inspect-recommended-task', `hadara task status --task ${recommendation.taskId} --json`, `Inspect recommended task ${recommendation.taskId}.`);
  }
  if (recommendation?.createCommand) {
    return {
      id: 'create-recommended-task',
      kind: 'create',
      command: recommendation.createCommand,
      message: 'Create the recommended Task Capsule, then rerun `hadara status --json`.',
      writeBoundary: 'task-local',
      risk: 'low',
      requiresReview: false,
      writes: true
    };
  }
  const continuationAction = continuationNextAction(input.currentState?.continuation ?? null);
  if (continuationAction) return continuationAction;
  if (input.health !== 'ok') {
    return readOnlyCommandAction('inspect-status-full', 'hadara status --detail full --json', 'Inspect degraded status diagnostics.');
  }
  return null;
}

function continuationNextAction(continuation: ProjectContinuation | null): ProjectStatusNextActionV2 | null {
  if (!continuation) return null;
  const suggestion = continuation.reason ? `${continuation.title} ${continuation.reason}` : continuation.title;
  const message = `Review continuation suggestion: ${suggestion} Current human/reviewer direction has priority. Read routed project/development sources, decide whether work should continue, and choose a concise task title yourself.`;
  if (continuation.disposition === 'waiting-for-operator') {
    return { id: 'review-continuation', kind: 'review', message, writeBoundary: 'read-only', risk: 'none', requiresReview: true, writes: false };
  }
  if (continuation.disposition === 'actionable') {
    return { id: 'review-continuation', kind: 'review', message, writeBoundary: 'read-only', risk: 'low', requiresReview: true, writes: false };
  }
  return null;
}

function readOnlyCommandAction(id: string, command: string, message: string): ProjectStatusNextActionV2 {
  return {
    id,
    kind: 'command',
    command,
    message,
    writeBoundary: 'read-only',
    risk: 'none',
    requiresReview: false,
    writes: false
  };
}

function buildReadiness(phase: ProjectStatusPhase, health: ProjectStatusHealth, action: ProjectStatusNextActionV2 | null): StatusReadinessV1 {
  if (phase === 'idle' && !action) return { intent: 'orient', status: 'terminal', reason: 'No active task, next work, or current recommendation was found.' };
  if (health === 'blocked') return { intent: 'orient', status: 'blocked', reason: 'Status generation found blocking project health issues.' };
  if (phase === 'active-work') return { intent: 'orient', status: 'ready', reason: 'An active task is selected; inspect selected-task status before editing.' };
  if (phase === 'select-work') return { intent: 'plan', status: 'ready', reason: 'A next-work recommendation is available.' };
  if (phase === 'continuation-ready') return { intent: 'plan', status: 'needs-review', reason: 'A structured current-state continuation was found and requires review before acting.' };
  if (phase === 'uninitialized' || phase === 'adoption-review') return { intent: 'orient', status: 'needs-review', reason: 'Project setup or adoption state needs operator review.' };
  if (health === 'degraded') return { intent: 'orient', status: 'needs-context', reason: 'Project status is degraded; inspect explicit diagnostics before acting.' };
  return { intent: 'orient', status: 'ready', reason: 'Project status is available.' };
}

function projectStatusIssuesFromOpsStatus(opsStatus: OpsStatusReport): ProjectStatusV2Report['issues'] {
  const issues: ProjectStatusV2Report['issues'] = [];
  const stateConsistency = opsStatus.stateConsistency;
  if (stateConsistency && stateConsistency.issueCounts.error > 0) {
    issues.push({
      severity: 'error',
      code: 'STATUS_STATE_CONSISTENCY_ERROR',
      message: `State consistency reported ${stateConsistency.issueCounts.error} error(s) and ${stateConsistency.issueCounts.warning} warning(s).`
    });
  } else if (stateConsistency && stateConsistency.issueCounts.warning > 0) {
    issues.push({
      severity: 'warning',
      code: 'STATUS_STATE_CONSISTENCY_WARNING',
      message: `State consistency reported ${stateConsistency.issueCounts.warning} warning(s).`
    });
  }
  return issues;
}

function buildEvaluations(input: {
  currentStateRead: ReturnType<typeof readProjectCurrentState>;
  opsStatus: OpsStatusReport;
  taskSelection: ReturnType<typeof createTaskSelectionReport>;
}): StatusEvaluationV1[] {
  const currentStateIssue = input.currentStateRead.issues[0] ?? null;
  const currentStatePresent = input.currentStateRead.present && Boolean(input.currentStateRead.state);
  return [
    {
      id: 'current-state',
      state: currentStateIssue ? 'invalid' : currentStatePresent ? 'evaluated' : 'unavailable',
      health: currentStateIssue?.severity === 'error' ? 'blocked' : currentStatePresent ? 'ok' : 'attention',
      summary: currentStateIssue ? currentStateIssue.message : currentStatePresent ? 'Structured current-state canon was read.' : 'Structured current-state canon is unavailable; status used compatibility sources.'
    },
    {
      id: 'task-selection',
      state: 'evaluated',
      health: input.taskSelection.ok ? 'ok' : 'attention',
      summary: `${input.taskSelection.recommendations.length} recommendation(s), source=${input.taskSelection.summary.source}.`
    },
    {
      id: 'legacy-status-compatibility',
      state: 'evaluated',
      health: input.opsStatus.health === 'ok' ? 'ok' : 'degraded',
      summary: `v1 compatibility report health=${input.opsStatus.health}, issues=${input.opsStatus.issues.length}.`
    }
  ];
}
