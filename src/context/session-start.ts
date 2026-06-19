import type {
  ContextBudget,
  ContextPackIssue,
  ContextPackItem,
  ContextPackReport,
  ContextPackSourceSummary
} from './context-pack';
import { CONTEXT_PACK_COMMAND, CONTEXT_PACK_SCHEMA_ID, buildContextPackReport } from './context-pack';
import type { ContextCacheMetadata } from './context-graph';

export const SESSION_START_SCHEMA_ID = 'hadara.sessionStart.v1' as const;
export const SESSION_START_COMMAND = 'session.start' as const;

export type SessionStartSchemaVersion = typeof SESSION_START_SCHEMA_ID;
export type SessionStartCommand = typeof SESSION_START_COMMAND;

export interface SessionStartCurrentState {
  activeTask?: string;
  latestCompletedTask?: string;
  recommendedNextTask?: string;
  releaseState?: string;
}

export interface SessionStartLifecycle {
  primaryNextCommands: string[];
  diagnosticCommands: string[];
}

export interface SessionStartSummary {
  degraded: boolean;
  readFirstCount: number;
  readIfNeededCount: number;
  sliceCandidateCount: number;
  knownProblemCount: number;
  issueCount: number;
}

export interface SessionStartReport {
  schemaVersion: SessionStartSchemaVersion;
  command: SessionStartCommand;
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  currentState: SessionStartCurrentState;
  contextPack: ContextPackReport;
  lifecycle: SessionStartLifecycle;
  knownProblems: ContextPackItem[];
  sourceSummary: ContextPackSourceSummary;
  cache: ContextCacheMetadata;
  summary: SessionStartSummary;
  issues: ContextPackIssue[];
}

export interface BuildSessionStartReportOptions {
  projectRoot: string;
  generatedAt?: string;
  taskId?: string;
  includeCode?: boolean;
  allowLiveContextPack?: boolean;
  budget?: Partial<ContextBudget>;
  contextPack?: ContextPackReport;
}

export function buildSessionStartReport(input: BuildSessionStartReportOptions): SessionStartReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const contextPack = input.contextPack ?? (input.allowLiveContextPack
    ? buildContextPackReport({
        projectRoot: input.projectRoot,
        generatedAt,
        includeCode: input.includeCode,
        ...(input.taskId ? { taskId: input.taskId } : {}),
        ...(input.budget ? { budget: input.budget } : {})
      })
    : buildBoundedContextPackReport({
        projectRoot: input.projectRoot,
        generatedAt,
        taskId: input.taskId,
        budget: input.budget
      }));
  const stateProjection = contextPack.stateProjection;
  const taskId = contextPack.taskId ?? input.taskId ?? stateProjection.activeTask;
  const issues = [...contextPack.issues];

  return {
    schemaVersion: SESSION_START_SCHEMA_ID,
    command: SESSION_START_COMMAND,
    ok: contextPack.ok && issues.every((issue) => issue.severity !== 'error'),
    generatedAt,
    projectRoot: input.projectRoot,
    currentState: {
      ...(stateProjection.activeTask ? { activeTask: stateProjection.activeTask } : {}),
      ...(stateProjection.latestCompletedTask ? { latestCompletedTask: stateProjection.latestCompletedTask } : {}),
      ...(taskId ? { recommendedNextTask: taskId } : {}),
      ...(stateProjection.releaseState ? { releaseState: stateProjection.releaseState } : {})
    },
    contextPack,
    lifecycle: lifecycleForSessionStart(taskId, contextPack),
    knownProblems: contextPack.knownProblems,
    sourceSummary: contextPack.sourceSummary,
    cache: contextPack.cache,
    summary: {
      degraded: contextPack.sourceSummary.degraded || issues.some((issue) => issue.severity !== 'info'),
      readFirstCount: contextPack.readFirst.length,
      readIfNeededCount: contextPack.readIfNeeded.length,
      sliceCandidateCount: contextPack.sliceCandidates.length,
      knownProblemCount: contextPack.knownProblems.length,
      issueCount: issues.length
    },
    issues
  };
}

function lifecycleForSessionStart(taskId: string | undefined, contextPack: ContextPackReport): SessionStartLifecycle {
  const primaryNextCommands = taskId
    ? [
        `node dist/cli/main.js task status --task ${taskId} --json`,
        `node dist/cli/main.js context pack --task ${taskId} --json`
      ]
    : ['node dist/cli/main.js task next --json'];

  for (const suggestion of contextPack.validateWith) {
    if (suggestion.requiredForClose && !primaryNextCommands.includes(suggestion.command)) {
      primaryNextCommands.push(suggestion.command);
    }
  }

  const diagnosticCommands = [
    'node dist/cli/main.js context cache status --json',
    taskId
      ? `node dist/cli/main.js context graph --task ${taskId} --json`
      : 'node dist/cli/main.js context graph --json',
    taskId
      ? `node dist/cli/main.js session start --task ${taskId} --live --json`
      : 'node dist/cli/main.js session start --live --json',
    'node dist/cli/main.js state verify --json'
  ];

  return {
    primaryNextCommands,
    diagnosticCommands
  };
}

function buildBoundedContextPackReport(input: {
  projectRoot: string;
  generatedAt: string;
  taskId?: string;
  budget?: Partial<ContextBudget>;
}): ContextPackReport {
  const budget = {
    ...(input.budget?.targetTokens !== undefined ? { targetTokens: input.budget.targetTokens } : {}),
    ...(input.budget?.maxItems !== undefined ? { maxItems: input.budget.maxItems } : {}),
    maxReadFirstItems: input.budget?.maxReadFirstItems ?? 7,
    mode: input.budget?.mode ?? 'bounded' as const
  };
  const issues: ContextPackIssue[] = input.taskId
    ? [{
        severity: 'warning',
        code: 'CONTEXT_PACK_DEGRADED',
        message: 'Session start used the bounded no-live context pack envelope. Run session start --live or context pack explicitly when a full graph read is acceptable.',
        fixHint: 'Run hadara context cache warm --execute --json before relying on broad graph-backed session context.'
      }]
    : [{
        severity: 'error',
        code: 'CONTEXT_PACK_TASK_NOT_FOUND',
        message: 'Bounded session start requires --task because it does not perform live project discovery by default.',
        fixHint: 'Pass --task <task-id>, or run hadara task next --json to choose the next task.'
      }];
  const readFirst: ContextPackItem[] = input.taskId
    ? [{
        id: `task:${input.taskId}`,
        type: 'Task',
        title: input.taskId,
        reason: 'Explicit task id supplied to bounded session start.',
        confidence: 'explicit',
        required: true
      }]
    : [];

  return {
    schemaVersion: CONTEXT_PACK_SCHEMA_ID,
    command: CONTEXT_PACK_COMMAND,
    ok: issues.every((issue) => issue.severity !== 'error'),
    generatedAt: input.generatedAt,
    ...(input.taskId ? { taskId: input.taskId } : {}),
    projectRoot: input.projectRoot,
    budget,
    readFirst: readFirst.slice(0, budget.maxReadFirstItems),
    readIfNeeded: [],
    doNotReadByDefault: [],
    validateWith: input.taskId
      ? [{
          command: `node dist/cli/main.js task ready --task ${input.taskId} --level done --json`,
          reason: 'Done-level readiness is required before closing this task.',
          requiredForClose: true,
          source: 'evidence-history'
        }]
      : [],
    writeBoundaries: [],
    sliceCandidates: [],
    knownProblems: [],
    stateProjection: {
      ...(input.taskId ? { activeTask: input.taskId } : {}),
      stateConsistency: 'unknown',
      issues: []
    },
    sourceSummary: {
      graphAvailable: false,
      codeIndexAvailable: false,
      stateProjectionAvailable: false,
      docsRegistryAvailable: false,
      commandRegistryAvailable: false,
      degraded: true
    },
    cache: {
      used: false,
      hit: false,
      mode: 'session-start-bounded-no-live'
    },
    issues
  };
}
