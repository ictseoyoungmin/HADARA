import { createTaskSelectionReport, type TaskSelectionIssue, type TaskSelectionRecommendation, type TaskSelectionReport } from '../task/task-selection';
import type { EvaluationState, ProjectStatusHealth, ProjectStatusNextActionV2, StatusReadinessV1 } from './project-status-v2';

export interface TaskSelectionStatusV2Report {
  schemaVersion: 'hadara.taskSelection.status.v2';
  command: 'task.status';
  ok: boolean;
  scope: 'task-selection';
  mode: 'select-work';
  generatedAt: string;
  projectRoot: string;
  phase: 'select-work' | 'idle' | 'review-next-work' | 'degraded';
  health: ProjectStatusHealth;
  readiness: StatusReadinessV1;
  evaluations: Array<{
    id: string;
    state: EvaluationState;
    health: ProjectStatusHealth;
    summary: string;
  }>;
  primaryNextAction: ProjectStatusNextActionV2 | null;
  recommendations: Array<{
    taskId: string;
    title: string;
    source: string;
    sourceKind: TaskSelectionRecommendation['sourceKind'] | null;
    reason: string;
    capsule: string | null;
    taskCapsulePresent: boolean;
    taskBoardStatus: string | null;
    requiredReading: string[];
    operatorGuidance: string | null;
  }>;
  compatibility: {
    legacySchemaVersion: 'hadara.task.status.v1';
    legacyCommand: 'hadara task status --compat v1 --json';
    migration: string;
  };
  sources: {
    taskSelection: TaskSelectionReport;
  };
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  issues: TaskSelectionIssue[];
}

export function createTaskSelectionStatusV2Report(projectRoot: string, now = new Date()): TaskSelectionStatusV2Report {
  const taskSelection = createTaskSelectionReport(projectRoot);
  const recommendation = taskSelection.recommendations[0] ?? null;
  const primaryNextAction = recommendation ? nextActionFromRecommendation(recommendation) : null;
  const phase = determinePhase(taskSelection, recommendation, primaryNextAction);
  const health = taskSelection.ok ? (phase === 'idle' ? 'ok' : 'ok') : 'degraded';

  return {
    schemaVersion: 'hadara.taskSelection.status.v2',
    command: 'task.status',
    ok: taskSelection.ok,
    scope: 'task-selection',
    mode: 'select-work',
    generatedAt: now.toISOString(),
    projectRoot,
    phase,
    health,
    readiness: buildReadiness(phase, health, primaryNextAction),
    evaluations: [
      {
        id: 'task-selection',
        state: 'evaluated',
        health,
        summary: `${taskSelection.recommendations.length} recommendation(s), source=${taskSelection.summary.source}.`
      },
      {
        id: 'required-reading',
        state: recommendation ? 'evaluated' : 'not-evaluated',
        health: 'ok',
        summary: recommendation
          ? `${recommendation.requiredReading.length} existing required-reading file(s) routed for the recommendation.`
          : 'No recommendation was available, so required reading was not routed.'
      }
    ],
    primaryNextAction,
    recommendations: taskSelection.recommendations.map((item) => ({
      taskId: item.taskId,
      title: item.title,
      source: item.source,
      sourceKind: item.sourceKind ?? null,
      reason: item.reason,
      capsule: item.capsule,
      taskCapsulePresent: item.taskCapsulePresent,
      taskBoardStatus: item.taskBoardStatus,
      requiredReading: item.requiredReading,
      operatorGuidance: item.operatorGuidance ?? null
    })),
    compatibility: {
      legacySchemaVersion: 'hadara.task.status.v1',
      legacyCommand: 'hadara task status --compat v1 --json',
      migration: 'This v2 task-selection report is the default 0.5.x no-selected-task cockpit. Use the explicit v1 compatibility command only for legacy consumers.'
    },
    sources: { taskSelection },
    issues: taskSelection.issues
  };
}

export function formatTaskSelectionStatusV2Report(report: TaskSelectionStatusV2Report): string {
  return [
    `[HADARA] task status ${report.phase} (${report.health})`,
    `readiness: ${report.readiness.status} - ${report.readiness.reason}`,
    report.primaryNextAction
      ? `next: ${report.primaryNextAction.command ?? report.primaryNextAction.message}`
      : 'next: none',
    `legacy: ${report.compatibility.legacyCommand}`
  ].join('\n');
}

function determinePhase(
  taskSelection: TaskSelectionReport,
  recommendation: TaskSelectionRecommendation | null,
  action: ProjectStatusNextActionV2 | null
): TaskSelectionStatusV2Report['phase'] {
  if (!taskSelection.ok) return 'degraded';
  if (!recommendation || !action) return 'idle';
  if (action.kind === 'review') return 'review-next-work';
  return 'select-work';
}

function nextActionFromRecommendation(recommendation: TaskSelectionRecommendation): ProjectStatusNextActionV2 {
  if (recommendation.taskCapsulePresent && recommendation.taskId !== 'TBD') {
    return {
      id: 'inspect-recommended-task',
      kind: 'command',
      command: `hadara task status --task ${recommendation.taskId} --json`,
      message: `Inspect recommended Task Capsule ${recommendation.taskId}.`,
      writeBoundary: 'read-only',
      risk: 'none',
      requiresReview: false,
      writes: false
    };
  }
  if (recommendation.createCommand) {
    return {
      id: 'create-recommended-task',
      kind: 'create',
      command: recommendation.createCommand,
      message: 'Create a Task Capsule for the recommended work, then rerun `hadara task status --task <task-id> --json`.',
      writeBoundary: 'task-local',
      risk: 'low',
      requiresReview: false,
      writes: true
    };
  }
  return {
    id: 'review-next-work-guidance',
    kind: 'review',
    command: 'hadara task status --json',
    message: recommendation.operatorGuidance || 'Review current-state next-work guidance before creating or selecting a Task Capsule.',
    writeBoundary: 'read-only',
    risk: 'low',
    requiresReview: true,
    writes: false
  };
}

function buildReadiness(
  phase: TaskSelectionStatusV2Report['phase'],
  health: ProjectStatusHealth,
  action: ProjectStatusNextActionV2 | null
): StatusReadinessV1 {
  if (health === 'degraded') return { intent: 'orient', status: 'needs-context', reason: 'Task selection has degraded source diagnostics.' };
  if (phase === 'idle') return { intent: 'plan', status: 'terminal', reason: 'No open task recommendation was found.' };
  if (phase === 'review-next-work') return { intent: 'plan', status: 'needs-review', reason: 'Current next-work guidance requires operator review before mutation.' };
  if (action?.writes) return { intent: 'plan', status: 'needs-review', reason: 'A task-local create action is available and should be reviewed before execution.' };
  return { intent: 'plan', status: 'ready', reason: 'A read-only task inspection action is available.' };
}
