import fs from 'node:fs';
import path from 'node:path';
import type {
  ContextCacheMetadata,
  ContextConfidence,
  ContextGraphEdge,
  ContextGraphNode,
  ContextGraphNodeType,
  ContextGraphReport,
  ContextStateProjectionSummary,
  StateConsistencyIssue
} from './context-graph';
import { buildContextGraphReport } from './context-graph-builder';
import { isContextSliceProjectRelativePath, normalizeContextSliceInputPath } from './context-slice-boundary';
import { createTaskNodeId, hashContextGraphText } from './extractor-contract';
import { createDocsReadMapReport, type DocsReadMapEntry, type DocsReadMapReport } from '../services/docs-registry';

export const CONTEXT_PACK_SCHEMA_ID = 'hadara.contextPack.v1' as const;
export const CONTEXT_PACK_COMMAND = 'context.pack' as const;

export const CONTEXT_PACK_DEFAULT_BUDGET: ContextBudget = {
  maxReadFirstItems: 7,
  mode: 'bounded'
};

export type ContextPackSchemaVersion = typeof CONTEXT_PACK_SCHEMA_ID;
export type ContextPackCommand = typeof CONTEXT_PACK_COMMAND;
export type ContextBudgetMode = 'minimal' | 'bounded' | 'expanded';
export type ContextPackItemType = ContextGraphNodeType;
export type ContextPackRawSliceAccess = 'sliceable' | 'not-sliceable' | 'not-applicable';
export type ContextPackIssueCode =
  | 'CONTEXT_PACK_TASK_NOT_FOUND'
  | 'CONTEXT_PACK_GRAPH_UNAVAILABLE'
  | 'CONTEXT_PACK_CODE_INDEX_UNAVAILABLE'
  | 'CONTEXT_PACK_STATE_PROJECTION_UNAVAILABLE'
  | 'CONTEXT_PACK_BUDGET_TRUNCATED'
  | 'CONTEXT_PACK_DEGRADED';

export interface ContextBudget {
  targetTokens?: number;
  maxItems?: number;
  maxReadFirstItems: number;
  mode: ContextBudgetMode;
}

export interface ContextPackItem {
  id: string;
  type: ContextPackItemType;
  path?: string;
  lineStart?: number;
  lineEnd?: number;
  title?: string;
  reason: string;
  confidence: ContextConfidence;
  sourceHash?: string;
  estimatedTokens?: number;
  required: boolean;
  sourceAccess?: {
    rawSlice: ContextPackRawSliceAccess;
    reason: string;
  };
}

export interface ValidationSuggestion {
  command: string;
  reason: string;
  requiredForClose: boolean;
  source: 'task-tests' | 'command-registry' | 'evidence-history' | 'release-readiness' | 'heuristic';
}

export interface WriteBoundaryHint {
  path: string;
  boundary:
    | 'read-only'
    | 'agent-freeform'
    | 'managed-section'
    | 'append-only'
    | 'dry-run-first'
    | 'release-mutation';
  reason: string;
}

export interface SliceCandidate {
  id: string;
  path: string;
  strategy:
    | 'explicit-range'
    | 'symbol-neighborhood'
    | 'keyword-window'
    | 'tail-window'
    | 'diff-hunk'
    | 'managed-section';
  lineStart?: number;
  lineEnd?: number;
  symbol?: string;
  managedSection?: string;
  reason: string;
  suggestedCommand: string;
  suggestedCommandArgs: string[];
}

export type ContextPackAgentActionKind = 'read-first' | 'slice' | 'validate';

export interface ContextPackAgentAction {
  id: string;
  kind: ContextPackAgentActionKind;
  priority: number;
  reason: string;
  command: string;
  commandArgs?: string[];
  sourceItemId?: string;
  sliceCandidateId?: string;
  path?: string;
  writeBoundary: 'read-only';
}

export interface ContextPackSourceSummary {
  graphAvailable: boolean;
  codeIndexAvailable: boolean;
  stateProjectionAvailable: boolean;
  docsRegistryAvailable: boolean;
  commandRegistryAvailable: boolean;
  degraded: boolean;
  graphSourceHash?: string;
  sourcesRead?: number;
  docsReadMapAvailable?: boolean;
  docsReadMapReadFirstCount?: number;
  docsReadMapDoNotReadByDefaultCount?: number;
}

export interface ContextPackStateProjection extends ContextStateProjectionSummary {
  issues: StateConsistencyIssue[];
}

export interface ContextPackIssue {
  severity: 'info' | 'warning' | 'error';
  code: ContextPackIssueCode;
  message: string;
  path?: string;
  fixHint?: string;
}

export interface ContextPackReport {
  schemaVersion: ContextPackSchemaVersion;
  command: ContextPackCommand;
  ok: boolean;
  generatedAt: string;
  taskId?: string;
  projectRoot: string;
  budget: ContextBudget;
  readFirst: ContextPackItem[];
  readIfNeeded: ContextPackItem[];
  doNotReadByDefault: ContextPackItem[];
  validateWith: ValidationSuggestion[];
  writeBoundaries: WriteBoundaryHint[];
  sliceCandidates: SliceCandidate[];
  agentActions: ContextPackAgentAction[];
  knownProblems: ContextPackItem[];
  stateProjection: ContextPackStateProjection;
  sourceSummary: ContextPackSourceSummary;
  cache: ContextCacheMetadata;
  issues: ContextPackIssue[];
}

export interface BuildContextPackReportOptions {
  projectRoot: string;
  generatedAt?: string;
  taskId?: string;
  budget?: Partial<ContextBudget>;
  graphReport?: ContextGraphReport;
  includeCode?: boolean;
  cache?: ContextCacheMetadata;
  docsReadMap?: DocsReadMapReport;
}

interface RankedNode {
  node: ContextGraphNode;
  reason: string;
  confidence: ContextConfidence;
  score: number;
}

export function buildContextPackReport(input: BuildContextPackReportOptions): ContextPackReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const budget = normalizeContextBudget(input.budget);
  const graphReport = input.graphReport ?? buildContextGraphReport({
    projectRoot: input.projectRoot,
    generatedAt,
    includeCode: input.includeCode,
    ...(input.taskId ? { taskId: input.taskId, mode: 'task' } : { mode: 'full' })
  });
  const taskId = input.taskId ?? graphReport.taskId ?? graphReport.stateProjection.summary.activeTask;
  const issues: ContextPackIssue[] = [];

  const taskNode = taskId ? findTaskNode(graphReport.nodes, taskId) : undefined;
  if (!taskId || !taskNode) {
    issues.push({
      severity: 'error',
      code: 'CONTEXT_PACK_TASK_NOT_FOUND',
      message: taskId
        ? `Context pack could not find task ${taskId} in the context graph.`
        : 'Context pack requires a task id or active task from state projection.',
      fixHint: 'Pass --task <task-id> once the public context pack command exists, or repair project active task state.'
    });
  }
  if (!graphReport.stateProjection) {
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_PACK_STATE_PROJECTION_UNAVAILABLE',
      message: 'Context graph did not include a state projection.',
      fixHint: 'Rebuild the context graph with state projection extraction enabled.'
    });
  }
  if (graphReport.summary.degraded) {
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_PACK_DEGRADED',
      message: 'Context graph is degraded; context pack output may be partial.'
    });
  }
  if (input.includeCode && !codeIndexAvailable(graphReport)) {
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_PACK_CODE_INDEX_UNAVAILABLE',
      message: 'Code-aware context pack was requested, but code index output is unavailable.',
      fixHint: 'Build the graph with includeCode enabled after C2 code index support is available.'
    });
  }

  const connectedIds = taskId ? connectedNodeIds(graphReport.edges, createTaskNodeId(taskId)) : new Set<string>();
  const docsReadMap = resolveDocsReadMap(input, taskId);
  const readMapExcludedPaths = new Set((docsReadMap?.doNotReadByDefault ?? []).map((entry) => entry.path));
  const rankedNodes = rankContextPackNodes(graphReport.nodes, graphReport.edges, connectedIds, taskNode);
  const readFirstRanked = rankedNodes
    .filter((ranked) => isReadFirstAllowed(ranked.node))
    .filter((ranked) => !isExcludedByReadMap(ranked.node, readMapExcludedPaths));
  const graphReadFirst = readFirstRanked.map((ranked) => itemFromRankedNode(ranked, true, input.projectRoot));
  const readFirstCandidates = mergeContextPackItems([
    ...graphReadFirst.filter((item) => item.id === `task:${taskId}`),
    ...readMapItems(docsReadMap?.readFirst ?? [], input.projectRoot, true),
    ...graphReadFirst.filter((item) => item.id !== `task:${taskId}`)
  ]);
  const readFirst = readFirstCandidates.slice(0, budget.maxReadFirstItems);
  if (readFirstCandidates.length > readFirst.length) {
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_PACK_BUDGET_TRUNCATED',
      message: `Context pack readFirst items were truncated from ${readFirstCandidates.length} to ${readFirst.length}.`
    });
  }

  const selectedIds = new Set(readFirst.map((item) => item.id));
  const selectedPaths = new Set(readFirst.map((item) => item.path).filter((value): value is string => Boolean(value)));
  const maxReadIfNeeded = Math.max(0, (budget.maxItems ?? 30) - readFirst.length);
  const readIfNeededRanked = rankedNodes
    .filter((ranked) => !selectedIds.has(ranked.node.id) && (!ranked.node.path || !selectedPaths.has(ranked.node.path)))
    .filter((ranked) => !isExcludedByReadMap(ranked.node, readMapExcludedPaths))
    .filter((ranked) => !isDoNotReadByDefault(ranked.node));
  const readIfNeededCandidates = mergeContextPackItems([
    ...readMapItems(docsReadMap?.readIfNeeded ?? [], input.projectRoot, false),
    ...readIfNeededRanked.map((ranked) => itemFromRankedNode(ranked, false, input.projectRoot))
  ]).filter((item) => !selectedIds.has(item.id) && (!item.path || !selectedPaths.has(item.path)));
  const readIfNeeded = readIfNeededCandidates.slice(0, maxReadIfNeeded);
  if (readIfNeededCandidates.length > readIfNeeded.length) {
    issues.push({
      severity: 'warning',
      code: 'CONTEXT_PACK_BUDGET_TRUNCATED',
      message: `Context pack readIfNeeded items were truncated from ${readIfNeededCandidates.length} to ${readIfNeeded.length}.`
    });
  }

  const doNotReadByDefault = graphReport.nodes
    .filter((node) => node.type === 'Document')
    .filter(isDoNotReadByDefault)
    .map((node) => itemFromRankedNode({
      node,
      reason: 'Historical, archived, superseded, or excluded document is not read by default.',
      confidence: 'derived',
      score: 0
    }, false, input.projectRoot))
    .sort(compareItems);

  const knownProblems = graphReport.nodes
    .filter((node) => node.type === 'KnownProblem')
    .map((node) => itemFromRankedNode({
      node,
      reason: 'Current project handoff records this known problem.',
      confidence: 'explicit',
      score: 0
    }, false, input.projectRoot))
    .sort(compareItems);

  const validateWith = validationSuggestionsForTask(taskId, graphReport);
  const writeBoundaries = writeBoundariesForItems([...readFirst, ...readIfNeeded], graphReport.nodes);
  const sliceCandidates = sliceCandidatesForItems([...readFirst, ...readIfNeeded], graphReport.nodes);
  const agentActions = agentActionsForContextPack(readFirst, sliceCandidates, validateWith, taskId);
  const cache = input.cache ?? graphReport.cache ?? { used: false, hit: false };
  return {
    schemaVersion: CONTEXT_PACK_SCHEMA_ID,
    command: CONTEXT_PACK_COMMAND,
    ok: issues.every((issue) => issue.severity !== 'error'),
    generatedAt,
    ...(taskId ? { taskId } : {}),
    projectRoot: input.projectRoot,
    budget,
    readFirst,
    readIfNeeded,
    doNotReadByDefault,
    validateWith,
    writeBoundaries,
    sliceCandidates,
    agentActions,
    knownProblems,
    stateProjection: {
      ...graphReport.stateProjection.summary,
      issues: graphReport.stateProjection.issues
    },
    sourceSummary: {
      graphAvailable: true,
      codeIndexAvailable: codeIndexAvailable(graphReport),
      stateProjectionAvailable: true,
      docsRegistryAvailable: Boolean(docsReadMap?.source.registryPresent) || graphReport.stateProjection.sources.some((source) => source.kind === 'docs-registry'),
      commandRegistryAvailable: graphReport.nodes.some((node) => node.type === 'Command'),
      degraded: graphReport.summary.degraded || issues.some((issue) => issue.severity !== 'info'),
      graphSourceHash: graphReport.sourceHash,
      sourcesRead: graphReport.summary.sourcesRead,
      docsReadMapAvailable: Boolean(docsReadMap),
      docsReadMapReadFirstCount: docsReadMap?.readFirst.length ?? 0,
      docsReadMapDoNotReadByDefaultCount: docsReadMap?.doNotReadByDefault.length ?? 0
    },
    cache,
    issues
  };
}

function resolveDocsReadMap(input: BuildContextPackReportOptions, taskId: string | undefined): DocsReadMapReport | undefined {
  if (input.docsReadMap) return input.docsReadMap;
  if (input.graphReport || !taskId) return undefined;
  if (!fs.existsSync(path.join(input.projectRoot, '.hadara', 'docs-registry.json'))) return undefined;
  return createDocsReadMapReport(input.projectRoot, taskId);
}

function readMapItems(entries: DocsReadMapEntry[], projectRoot: string, required: boolean): ContextPackItem[] {
  return [...entries].sort(compareReadMapEntriesForContextPack).map((entry) => {
    const sourceHash = sourceHashForPath(projectRoot, entry.path);
    return {
      id: `doc:${entry.path}`,
      type: 'Document',
      path: entry.path,
      title: entry.title,
      reason: `Docs read-map ${entry.readTier}: ${entry.reason}`,
      confidence: entry.readTier === 'active-task' || entry.readTier === 'active-spec' ? 'explicit' : 'derived',
      ...(sourceHash ? { sourceHash } : {}),
      estimatedTokens: estimateTokensForPath(entry.path, entry.title),
      required,
      sourceAccess: sourceAccessForPath(entry.path)
    };
  });
}

function compareReadMapEntriesForContextPack(a: DocsReadMapEntry, b: DocsReadMapEntry): number {
  return readMapTierPriority(a.readTier) - readMapTierPriority(b.readTier) || a.path.localeCompare(b.path);
}

function readMapTierPriority(tier: DocsReadMapEntry['readTier']): number {
  if (tier === 'active-task') return 0;
  if (tier === 'active-spec') return 1;
  if (tier === 'current-state') return 2;
  if (tier === 'workflow-reference') return 3;
  if (tier === 'conditional-reference') return 4;
  if (tier === 'implemented-reference') return 5;
  if (tier === 'drift-review') return 6;
  if (tier === 'historical') return 7;
  return 8;
}

function mergeContextPackItems(items: ContextPackItem[]): ContextPackItem[] {
  const seenIds = new Set<string>();
  const seenPaths = new Set<string>();
  const merged: ContextPackItem[] = [];
  for (const item of items) {
    if (seenIds.has(item.id)) continue;
    if (item.path && seenPaths.has(item.path)) continue;
    seenIds.add(item.id);
    if (item.path) seenPaths.add(item.path);
    merged.push(item);
  }
  return merged;
}

function isExcludedByReadMap(node: ContextGraphNode, excludedPaths: Set<string>): boolean {
  return Boolean(node.path && excludedPaths.has(node.path));
}

function normalizeContextBudget(input: Partial<ContextBudget> = {}): ContextBudget {
  const maxReadFirstItems = positiveInteger(input.maxReadFirstItems) ?? CONTEXT_PACK_DEFAULT_BUDGET.maxReadFirstItems;
  return {
    ...(input.targetTokens !== undefined ? { targetTokens: input.targetTokens } : {}),
    ...(input.maxItems !== undefined ? { maxItems: input.maxItems } : {}),
    maxReadFirstItems,
    mode: input.mode ?? CONTEXT_PACK_DEFAULT_BUDGET.mode
  };
}

function positiveInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined;
}

function rankContextPackNodes(
  nodes: ContextGraphNode[],
  edges: ContextGraphEdge[],
  connectedIds: Set<string>,
  taskNode?: ContextGraphNode
): RankedNode[] {
  const ranked = new Map<string, RankedNode>();
  if (taskNode) {
    ranked.set(taskNode.id, {
      node: taskNode,
      reason: 'Read the active task capsule first; it defines scope, acceptance, test expectations, and close handoff for this task.',
      confidence: 'explicit',
      score: 1000
    });
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  for (const edge of edges) {
    if (!connectedIds.has(edge.from) && !connectedIds.has(edge.to)) continue;
    for (const nodeId of [edge.from, edge.to]) {
      const node = nodeById.get(nodeId);
      if (!node || node.type === 'Task') continue;
      upsertRankedNode(ranked, {
        node,
        reason: concreteRankReason(node, edge.reason),
        confidence: edge.confidence,
        score: nodeScore(node, edge.confidence, connectedIds.has(node.id))
      });
    }
  }

  for (const node of nodes) {
    if (node.type !== 'Document' || ranked.has(node.id)) continue;
    if (metadataBoolean(node, 'requiredReading')) {
      upsertRankedNode(ranked, {
        node,
        reason: 'Required current-state document from the docs registry; read after task-local context if the task needs this surface.',
        confidence: 'explicit',
        score: nodeScore(node, 'explicit', false) - 25
      });
    }
  }

  return Array.from(ranked.values()).sort(compareRankedNodes);
}

function upsertRankedNode(ranked: Map<string, RankedNode>, candidate: RankedNode): void {
  const existing = ranked.get(candidate.node.id);
  if (!existing || compareRankedNodes(candidate, existing) < 0) {
    ranked.set(candidate.node.id, candidate);
  }
}

function nodeScore(node: ContextGraphNode, confidence: ContextConfidence, connected: boolean): number {
  const confidenceScore = confidence === 'explicit' ? 80 : confidence === 'derived' ? 50 : 20;
  const connectedScore = connected ? 25 : 0;
  const taskLocalScore = node.path?.startsWith('tasks/') ? 140 : 0;
  const sourceScore = ['SourceFile', 'TestFile', 'Symbol'].includes(node.type) ? 40 : 0;
  const typeScore: Record<ContextGraphNodeType, number> = {
    Task: 1000,
    Document: 700,
    ManagedSection: 680,
    Command: 620,
    KnownProblem: 600,
    Evidence: 550,
    ReleaseCheck: 520,
    Decision: 500,
    SourceFile: 480,
    TestFile: 460,
    Symbol: 440,
    FixtureFile: 380,
    ConfigFile: 360
  };
  return typeScore[node.type] + confidenceScore + connectedScore + taskLocalScore + sourceScore;
}

function concreteRankReason(node: ContextGraphNode, sourceReason: string): string {
  if (node.path?.startsWith('tasks/')) {
    return `Task-local file connected to the active task; read it before broad project history. ${sourceReason}`;
  }
  if (node.type === 'SourceFile') {
    return `Implementation file connected to the active task; inspect it when changing code. ${sourceReason}`;
  }
  if (node.type === 'TestFile') {
    return `Test file connected to the active task; inspect it when planning or verifying changes. ${sourceReason}`;
  }
  if (node.type === 'Symbol') {
    return `Specific symbol connected to the active task; prefer this bounded location over opening the full file. ${sourceReason}`;
  }
  if (node.type === 'KnownProblem') {
    return `Current handoff problem relevant to this task; check whether it changes implementation or validation. ${sourceReason}`;
  }
  if (node.type === 'Command') {
    return `Command surface connected to this task; use it to choose dry-run/read-only validation before mutation. ${sourceReason}`;
  }
  return sourceReason;
}

function isReadFirstAllowed(node: ContextGraphNode): boolean {
  if (isDoNotReadByDefault(node)) return false;
  return ['Task', 'Document', 'ManagedSection', 'Command', 'SourceFile', 'TestFile', 'Symbol', 'KnownProblem'].includes(node.type);
}

function isDoNotReadByDefault(node: ContextGraphNode): boolean {
  const status = String(node.status ?? '').toLowerCase();
  const kind = String(node.kind ?? '').toLowerCase();
  const readWhen = Array.isArray(node.metadata?.readWhen) ? node.metadata.readWhen.map(String) : [];
  return status === 'archived'
    || status === 'superseded'
    || kind.includes('historical')
    || readWhen.includes('historical')
    || readWhen.includes('never-default')
    || (metadataBoolean(node, 'requiredReading') === false && kind.includes('archive'));
}

function itemFromRankedNode(ranked: RankedNode, required: boolean, projectRoot: string): ContextPackItem {
  const line = ranked.node.source.line;
  const sourceHash = sourceHashForItem(projectRoot, ranked.node);
  return {
    id: ranked.node.id,
    type: ranked.node.type,
    ...(ranked.node.path ? { path: ranked.node.path } : {}),
    ...(line ? { lineStart: line, lineEnd: line } : {}),
    title: ranked.node.label,
    reason: ranked.reason,
    confidence: ranked.confidence,
    ...(sourceHash ? { sourceHash } : {}),
    ...(ranked.node.path ? { estimatedTokens: estimateTokens(ranked.node) } : {}),
    required,
    sourceAccess: sourceAccessForNode(ranked.node)
  };
}

function sourceHashForItem(projectRoot: string, node: ContextGraphNode): string | undefined {
  if (!node.path || !isContextSliceProjectRelativePath(node.path)) return node.source.hash;
  return sourceHashForPath(projectRoot, node.path) ?? node.source.hash;
}

function sourceHashForPath(projectRoot: string, relativePath: string): string | undefined {
  if (!isContextSliceProjectRelativePath(relativePath)) return undefined;
  const normalized = normalizeContextSliceInputPath(relativePath);
  const root = path.resolve(projectRoot);
  const absolutePath = path.resolve(root, normalized);
  if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) return undefined;
  try {
    const stat = fs.statSync(absolutePath);
    if (!stat.isFile()) return undefined;
    return hashContextGraphText(fs.readFileSync(absolutePath, 'utf8'));
  } catch {
    return undefined;
  }
}

function sourceAccessForNode(node: ContextGraphNode): ContextPackItem['sourceAccess'] {
  if (!node.path) {
    return {
      rawSlice: 'not-applicable',
      reason: 'This context item has no project file path for raw context slicing.'
    };
  }
  return sourceAccessForPath(node.path);
}

function sourceAccessForPath(relativePath: string): ContextPackItem['sourceAccess'] {
  if (isContextSliceProjectRelativePath(relativePath)) {
    return {
      rawSlice: 'sliceable',
      reason: 'This item path is inside the raw context-slice read boundary.'
    };
  }
  return {
    rawSlice: 'not-sliceable',
    reason: 'This item remains graph context, but its path is outside the raw context-slice read boundary.'
  };
}

function estimateTokens(node: ContextGraphNode): number {
  const labelCost = Math.ceil(node.label.length / 4);
  const pathCost = node.path ? Math.ceil(node.path.length / 4) : 0;
  return Math.max(24, labelCost + pathCost + 16);
}

function estimateTokensForPath(relativePath: string, title: string): number {
  return Math.max(24, Math.ceil(title.length / 4) + Math.ceil(relativePath.length / 4) + 16);
}

function validationSuggestionsForTask(taskId: string | undefined, graphReport: ContextGraphReport): ValidationSuggestion[] {
  const suggestions = new Map<string, ValidationSuggestion>();
  if (taskId) {
    suggestions.set(`ready:${taskId}`, {
      command: `node dist/cli/main.js task ready --task ${taskId} --level done --json`,
      reason: 'Done-level readiness is required before closing this task.',
      requiredForClose: true,
      source: 'evidence-history'
    });
  }
  for (const suggestion of graphReport.taskContext?.validationSuggestions ?? []) {
    const source = suggestion.includes('npm run') || suggestion.includes('test')
      ? 'task-tests'
      : suggestion.includes('release')
        ? 'release-readiness'
        : 'heuristic';
    suggestions.set(suggestion, {
      command: suggestion,
      reason: 'Task context report suggested this validation command.',
      requiredForClose: false,
      source
    });
  }
  return Array.from(suggestions.values()).sort((a, b) => a.command.localeCompare(b.command));
}

function writeBoundariesForItems(items: ContextPackItem[], nodes: ContextGraphNode[]): WriteBoundaryHint[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const boundaries = new Map<string, WriteBoundaryHint>();
  for (const item of items) {
    if (!item.path) continue;
    const node = nodeById.get(item.id);
    const boundary = boundaryForPath(item.path, node);
    boundaries.set(item.path, {
      path: item.path,
      boundary,
      reason: boundaryReason(item.path, boundary)
    });
  }
  return Array.from(boundaries.values()).sort((a, b) => a.path.localeCompare(b.path));
}

function boundaryForPath(path: string, node?: ContextGraphNode): WriteBoundaryHint['boundary'] {
  if (path.endsWith('evidence.jsonl')) return 'append-only';
  if (path === 'docs/TASK_BOARD.md' || path.endsWith('/TASK.md')) return 'dry-run-first';
  if (node?.type === 'ManagedSection') return 'managed-section';
  if (path.startsWith('docs/') || path.startsWith('tasks/')) return 'agent-freeform';
  return 'read-only';
}

function boundaryReason(path: string, boundary: WriteBoundaryHint['boundary']): string {
  if (boundary === 'append-only') return 'Evidence files are append-only and must use the evidence writer.';
  if (boundary === 'dry-run-first') return `${path} has command-owned lifecycle fields; use dry-run-first lifecycle commands where applicable.`;
  if (boundary === 'managed-section') return 'Managed section edits must preserve HADARA markers.';
  if (boundary === 'agent-freeform') return 'Project documentation or task capsule prose can be edited by the agent within task scope.';
  return 'Read for context only; do not mutate from context routing commands.';
}

function sliceCandidatesForItems(items: ContextPackItem[], nodes: ContextGraphNode[]): SliceCandidate[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  return items
    .filter((item) => item.path)
    .filter((item) => isContextSliceProjectRelativePath(item.path))
    .filter((item) => ['Document', 'ManagedSection', 'SourceFile', 'TestFile', 'Symbol'].includes(item.type))
    .slice(0, 10)
    .map((item, index) => {
      const node = nodeById.get(item.id);
      const strategy = sliceStrategyForNode(node);
      const path = item.path as string;
      const range = explicitRangeForCandidate(item, node);
      const lineStart = range?.lineStart;
      const lineEnd = range?.lineEnd;
      const symbol = node?.type === 'Symbol' ? node.label : undefined;
      const managedSection = node?.type === 'ManagedSection' ? node.label : undefined;
      const suggestedCommandArgs = suggestedSliceCommandArgs(path, strategy, node, { lineStart, lineEnd, symbol, managedSection });
      return {
        id: `slice-candidate:${index + 1}:${item.id}`,
        path,
        strategy,
        ...(lineStart ? { lineStart } : {}),
        ...(lineEnd ? { lineEnd } : {}),
        ...(symbol ? { symbol } : {}),
        ...(managedSection ? { managedSection } : {}),
        reason: `Candidate slice for ${item.id} selected by context pack ranking.`,
        suggestedCommand: suggestedSliceCommand(suggestedCommandArgs),
        suggestedCommandArgs
      };
    });
}

function agentActionsForContextPack(
  readFirst: ContextPackItem[],
  sliceCandidates: SliceCandidate[],
  validateWith: ValidationSuggestion[],
  taskId: string | undefined
): ContextPackAgentAction[] {
  const actions: ContextPackAgentAction[] = [];
  const seenCommands = new Set<string>();

  const firstSliceableItem = readFirst.find((item) => item.path && item.sourceAccess?.rawSlice === 'sliceable');
  if (firstSliceableItem?.path) {
    const args = suggestedSliceCommandArgs(firstSliceableItem.path, 'explicit-range', undefined, {
      lineStart: firstSliceableItem.lineStart ?? 1,
      lineEnd: firstSliceableItem.lineEnd ?? Math.max(firstSliceableItem.lineStart ?? 1, (firstSliceableItem.lineStart ?? 1) + 80)
    });
    pushAgentAction(actions, seenCommands, {
      id: 'agent-action:read-first:1',
      kind: 'read-first',
      priority: 100,
      sourceItemId: firstSliceableItem.id,
      path: firstSliceableItem.path,
      reason: `Read the top context item ${firstSliceableItem.id} as a bounded raw slice before opening broader files.`,
      command: suggestedSliceCommand(args),
      commandArgs: args,
      writeBoundary: 'read-only'
    });
  }

  for (const [index, candidate] of sliceCandidates.slice(0, 3).entries()) {
    pushAgentAction(actions, seenCommands, {
      id: `agent-action:slice:${index + 1}`,
      kind: 'slice',
      priority: 90 - index,
      sliceCandidateId: candidate.id,
      path: candidate.path,
      reason: `Use this bounded slice candidate before reading the full file: ${candidate.reason}`,
      command: candidate.suggestedCommand,
      commandArgs: candidate.suggestedCommandArgs,
      writeBoundary: 'read-only'
    });
  }

  const requiredValidation = validateWith.find((suggestion) => suggestion.requiredForClose);
  if (requiredValidation) {
    pushAgentAction(actions, seenCommands, {
      id: 'agent-action:validate:required-close',
      kind: 'validate',
      priority: 50,
      reason: taskId
        ? `Run this read-only readiness check before planning close for ${taskId}.`
        : 'Run this read-only readiness check before planning close.',
      command: requiredValidation.command,
      writeBoundary: 'read-only'
    });
  }

  return actions.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
}

function pushAgentAction(
  actions: ContextPackAgentAction[],
  seenCommands: Set<string>,
  action: ContextPackAgentAction
): void {
  const key = action.commandArgs ? action.commandArgs.join('\0') : action.command;
  if (seenCommands.has(key)) return;
  seenCommands.add(key);
  actions.push(action);
}

function explicitRangeForCandidate(item: ContextPackItem, node: ContextGraphNode | undefined): { lineStart: number; lineEnd: number } | undefined {
  const lineStart = item.lineStart ?? numberMetadata(node, 'startLine') ?? node?.source.line ?? 1;
  const metadataEnd = numberMetadata(node, 'endLine');
  if (metadataEnd !== undefined && metadataEnd > lineStart) return { lineStart, lineEnd: metadataEnd };
  if (item.lineEnd !== undefined && item.lineEnd > lineStart) return { lineStart, lineEnd: item.lineEnd };
  return { lineStart, lineEnd: Math.max(lineStart, lineStart + 80) };
}

function sliceStrategyForNode(node: ContextGraphNode | undefined): SliceCandidate['strategy'] {
  if (node?.type === 'ManagedSection') return 'managed-section';
  if (node?.type === 'Symbol') return 'symbol-neighborhood';
  return 'explicit-range';
}

function suggestedSliceCommandArgs(
  path: string,
  strategy: SliceCandidate['strategy'],
  node: ContextGraphNode | undefined,
  hints: { lineStart?: number; lineEnd?: number; symbol?: string; managedSection?: string } = {}
): string[] {
  const base = ['context', 'slice', '--path', path];
  if (strategy === 'managed-section') return [...base, '--managed-section', hints.managedSection ?? node?.label ?? '<section-id>', '--json'];
  if (strategy === 'symbol-neighborhood') return [...base, '--symbol', hints.symbol ?? node?.label ?? '<symbol>', '--json'];
  const startLine = hints.lineStart ?? node?.source.line ?? 1;
  const endLine = hints.lineEnd ?? Math.max(startLine, startLine + 80);
  return [...base, '--from', String(startLine), '--to', String(endLine), '--json'];
}

function suggestedSliceCommand(args: string[]): string {
  return ['hadara', ...args].map(shellQuote).join(' ');
}

function shellQuote(value: string): string {
  if (/^[A-Za-z0-9_./:@+-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function numberMetadata(node: ContextGraphNode | undefined, key: string): number | undefined {
  const value = node?.metadata?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function findTaskNode(nodes: ContextGraphNode[], taskId: string): ContextGraphNode | undefined {
  const nodeId = createTaskNodeId(taskId);
  const matches = nodes.filter((node) => node.id === nodeId && node.type === 'Task');
  return matches.find((node) => node.kind === 'task-capsule') ?? matches[0];
}

function connectedNodeIds(edges: ContextGraphEdge[], taskNodeId: string): Set<string> {
  const ids = new Set<string>([taskNodeId]);
  for (const edge of edges) {
    if (edge.from === taskNodeId) ids.add(edge.to);
    if (edge.to === taskNodeId) ids.add(edge.from);
  }
  return ids;
}

function codeIndexAvailable(graphReport: ContextGraphReport): boolean {
  return graphReport.stateProjection.sources.some((source) => source.kind === 'code-index')
    || graphReport.nodes.some((node) => ['SourceFile', 'TestFile', 'Symbol'].includes(node.type));
}

function metadataBoolean(node: ContextGraphNode, key: string): boolean | undefined {
  const value = node.metadata?.[key];
  return typeof value === 'boolean' ? value : undefined;
}

function compareRankedNodes(a: RankedNode, b: RankedNode): number {
  return b.score - a.score || a.node.id.localeCompare(b.node.id);
}

function compareItems(a: ContextPackItem, b: ContextPackItem): number {
  return a.id.localeCompare(b.id);
}
