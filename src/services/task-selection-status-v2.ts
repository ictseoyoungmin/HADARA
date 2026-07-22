import { createTaskSelectionReport, type TaskSelectionIssue, type TaskSelectionRecommendation, type TaskSelectionReport } from '../task/task-selection';
import type { ProjectContinuation } from './project-current-state';
import type { EvaluationState, StatusHealth, StatusNextAction, StatusReadiness } from '../status/model';

export interface TaskSelectionStatusV2Report {
  schemaVersion: 'hadara.taskSelection.status.v2';
  command: 'task.status';
  ok: boolean;
  scope: 'task-selection';
  mode: 'select-work';
  generatedAt: string;
  projectRoot: string;
  phase: 'select-work' | 'idle' | 'review-next-work' | 'continuation-ready' | 'degraded';
  health: StatusHealth;
  readiness: StatusReadiness;
  evaluations: Array<{
    id: string;
    state: EvaluationState;
    health: StatusHealth;
    summary: string;
  }>;
  primaryNextAction: StatusNextAction | null;
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
  selection: {
    precedence?: Array<{
      id: string;
      source: string;
      description: string;
    }>;
    selectedTaskId: string | null;
    selectedSource: string | null;
    selectedSourceKind: TaskSelectionRecommendation['sourceKind'] | null;
    sourceExplanation: string;
    primaryActionId: string | null;
  };
  sources: {
    detail: 'fast' | 'full';
    summary: {
      recommendations: number;
      selectedSource: string;
      currentStatePresent: boolean;
      taskBoardPresent: boolean;
      taskBoardRows: number;
      agentHandoffPresent: boolean;
      issueCodes: string[];
    };
    taskSelection?: TaskSelectionReport;
  };
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  issues: TaskSelectionIssue[];
}

export function createTaskSelectionStatusV2Report(
  projectRoot: string,
  now = new Date(),
  options: { detail?: 'fast' | 'full' } = {}
): TaskSelectionStatusV2Report {
  const detail = options.detail ?? 'fast';
  const taskSelection = createTaskSelectionReport(projectRoot);
  const recommendation = taskSelection.recommendations[0] ?? null;
  const continuation = taskSelection.sources.currentState.continuation;
  const continuationAction = recommendation ? null : continuationNextAction(continuation);
  const primaryNextAction = recommendation ? nextActionFromRecommendation(recommendation) : continuationAction;
  const phase = determinePhase(taskSelection, recommendation, primaryNextAction, continuationAction);
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
        id: 'selection-precedence',
        state: 'evaluated',
        health: 'ok',
        summary: recommendation
          ? `Selected ${recommendation.taskId} from ${recommendation.source}.`
          : 'No recommendation matched the task-selection precedence chain.'
      },
      {
        id: 'required-reading',
        state: recommendation ? 'evaluated' : 'not-evaluated',
        health: 'ok',
        summary: recommendation
          ? `${recommendation.requiredReading.length} existing required-reading file(s) routed for the recommendation.`
          : 'No recommendation was available, so required reading was not routed.'
      },
      {
        id: 'continuation',
        state: continuation ? 'evaluated' : 'not-evaluated',
        health: 'ok',
        summary: continuation
          ? `Structured current-state continuation found: disposition=${continuation.disposition}.`
          : 'No structured current-state continuation was found.'
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
    selection: {
      ...(detail === 'full' ? { precedence: taskSelectionPrecedence() } : {}),
      selectedTaskId: recommendation?.taskId ?? null,
      selectedSource: recommendation?.source ?? null,
      selectedSourceKind: recommendation?.sourceKind ?? null,
      sourceExplanation: recommendation
        ? recommendation.reason
        : continuationAction
        ? `No task-selection recommendation matched, but a structured continuation (disposition=${continuation?.disposition}) was found in current-state canon.`
        : 'No active task, structured next work, Task Board row, slice row, first-task creation candidate, or structured continuation was selected.',
      primaryActionId: primaryNextAction?.id ?? null
    },
    sources: {
      detail,
      summary: {
        recommendations: taskSelection.recommendations.length,
        selectedSource: taskSelection.summary.source,
        currentStatePresent: taskSelection.sources.currentState.present,
        taskBoardPresent: taskSelection.sources.taskBoard.present,
        taskBoardRows: taskSelection.sources.taskBoard.rows,
        agentHandoffPresent: taskSelection.sources.agentHandoff.present,
        issueCodes: taskSelection.issues.map((issue) => issue.code)
      },
      ...(detail === 'full' ? { taskSelection } : {})
    },
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
  action: StatusNextAction | null,
  continuationAction: StatusNextAction | null
): TaskSelectionStatusV2Report['phase'] {
  if (!taskSelection.ok) return 'degraded';
  if (recommendation && action) return action.kind === 'review' ? 'review-next-work' : 'select-work';
  if (continuationAction) return 'continuation-ready';
  return 'idle';
}

/**
 * Routes an explicit current-state continuation (docx section 9) before falling back to
 * idle. Only "actionable" and "waiting-for-operator" override idle in this MVP;
 * "blocked"/"terminal"/"unresolved" intentionally fall through unchanged (T-0661 scope).
 */
function continuationNextAction(continuation: ProjectContinuation | null): StatusNextAction | null {
  if (!continuation) return null;
  const message = continuation.reason ? `${continuation.title} ${continuation.reason}` : continuation.title;
  if (continuation.disposition === 'waiting-for-operator') {
    return { id: 'review-continuation', kind: 'review', message, writeBoundary: 'read-only', risk: 'none', requiresReview: true, writes: false };
  }
  if (continuation.disposition === 'actionable') {
    if (continuation.createCommandAllowed === false) {
      return { id: 'review-continuation', kind: 'review', message, writeBoundary: 'read-only', risk: 'low', requiresReview: true, writes: false };
    }
    return {
      id: 'create-continuation-task',
      kind: 'create',
      command: `hadara task create ${continuationShellQuote(continuation.title)}`,
      message: `Create a Task Capsule for the declared continuation, then rerun \`hadara task status --task <task-id> --json\`.`,
      writeBoundary: 'task-local',
      risk: 'low',
      requiresReview: false,
      writes: true
    };
  }
  return null;
}

function continuationShellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function nextActionFromRecommendation(recommendation: TaskSelectionRecommendation): StatusNextAction {
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
  health: StatusHealth,
  action: StatusNextAction | null
): StatusReadiness {
  if (health === 'degraded') return { intent: 'orient', status: 'needs-context', reason: 'Task selection has degraded source diagnostics.' };
  if (phase === 'idle') return { intent: 'plan', status: 'terminal', reason: 'No open task recommendation was found.' };
  if (phase === 'continuation-ready') return { intent: 'plan', status: 'needs-review', reason: 'A structured current-state continuation was found and requires review before acting.' };
  if (phase === 'review-next-work') return { intent: 'plan', status: 'needs-review', reason: 'Current next-work guidance requires operator review before mutation.' };
  if (action?.writes) return { intent: 'plan', status: 'needs-review', reason: 'A task-local create action is available and should be reviewed before execution.' };
  return { intent: 'plan', status: 'ready', reason: 'A read-only task inspection action is available.' };
}

function taskSelectionPrecedence(): TaskSelectionStatusV2Report['selection']['precedence'] {
  return [
    {
      id: 'active-task',
      source: '.hadara/state/current.json',
      description: 'Use the structured activeTask when present and valid.'
    },
    {
      id: 'structured-next-work',
      source: '.hadara/state/current.json',
      description: 'Use structured nextWork when it is actionable and not stale bootstrap guidance.'
    },
    {
      id: 'handoff-next-step',
      source: 'docs/AGENT_HANDOFF.md',
      description: 'Use explicit handoff next-step guidance when present.'
    },
    {
      id: 'development-slice',
      source: 'docs/DEVELOPMENT_SLICES.md',
      description: 'Use the first open development slice when the profile exposes slices.'
    },
    {
      id: 'task-board',
      source: 'docs/TASK_BOARD.md',
      description: 'Use the first open Task Board row when no stronger structured source selected work.'
    },
    {
      id: 'first-task',
      source: 'project scaffold',
      description: 'Offer first-task creation when the project has no task history.'
    },
    {
      id: 'continuation',
      source: '.hadara/state/current.json',
      description: 'Use an explicit actionable or waiting-for-operator continuation before falling back to idle.'
    },
    {
      id: 'idle',
      source: 'none',
      description: 'Return terminal idle when no source selects work.'
    }
  ];
}
