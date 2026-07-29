import type {
  ContextCacheMetadata,
  ContextCandidate,
  ContextGraphEdge,
  ContextGraphIssue,
  ContextGraphMode,
  ContextGraphNode,
  ContextGraphReport,
  ContextStateProjectionReport,
  GraphExtractionResult,
  StateConsistencyIssue,
  TaskContextReport
} from './context-graph';
import {
  collectContextGraphExtractorShards,
  createSourceManifestCacheAnalysis,
  readContextCodeIndexShard,
  readContextGraphCoreShard
} from './context-cache-store';
import {
  createTaskNodeId,
  hashContextGraphText,
  mergeGraphExtractionResults,
  summarizeContextGraphExtraction
} from './extractor-contract';
import {
  extractDecisions,
  extractManagedSections
} from './document-extractors';
import { extractEvidence } from './evidence-extractors';
import { extractCommandRegistry, extractDocsRegistry } from './registry-extractors';
import { extractReleaseReadiness } from './release-extractors';
import { createContextStateProjectionReport } from './state-projection';
import { extractTaskBoard, extractTaskCapsules } from './task-extractors';
import { codeIndexReportToGraphExtraction, extractCodeIndexGraph } from './code-graph-extractor';

export interface BuildContextGraphReportInput {
  projectRoot: string;
  generatedAt?: string;
  mode?: ContextGraphMode;
  taskId?: string;
  extractionResults?: GraphExtractionResult[];
  cache?: ContextCacheMetadata;
  includeCode?: boolean;
  cacheStrategy?: 'read-only' | 'disabled';
  codeStrategy?: ContextCodeStrategy;
}

export type ContextCodeStrategy = 'live-fallback' | 'fresh-cache-only';

interface CollectContextGraphExtractionsResult {
  extractionResults: GraphExtractionResult[];
  cache: ContextCacheMetadata;
}

interface CodeGraphExtractionWithCache {
  result: GraphExtractionResult;
  cache: ContextCacheMetadata;
}

export interface CreateTaskContextReportInput {
  taskId: string;
  nodes: ContextGraphNode[];
  edges: ContextGraphEdge[];
  stateProjection: ContextStateProjectionReport;
  issues: ContextGraphIssue[];
}

export function collectContextGraphExtractions(projectRoot: string, options: { includeCode?: boolean; generatedAt?: string } = {}): GraphExtractionResult[] {
  const results = [
    extractTaskCapsules(projectRoot),
    extractTaskBoard(projectRoot),
    extractDocsRegistry(projectRoot),
    extractCommandRegistry(projectRoot),
    extractManagedSections(projectRoot),
    extractDecisions(projectRoot),
    extractEvidence(projectRoot),
    extractReleaseReadiness(projectRoot)
  ];
  if (options.includeCode) results.push(extractCodeIndexGraph(projectRoot, options.generatedAt));
  return results;
}

export function collectContextGraphExtractionsWithCache(
  projectRoot: string,
  options: { includeCode?: boolean; generatedAt?: string; cacheStrategy?: 'read-only' | 'disabled'; codeStrategy?: ContextCodeStrategy; taskId?: string } = {}
): CollectContextGraphExtractionsResult {
  if (options.cacheStrategy === 'disabled') {
    return {
      extractionResults: collectContextGraphExtractions(projectRoot, options),
      cache: { used: false, hit: false }
    };
  }

  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const analysis = createSourceManifestCacheAnalysis({
    projectRoot,
    generatedAt,
    generatedByCommand: 'context.graph',
    allowAssumedHotOnFingerprintMismatch: Boolean(options.taskId)
  });
  const graphCore = readContextGraphCoreShard({ projectRoot, manifest: analysis.currentManifest });
  if (shouldUseBoundedStaleGraphCore({
    graphCore,
    staleExtractorKeys: analysis.staleExtractorKeys,
    stalePaths: [...analysis.comparison.addedPaths, ...analysis.comparison.changedPaths, ...analysis.comparison.removedPaths],
    taskId: options.taskId,
    assumedHot: analysis.fastPath === 'assumed-hot'
  })) {
    const graphCoreRecord = graphCore.record!;
    const results = [
      ...boundedLiveOverlayExtractions(projectRoot, {
        staleExtractorKeys: analysis.staleExtractorKeys,
        stalePaths: [
          ...analysis.comparison.addedPaths,
          ...analysis.comparison.changedPaths,
          ...analysis.comparison.removedPaths
        ],
        taskId: options.taskId
      }),
      graphCoreRecord.payload
    ];
    const code = options.includeCode
      ? collectCodeGraphExtractionWithCache(projectRoot, {
        manifest: analysis.currentManifest,
        generatedAt,
        strategy: options.codeStrategy ?? 'live-fallback'
      })
      : undefined;
    if (code) results.push(code.result);
    return {
      extractionResults: results,
      cache: {
        used: true,
        hit: false,
        mode: options.includeCode && code?.cache.hit ? 'graph-core-stale-bounded+code-index' : 'graph-core-stale-bounded',
        manifestHash: analysis.currentManifest.manifestHash,
        readShardCount: 1 + (code?.cache.readShardCount ?? 0),
        hitShardCount: code?.cache.hitShardCount ?? 0,
        missShardCount: code?.cache.missShardCount ?? 0,
        staleShardCount: 1 + (code?.cache.staleShardCount ?? 0),
        corruptShardCount: code?.cache.corruptShardCount ?? 0,
        schemaMismatchShardCount: code?.cache.schemaMismatchShardCount ?? 0,
        shardPaths: [graphCore.path, ...(code?.cache.shardPaths ?? [])].sort(),
        staleExtractorKeys: Array.from(new Set([...analysis.staleExtractorKeys, ...(code?.cache.staleExtractorKeys ?? [])])).sort(),
        createdAt: graphCoreRecord.createdAt,
        cachePath: graphCore.path,
        sourceManifestCacheFresh: analysis.cacheFresh,
        sourceManifestFastPath: analysis.fastPath,
        ...(analysis.fastPathReason ? { sourceManifestFastPathReason: analysis.fastPathReason } : {}),
        ...(analysis.fastPathStrategy ? { sourceManifestFastPathStrategy: analysis.fastPathStrategy } : {}),
        sourceManifestTrust: analysis.trust,
        sourceManifestFullManifestBuilt: analysis.fullManifestBuilt
      }
    };
  }
  if (graphCore.hit && graphCore.result) {
    const results = [graphCore.result];
    const code = options.includeCode
      ? collectCodeGraphExtractionWithCache(projectRoot, {
        manifest: analysis.currentManifest,
        generatedAt,
        strategy: options.codeStrategy ?? 'live-fallback'
      })
      : undefined;
    if (code) results.push(code.result);
    return {
      extractionResults: results,
      cache: {
        used: true,
        hit: true,
        mode: options.includeCode ? code?.cache.mode ?? 'graph-core+live-code' : 'graph-core',
        manifestHash: analysis.currentManifest.manifestHash,
        readShardCount: 1 + (code?.cache.readShardCount ?? 0),
        hitShardCount: 1 + (code?.cache.hitShardCount ?? 0),
        missShardCount: code?.cache.missShardCount ?? 0,
        staleShardCount: code?.cache.staleShardCount ?? 0,
        corruptShardCount: code?.cache.corruptShardCount ?? 0,
        schemaMismatchShardCount: code?.cache.schemaMismatchShardCount ?? 0,
        shardPaths: [graphCore.path, ...(code?.cache.shardPaths ?? [])].sort(),
        staleExtractorKeys: code?.cache.staleExtractorKeys ?? [],
        ...(graphCore.record ? { createdAt: graphCore.record.createdAt, cachePath: graphCore.path } : {}),
        sourceManifestCacheFresh: analysis.cacheFresh,
        sourceManifestFastPath: analysis.fastPath,
        ...(analysis.fastPathReason ? { sourceManifestFastPathReason: analysis.fastPathReason } : {}),
        ...(analysis.fastPathStrategy ? { sourceManifestFastPathStrategy: analysis.fastPathStrategy } : {}),
        sourceManifestTrust: analysis.trust,
        sourceManifestFullManifestBuilt: analysis.fullManifestBuilt
      }
    };
  }
  const shards = collectContextGraphExtractorShards({ projectRoot, manifest: analysis.currentManifest });
  const results = [
    extractTaskCapsules(projectRoot),
    shards.results.extractTaskBoard ?? extractTaskBoard(projectRoot),
    shards.results.extractDocsRegistry ?? extractDocsRegistry(projectRoot),
    shards.results.extractCommandRegistry ?? extractCommandRegistry(projectRoot),
    extractManagedSections(projectRoot),
    extractDecisions(projectRoot),
    extractEvidence(projectRoot),
    extractReleaseReadiness(projectRoot)
  ];
  const code = options.includeCode
    ? collectCodeGraphExtractionWithCache(projectRoot, {
      manifest: analysis.currentManifest,
      generatedAt,
      strategy: options.codeStrategy ?? 'live-fallback'
    })
    : undefined;
  if (code) results.push(code.result);
  return {
    extractionResults: results,
    cache: {
      ...mergeCodeCacheMetadata(shards.cache, code?.cache),
      sourceManifestCacheFresh: analysis.cacheFresh,
      sourceManifestFastPath: analysis.fastPath,
      ...(analysis.fastPathReason ? { sourceManifestFastPathReason: analysis.fastPathReason } : {}),
      ...(analysis.fastPathStrategy ? { sourceManifestFastPathStrategy: analysis.fastPathStrategy } : {}),
      sourceManifestTrust: analysis.trust,
      sourceManifestFullManifestBuilt: analysis.fullManifestBuilt
    }
  };
}

function collectCodeGraphExtractionWithCache(
  projectRoot: string,
  input: { manifest: Parameters<typeof readContextCodeIndexShard>[0]['manifest']; generatedAt: string; strategy: ContextCodeStrategy }
): CodeGraphExtractionWithCache {
  const read = readContextCodeIndexShard({ projectRoot, manifest: input.manifest });
  if (read.hit && read.result) {
    return {
      result: codeIndexReportToGraphExtraction(read.result),
      cache: {
        used: true,
        hit: true,
        mode: 'graph-core+code-index',
        manifestHash: input.manifest.manifestHash,
        readShardCount: 1,
        hitShardCount: 1,
        missShardCount: 0,
        staleShardCount: 0,
        corruptShardCount: 0,
        schemaMismatchShardCount: 0,
        shardPaths: [read.path],
        staleExtractorKeys: [],
        ...(read.record ? { createdAt: read.record.createdAt, cachePath: read.path } : {})
      }
    };
  }

  if (input.strategy === 'fresh-cache-only') {
    return {
      result: emptyCodeGraphExtractionResult(read.path),
      cache: {
        used: true,
        hit: false,
        mode: `graph-core+code-index-${read.status}`,
        manifestHash: input.manifest.manifestHash,
        readShardCount: 1,
        hitShardCount: 0,
        missShardCount: read.status === 'missing' ? 1 : 0,
        staleShardCount: read.status === 'stale' ? 1 : 0,
        corruptShardCount: read.status === 'corrupt' ? 1 : 0,
        schemaMismatchShardCount: read.status === 'schema-mismatch' ? 1 : 0,
        shardPaths: [read.path],
        staleExtractorKeys: read.status === 'stale' ? ['codeIndex'] : []
      }
    };
  }

  return {
    result: extractCodeIndexGraph(projectRoot, input.generatedAt),
    cache: {
      used: false,
      hit: false,
      mode: 'graph-core+live-code',
      manifestHash: input.manifest.manifestHash,
      readShardCount: 1,
      hitShardCount: 0,
      missShardCount: read.status === 'missing' ? 1 : 0,
      staleShardCount: read.status === 'stale' ? 1 : 0,
      corruptShardCount: read.status === 'corrupt' ? 1 : 0,
      schemaMismatchShardCount: read.status === 'schema-mismatch' ? 1 : 0,
      shardPaths: [read.path],
      staleExtractorKeys: read.status === 'stale' ? ['codeIndex'] : []
    }
  };
}

function emptyCodeGraphExtractionResult(shardPath: string): GraphExtractionResult {
  return {
    source: {
      extractor: 'extractCodeIndexGraph',
      paths: [shardPath],
      sourceHash: hashContextGraphText(`code-index-unavailable:${shardPath}`)
    },
    nodes: [],
    edges: [],
    stateSources: [],
    issues: []
  };
}

function mergeCodeCacheMetadata(base: ContextCacheMetadata, code?: ContextCacheMetadata): ContextCacheMetadata {
  if (!code) return base;
  return {
    ...base,
    used: base.used || code.used,
    hit: base.hit || code.hit,
    mode: code.hit
      ? 'extractor-shards+code-index'
      : code.mode?.startsWith('graph-core+code-index-')
        ? code.mode.replace('graph-core', 'extractor-shards')
        : 'extractor-shards+live-code',
    readShardCount: (base.readShardCount ?? 0) + (code.readShardCount ?? 0),
    hitShardCount: (base.hitShardCount ?? 0) + (code.hitShardCount ?? 0),
    missShardCount: (base.missShardCount ?? 0) + (code.missShardCount ?? 0),
    staleShardCount: (base.staleShardCount ?? 0) + (code.staleShardCount ?? 0),
    corruptShardCount: (base.corruptShardCount ?? 0) + (code.corruptShardCount ?? 0),
    schemaMismatchShardCount: (base.schemaMismatchShardCount ?? 0) + (code.schemaMismatchShardCount ?? 0),
    shardPaths: [...(base.shardPaths ?? []), ...(code.shardPaths ?? [])].sort(),
    staleExtractorKeys: [...(base.staleExtractorKeys ?? []), ...(code.staleExtractorKeys ?? [])].sort(),
    ...(code.hit && code.cachePath ? { cachePath: code.cachePath } : {}),
    ...(code.hit && code.createdAt ? { createdAt: code.createdAt } : {})
  };
}

export function buildContextGraphReport(input: BuildContextGraphReportInput): ContextGraphReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const collected = input.extractionResults ? undefined : collectContextGraphExtractionsWithCache(input.projectRoot, {
    includeCode: input.includeCode,
    generatedAt,
    cacheStrategy: input.cacheStrategy,
    codeStrategy: input.codeStrategy,
    taskId: input.taskId
  });
  const extractionResults = input.extractionResults ?? collected?.extractionResults ?? [];
  const merged = mergeGraphExtractionResults(extractionResults);
  const stateProjection = createContextStateProjectionReport({ generatedAt, extractionResults });
  const mode = input.mode ?? (input.taskId ? 'task' : 'full');
  const taskContext = input.taskId
    ? createTaskContextReport({
      taskId: input.taskId,
      nodes: merged.nodes,
      edges: merged.edges,
      stateProjection,
      issues: merged.issues
    })
    : undefined;

  return {
    schemaVersion: 'hadara.contextGraph.v1',
    command: 'context.graph',
    ok: merged.issues.every((issue) => issue.severity !== 'error') && stateProjection.ok,
    generatedAt,
    projectRoot: input.projectRoot,
    sourceHash: merged.source.sourceHash,
    mode,
    ...(input.taskId ? { taskId: input.taskId } : {}),
    nodes: merged.nodes,
    edges: merged.edges,
    ...(taskContext ? { taskContext } : {}),
    stateProjection,
    summary: summarizeContextGraphExtraction(merged.nodes, merged.edges, merged.issues),
    cache: input.cache ?? collected?.cache ?? { used: false, hit: false },
    issues: merged.issues
  };
}

function shouldUseBoundedStaleGraphCore(input: {
  graphCore: ReturnType<typeof readContextGraphCoreShard>;
  staleExtractorKeys: string[];
  stalePaths: string[];
  taskId?: string;
  assumedHot?: boolean;
}): input is typeof input & { graphCore: ReturnType<typeof readContextGraphCoreShard> & { record: NonNullable<ReturnType<typeof readContextGraphCoreShard>['record']> } } {
  const taskId = input.taskId;
  const staleOrAssumed = input.graphCore.status === 'stale' || (input.assumedHot && input.graphCore.hit);
  if (!taskId || !staleOrAssumed || !input.graphCore.record) return false;
  const boundedStaleKeys = new Set([
    'extractManagedSections',
    'extractTaskBoard',
    'extractTaskCapsules',
    'extractEvidence',
    'codeIndex'
  ]);
  if (!input.staleExtractorKeys.length || input.staleExtractorKeys.some((key) => !boundedStaleKeys.has(key))) return false;
  return input.graphCore.record.payload.nodes.some((node) => node.id === createTaskNodeId(taskId))
    || input.stalePaths.some((stalePath) => stalePath.startsWith(`tasks/${taskId}-`));
}

function boundedLiveOverlayExtractions(projectRoot: string, input: {
  staleExtractorKeys: string[];
  stalePaths: string[];
  taskId?: string;
}): GraphExtractionResult[] {
  const stale = new Set(input.staleExtractorKeys);
  const taskIds = boundedOverlayTaskIds(input.taskId, input.stalePaths);
  const results: GraphExtractionResult[] = [];
  if (stale.has('extractTaskBoard')) results.push(extractTaskBoard(projectRoot));
  if (stale.has('extractTaskCapsules')) results.push(extractTaskCapsules(projectRoot, { taskIds }));
  if (stale.has('extractManagedSections')) results.push(extractManagedSections(projectRoot));
  if (stale.has('extractEvidence')) results.push(extractEvidence(projectRoot, { taskIds }));
  return results;
}

function boundedOverlayTaskIds(taskId: string | undefined, stalePaths: string[]): string[] {
  const ids = new Set<string>();
  if (taskId) ids.add(taskId);
  for (const sourcePath of stalePaths) {
    const match = sourcePath.match(/^tasks\/(T-\d{4})-[^/]+\//);
    if (match?.[1]) ids.add(match[1]);
  }
  return Array.from(ids).sort();
}

export function createTaskContextReport(input: CreateTaskContextReportInput): TaskContextReport {
  const task = findTaskNode(input.nodes, input.taskId);
  const connectedNodes = connectedNodeIds(input.edges, createTaskNodeId(input.taskId));
  const readFirst = task ? [candidate(task, 'Active task capsule is the first read for task-scoped context routing.', 'explicit')] : [];

  return {
    schemaVersion: 'hadara.taskContext.v1',
    taskId: input.taskId,
    ...(task ? { task } : {}),
    readFirst,
    readIfNeeded: readIfNeededCandidates(input.nodes, input.edges, connectedNodes),
    doNotReadByDefault: doNotReadByDefaultCandidates(input.nodes),
    relatedEvidence: relatedEvidenceCandidates(input.nodes, input.edges, input.taskId),
    relatedCommands: relatedCommandCandidates(input.nodes, input.edges, connectedNodes),
    knownProblems: knownProblemCandidates(input.nodes),
    validationSuggestions: validationSuggestions(input.taskId),
    stateIssues: taskStateIssues(input.stateProjection.issues, input.taskId),
    issues: input.issues
  };
}

function findTaskNode(nodes: ContextGraphNode[], taskId: string): ContextGraphNode | undefined {
  const nodeId = createTaskNodeId(taskId);
  const matches = nodes.filter((node) => node.id === nodeId && node.type === 'Task');
  return matches.find((node) => node.kind === 'task-capsule') ?? matches[0];
}

function readIfNeededCandidates(
  nodes: ContextGraphNode[],
  edges: ContextGraphEdge[],
  connectedIds: Set<string>
): ContextCandidate[] {
  const candidates = new Map<string, ContextCandidate>();
  for (const node of nodes) {
    if (node.type !== 'Document') continue;
    if (metadataBoolean(node, 'requiredReading')) {
      candidates.set(node.id, candidate(node, 'Document registry marks this document as required reading.', 'explicit'));
      continue;
    }
    if (connectedIds.has(node.id)) {
      candidates.set(node.id, candidate(node, 'Document is directly connected to the task graph.', 'derived'));
    }
  }
  for (const edge of edges) {
    if (!connectedIds.has(edge.from) && !connectedIds.has(edge.to)) continue;
    const from = nodes.find((node) => node.id === edge.from);
    const to = nodes.find((node) => node.id === edge.to);
    for (const node of [from, to]) {
      if (node?.type !== 'Document' || candidates.has(node.id)) continue;
      candidates.set(node.id, candidate(node, edge.reason, edge.confidence));
    }
  }
  return sortCandidates(Array.from(candidates.values()));
}

function doNotReadByDefaultCandidates(nodes: ContextGraphNode[]): ContextCandidate[] {
  return sortCandidates(nodes
    .filter((node) => node.type === 'Document')
    .filter((node) => {
      const status = String(node.status ?? '').toLowerCase();
      const kind = String(node.kind ?? '').toLowerCase();
      const readWhen = Array.isArray(node.metadata?.readWhen) ? node.metadata.readWhen.map(String) : [];
      return status === 'archived'
        || status === 'superseded'
        || kind.includes('historical')
        || readWhen.includes('historical')
        || metadataBoolean(node, 'requiredReading') === false && kind.includes('archive');
    })
    .map((node) => candidate(node, 'Historical, archived, or superseded document is excluded from default task routing.', 'derived')));
}

function relatedEvidenceCandidates(nodes: ContextGraphNode[], edges: ContextGraphEdge[], taskId: string): ContextCandidate[] {
  const taskNodeId = createTaskNodeId(taskId);
  const evidenceIds = new Set(edges
    .filter((edge) => edge.from === taskNodeId && (edge.type === 'HAS_EVIDENCE' || edge.type === 'CLOSES_WITH'))
    .map((edge) => edge.to));
  return sortCandidates(nodes
    .filter((node) => node.type === 'Evidence' && evidenceIds.has(node.id))
    .map((node) => candidate(node, 'Evidence is directly linked to this task.', 'explicit')));
}

function relatedCommandCandidates(
  nodes: ContextGraphNode[],
  edges: ContextGraphEdge[],
  connectedIds: Set<string>
): ContextCandidate[] {
  const commandIds = new Set<string>();
  for (const edge of edges) {
    if (edge.type !== 'DESCRIBES_COMMAND' && edge.type !== 'CHECKS_COMMAND') continue;
    if (connectedIds.has(edge.from)) commandIds.add(edge.to);
    if (connectedIds.has(edge.to)) commandIds.add(edge.from);
  }
  return sortCandidates(nodes
    .filter((node) => node.type === 'Command' && commandIds.has(node.id))
    .map((node) => candidate(node, 'Command is connected through task-relevant documentation or release checks.', 'derived')));
}

function knownProblemCandidates(nodes: ContextGraphNode[]): ContextCandidate[] {
  return sortCandidates(nodes
    .filter((node) => node.type === 'KnownProblem')
    .map((node) => candidate(node, 'Current handoff records this known problem.', 'explicit')));
}

function taskStateIssues(issues: StateConsistencyIssue[], taskId: string): StateConsistencyIssue[] {
  const relevant = issues.filter((issue) =>
    issue.message.includes(taskId) || issue.paths.some((path) => path.includes(taskId))
  );
  if (relevant.length > 0) return relevant;
  return issues.filter((issue) =>
    issue.code === 'STATE_ACTIVE_TASK_MISMATCH' || issue.code === 'STATE_TASK_CAPSULE_MISSING'
  );
}

function connectedNodeIds(edges: ContextGraphEdge[], taskNodeId: string): Set<string> {
  const ids = new Set<string>([taskNodeId]);
  for (const edge of edges) {
    if (edge.from === taskNodeId) ids.add(edge.to);
    if (edge.to === taskNodeId) ids.add(edge.from);
  }
  return ids;
}

function candidate(
  node: ContextGraphNode,
  reason: string,
  confidence: ContextCandidate['confidence']
): ContextCandidate {
  return {
    id: node.id,
    type: node.type,
    ...(node.path ? { path: node.path } : {}),
    reason,
    confidence,
    ...(node.source.hash ? { sourceHash: node.source.hash } : {})
  };
}

function metadataBoolean(node: ContextGraphNode, key: string): boolean | undefined {
  const value = node.metadata?.[key];
  return typeof value === 'boolean' ? value : undefined;
}

function validationSuggestions(taskId: string): string[] {
  return [
    `hadara task status --task ${taskId} --detail full --json`
  ];
}

function sortCandidates(candidates: ContextCandidate[]): ContextCandidate[] {
  return candidates.sort((a, b) => a.id.localeCompare(b.id));
}
