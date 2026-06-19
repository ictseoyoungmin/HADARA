import type {
  ContextBudget,
  ContextPackIssue,
  ContextPackItem,
  ContextPackReport,
  ContextPackSourceSummary
} from './context-pack';
import { CONTEXT_PACK_COMMAND, CONTEXT_PACK_SCHEMA_ID, buildContextPackReport } from './context-pack';
import type { ContextCacheMetadata } from './context-graph';
import { buildContextGraphReport } from './context-graph-builder';
import {
  readContextCodeIndexShard,
  readContextGraphCoreShard,
  readContextSourceManifestCache
} from './context-cache-store';
import { checkContextSourceManifestFastFreshness } from './source-manifest';
import { codeIndexReportToGraphExtraction } from './code-graph-extractor';

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
    : buildWarmCachedContextPackReport({
        projectRoot: input.projectRoot,
        generatedAt,
        taskId: input.taskId,
        includeCode: input.includeCode,
        budget: input.budget
      }) ?? buildBoundedContextPackReport({
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

function buildWarmCachedContextPackReport(input: {
  projectRoot: string;
  generatedAt: string;
  taskId?: string;
  includeCode?: boolean;
  budget?: Partial<ContextBudget>;
}): ContextPackReport | undefined {
  const cachedManifest = readContextSourceManifestCache(input.projectRoot);
  if (cachedManifest.status !== 'valid' || !cachedManifest.manifest) return undefined;

  const fastFreshness = checkContextSourceManifestFastFreshness(input.projectRoot, cachedManifest.manifest);
  if (!fastFreshness.ok) return undefined;

  const graphCore = readContextGraphCoreShard({
    projectRoot: input.projectRoot,
    manifest: cachedManifest.manifest
  });
  if (!graphCore.hit || !graphCore.result) return undefined;

  const extractionResults = [graphCore.result];
  const code = input.includeCode
    ? readContextCodeIndexShard({
      projectRoot: input.projectRoot,
      manifest: cachedManifest.manifest
    })
    : undefined;
  if (code?.hit && code.result) {
    extractionResults.push(codeIndexReportToGraphExtraction(code.result));
  }

  const cache: ContextCacheMetadata = {
    used: true,
    hit: !input.includeCode || Boolean(code?.hit),
    mode: input.includeCode
      ? code?.hit ? 'graph-core+code-index' : `graph-core+code-index-${code?.status ?? 'missing'}`
      : 'graph-core',
    manifestHash: cachedManifest.manifest.manifestHash,
    readShardCount: 1 + (input.includeCode ? 1 : 0),
    hitShardCount: 1 + (code?.hit ? 1 : 0),
    missShardCount: code?.status === 'missing' ? 1 : 0,
    staleShardCount: code?.status === 'stale' ? 1 : 0,
    corruptShardCount: code?.status === 'corrupt' ? 1 : 0,
    schemaMismatchShardCount: code?.status === 'schema-mismatch' ? 1 : 0,
    shardPaths: [graphCore.path, ...(code ? [code.path] : [])].sort(),
    staleExtractorKeys: code?.status === 'stale' ? ['codeIndex'] : [],
    ...(graphCore.record ? { createdAt: graphCore.record.createdAt, cachePath: graphCore.path } : {}),
    sourceManifestCacheFresh: true,
    sourceManifestFastPath: 'hit',
    sourceManifestFastPathReason: fastFreshness.reason,
    ...(fastFreshness.strategy ? { sourceManifestFastPathStrategy: fastFreshness.strategy } : {})
  };
  const graphReport = buildContextGraphReport({
    projectRoot: input.projectRoot,
    generatedAt: input.generatedAt,
    ...(input.taskId ? { taskId: input.taskId, mode: 'task' as const } : { mode: 'full' as const }),
    extractionResults,
    cache
  });

  return buildContextPackReport({
    projectRoot: input.projectRoot,
    generatedAt: input.generatedAt,
    ...(input.taskId ? { taskId: input.taskId } : {}),
    ...(input.budget ? { budget: input.budget } : {}),
    includeCode: input.includeCode,
    graphReport,
    cache
  });
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
