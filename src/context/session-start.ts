import fs from 'node:fs';
import path from 'node:path';
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
import { validateTaskCapsule } from '../services/task-validation';
import { createDocsReadMapReport, type DocsDriftWarning, type DocsReadMapEntry } from '../services/docs-registry';
import { parseTaskBoard } from '../task/task-board';

export const SESSION_START_SCHEMA_ID = 'hadara.sessionStart.v1' as const;
export const SESSION_START_COMMAND = 'session.start' as const;

export type SessionStartSchemaVersion = typeof SESSION_START_SCHEMA_ID;
export type SessionStartCommand = typeof SESSION_START_COMMAND;

export interface SessionStartCurrentState {
  activeTask?: string;
  latestCompletedTask?: string;
  recommendedNextTask?: string;
  releaseState?: string;
  source?: 'task-context';
}

export interface SessionStartLifecycle {
  primaryNextCommands: string[];
  diagnosticCommands: string[];
}

export type SessionStartMode = 'live-context-pack' | 'warm-cache' | 'bounded-no-live';
export type SessionStartPrimaryNextAction = 'select-task' | 'inspect-task';

export interface SessionStartGuidanceCommand {
  id: string;
  command: string;
  args: string[];
  reason: string;
}

export interface SessionStartPrimaryAction {
  id: string;
  label: string;
  command: string;
  args: string[];
  reason: string;
  writeBoundary: 'read-only';
  recommendedActorRole: 'agent-worker';
}

export interface SessionStartGuidance {
  mode: SessionStartMode;
  primaryNextAction: SessionStartPrimaryNextAction;
  primaryAction: SessionStartPrimaryAction;
  whyThisNow: string;
  avoidForNow: string[];
  nextCommandArgs: string[];
  reason: string;
  taskRequired: boolean;
  liveContextPackAvailable: boolean;
  commands: SessionStartGuidanceCommand[];
}

export interface SessionStartSummary {
  degraded: boolean;
  readFirstCount: number;
  readIfNeededCount: number;
  sliceCandidateCount: number;
  knownProblemCount: number;
  issueCount: number;
}

export interface SessionStartDocsReadMap {
  taskId: string;
  command: string;
  source: { registryPath: '.hadara/docs-registry.json'; registryPresent: boolean; inferred: boolean };
  task: { capsulePath: string | null; capsulePresent: boolean; title: string | null };
  readFirstCount: number;
  readFirstTotalCount: number;
  readIfNeededCount: number;
  doNotReadByDefaultCount: number;
  driftWarningCount: number;
  driftWarningTotalCount: number;
  sourceDocumentDriftCount: number;
  readFirst: Array<Pick<DocsReadMapEntry, 'path' | 'readTier' | 'authority' | 'reason'>>;
  driftWarnings: DocsDriftWarning[];
  sourceDocumentDrift: Array<{ code: string; message: string; path?: string; heading?: string }>;
  issues: Array<{ severity: 'warning' | 'error'; code: string; message: string; path?: string }>;
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
  guidance: SessionStartGuidance;
  docsReadMap?: SessionStartDocsReadMap;
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

function hadaraCommand(command: string): string {
  return `hadara ${command}`;
}

function normalizeUserCommand(command: string): string {
  return command
    .replace(/^node dist\/cli\/main\.js\s+/, 'hadara ')
    .replace(/^dist\/cli\/main\.js\s+/, 'hadara ');
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
  const taskId = contextPack.taskId ?? input.taskId ?? stateProjection.activeTask ?? selectTaskFromTaskBoard(input.projectRoot);
  const issues = [...contextPack.issues];
  const lifecycle = lifecycleForSessionStart(taskId, contextPack);
  const guidance = guidanceForSessionStart({
    taskId,
    contextPack,
    lifecycle,
    allowLiveContextPack: Boolean(input.allowLiveContextPack)
  });
  const docsReadMap = taskId ? createSessionStartDocsReadMap(input.projectRoot, taskId, input.budget?.maxReadFirstItems ?? 7) : undefined;
  const knownProblems = contextPack.knownProblems;

  return {
    schemaVersion: SESSION_START_SCHEMA_ID,
    command: SESSION_START_COMMAND,
    ok: contextPack.ok && issues.every((issue) => issue.severity !== 'error'),
    generatedAt,
    projectRoot: input.projectRoot,
    currentState: {
      ...(stateProjection.activeTask || taskId ? { activeTask: stateProjection.activeTask ?? taskId } : {}),
      ...(stateProjection.latestCompletedTask ? { latestCompletedTask: stateProjection.latestCompletedTask } : {}),
      ...(taskId ? { recommendedNextTask: taskId } : {}),
      ...(stateProjection.releaseState ? { releaseState: stateProjection.releaseState } : {}),
      source: 'task-context'
    },
    contextPack,
    lifecycle,
    guidance,
    ...(docsReadMap ? { docsReadMap } : {}),
    knownProblems,
    sourceSummary: contextPack.sourceSummary,
    cache: contextPack.cache,
    summary: {
      degraded: contextPack.sourceSummary.degraded || issues.some((issue) => issue.severity !== 'info'),
      readFirstCount: contextPack.readFirst.length,
      readIfNeededCount: contextPack.readIfNeeded.length,
      sliceCandidateCount: contextPack.sliceCandidates.length,
      knownProblemCount: knownProblems.length,
      issueCount: issues.length
    },
    issues
  };
}

function selectTaskFromTaskBoard(projectRoot: string): string | undefined {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoardPath)) return undefined;
  const parsed = parseTaskBoard(fs.readFileSync(taskBoardPath, 'utf8'));
  const active = parsed.rows.find((row) => /^(in progress|active)$/i.test(row.status.trim()));
  return active?.id ?? parsed.rows.find((row) => !/^(done|superseded|archived)$/i.test(row.status.trim()))?.id;
}

function createSessionStartDocsReadMap(projectRoot: string, taskId: string, maxReadFirst: number): SessionStartDocsReadMap {
  const readMap = createDocsReadMapReport(projectRoot, taskId);
  const readFirst = readMap.readFirst.slice(0, maxReadFirst).map((entry) => ({
    path: entry.path,
    readTier: entry.readTier,
    authority: entry.authority,
    reason: entry.reason
  }));
  const driftWarnings = readMap.driftWarnings.slice(0, 10);
  const sourceValidation = validateTaskCapsule(projectRoot, taskId, { level: 'done' });
  const sourceDocumentDrift = sourceValidation.issues
    .filter((issue) => issue.code === 'TASK_SOURCE_DOCUMENT_CHANGED' || issue.code === 'TASK_SOURCE_DOCUMENT_MISSING_HASH')
    .map((issue) => ({
      code: issue.code,
      message: issue.message,
      ...(issue.path ? { path: issue.path } : {}),
      ...(issue.heading ? { heading: issue.heading } : {})
    }));
  return {
    taskId: readMap.taskId,
    command: hadaraCommand(`docs read-map --task ${taskId} --json`),
    source: readMap.source,
    task: readMap.task,
    readFirstCount: readFirst.length,
    readFirstTotalCount: readMap.readFirst.length,
    readIfNeededCount: readMap.readIfNeeded.length,
    doNotReadByDefaultCount: readMap.doNotReadByDefault.length,
    driftWarningCount: driftWarnings.length,
    driftWarningTotalCount: readMap.driftWarnings.length,
    sourceDocumentDriftCount: sourceDocumentDrift.length,
    readFirst,
    driftWarnings,
    sourceDocumentDrift,
    issues: readMap.issues.map((issue) => ({
      severity: issue.severity,
      code: issue.code,
      message: issue.message,
      ...(issue.path ? { path: issue.path } : {})
    }))
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
        hadaraCommand(`task status --task ${taskId} --json`),
        hadaraCommand(`docs read-map --task ${taskId} --json`)
      ]
    : [hadaraCommand('task status --json')];

  for (const suggestion of contextPack.validateWith) {
    const command = normalizeUserCommand(suggestion.command);
    if (suggestion.requiredForClose && !primaryNextCommands.includes(command)) {
      primaryNextCommands.push(command);
    }
  }

  const diagnosticCommands = [
    hadaraCommand('context cache status --json'),
    taskId
      ? hadaraCommand(`context graph --task ${taskId} --json`)
      : hadaraCommand('context graph --json'),
    taskId
      ? hadaraCommand(`docs read-map --task ${taskId} --json`)
      : hadaraCommand('task status --json')
  ];

  return {
    primaryNextCommands,
    diagnosticCommands
  };
}

function guidanceForSessionStart(input: {
  taskId?: string;
  contextPack: ContextPackReport;
  lifecycle: SessionStartLifecycle;
  allowLiveContextPack: boolean;
}): SessionStartGuidance {
  const mode: SessionStartMode = input.allowLiveContextPack
    ? 'live-context-pack'
    : input.contextPack.cache.used
      ? 'warm-cache'
      : 'bounded-no-live';
  const taskId = input.taskId;
  const taskRequired = !taskId;
  const primaryNextAction: SessionStartPrimaryNextAction = taskRequired ? 'select-task' : 'inspect-task';
  const reason = taskRequired
    ? 'No task id was supplied, so bounded Session Start returned task-selection guidance without running live graph discovery.'
    : mode === 'warm-cache'
      ? 'Session Start used proven-fresh warm cache and preserved read-only behavior.'
      : mode === 'live-context-pack'
        ? 'Session Start used explicit live context-pack discovery because --live was supplied.'
        : 'Session Start used the bounded no-live packet and avoided broad live graph discovery.';
  const commands: SessionStartGuidanceCommand[] = [];
  let primaryAction: SessionStartPrimaryAction;

  if (!taskId) {
    primaryAction = {
      id: 'task-status',
      label: 'Select the next task',
      command: hadaraCommand('task status --json'),
      args: ['task', 'status', '--json'],
      reason: 'No task id is available, so the next useful step is to select a concrete task before reading task-scoped context.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'agent-worker'
    };
    commands.push({
      id: 'task-status',
      command: hadaraCommand('task status --json'),
      args: ['task', 'status', '--json'],
      reason: 'Choose the next task before requesting task-scoped context.'
    });
  } else {
    primaryAction = {
      id: 'task-status',
      label: 'Inspect task loop phase',
      command: hadaraCommand(`task status --task ${taskId} --json`),
      args: ['task', 'status', '--task', taskId, '--json'],
      reason: 'A task id is available, so the fastest safe first step is to inspect loop phase, blockers, and the primary next action before editing files.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'agent-worker'
    };
    commands.push({
      id: 'task-status',
      command: hadaraCommand(`task status --task ${taskId} --json`),
      args: ['task', 'status', '--task', taskId, '--json'],
      reason: 'Inspect task readiness, evidence, loop phase, and the primary next action.'
    });
    commands.push({
      id: 'docs-read-map',
      command: hadaraCommand(`docs read-map --task ${taskId} --json`),
      args: ['docs', 'read-map', '--task', taskId, '--json'],
      reason: 'Inspect registry-backed task reading guidance and drift warnings before broad manual reads.'
    });
  }

  commands.push({
    id: 'cache-warm',
    command: hadaraCommand('context cache warm --json'),
    args: ['context', 'cache', 'warm', '--json'],
    reason: 'Preview stale cache shards without writing cache.'
  });

  commands.push(taskId
    ? {
        id: 'context-graph',
        command: hadaraCommand(`context graph --task ${taskId} --json`),
        args: ['context', 'graph', '--task', taskId, '--json'],
        reason: 'Opt into explicit graph diagnostics only when task status and docs read-map are insufficient.'
      }
    : {
        id: 'task-status',
        command: hadaraCommand('task status --json'),
        args: ['task', 'status', '--json'],
        reason: 'Select a concrete task before requesting task-scoped context.'
      });

  return {
    mode,
    primaryNextAction,
    primaryAction,
    whyThisNow: primaryAction.reason,
    avoidForNow: taskId
      ? [
          'Do not run task close before reviewing lifecycle blockers and required reads.',
          'Do not opt into --live context reads unless the bounded or warm packet is insufficient.'
        ]
      : [
          'Do not infer a task id from broad project files.',
          'Do not run live context discovery before selecting a task.'
        ],
    nextCommandArgs: primaryAction.args,
    reason,
    taskRequired,
    liveContextPackAvailable: false,
    commands
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
        message: 'The historical bounded session-start adapter used the bounded no-live context pack envelope. Use task status and docs read-map for public task ingress.',
        fixHint: 'Run hadara context cache warm --execute --json before relying on broad graph-backed session context.'
      }]
    : [{
        severity: 'warning',
        code: 'CONTEXT_PACK_TASK_NOT_FOUND',
        message: 'No task id was supplied. The historical bounded session-start adapter returned task-selection guidance without running live project discovery.',
        fixHint: 'Run hadara task status --json, then use hadara task status --task <task-id> --json and docs read-map when file-routing context is needed.'
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
          command: hadaraCommand(`task status --task ${input.taskId} --detail full --json`),
          reason: 'Done-level readiness is required before closing this task.',
          requiredForClose: true,
          source: 'evidence-history'
        }]
      : [],
    writeBoundaries: [],
    sliceCandidates: [],
    agentActions: [],
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
