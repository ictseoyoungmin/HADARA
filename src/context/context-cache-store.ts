import fs from 'node:fs';
import path from 'node:path';
import { atomicWriteTextFile } from '../core/fs';
import { validateSchema } from '../core/schema';
import {
  buildContextSourceManifest,
  checkContextSourceManifestFastFreshness,
  classifyContextSourcePath,
  compareContextSourceManifests,
  CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
  CONTEXT_SOURCE_MANIFEST_CACHE_ROOT,
  CONTEXT_SOURCE_MANIFEST_SCHEMA_ID,
  createContextSourceSubsetHash,
  extractorKeysForContextSource,
  type ContextSourceManifest
} from './source-manifest';
import type { ContextCacheMetadata, GraphExtractionResult } from './context-graph';
import { buildCodeIndexReport, CODE_INDEX_SCHEMA_ID, type CodeIndexReport, type CodeIndexSourceEntry } from './code-index';
import { hashContextGraphJson, mergeGraphExtractionResults, normalizeContextGraphPath } from './extractor-contract';
import {
  extractDecisions,
  extractManagedSections
} from './document-extractors';
import { extractEvidence } from './evidence-extractors';
import { extractCommandRegistry, extractDocsRegistry } from './registry-extractors';
import { extractReleaseReadiness } from './release-extractors';
import { extractTaskBoard, extractTaskCapsules } from './task-extractors';

export const CONTEXT_CACHE_RECORD_SCHEMA_ID = 'hadara.context.cacheRecord.v1' as const;
export const CONTEXT_CACHE_STATUS_SCHEMA_ID = 'hadara.context.cacheStatus.v1' as const;
export const CONTEXT_CACHE_WARM_SCHEMA_ID = 'hadara.context.cacheWarm.v1' as const;
export const CONTEXT_CACHE_RECORD_VERSION = 'c6.2-cache-record-v1' as const;
export const CONTEXT_CACHE_STATUS_COMMAND = 'context.cache.status' as const;
export const CONTEXT_CACHE_WARM_COMMAND = 'context.cache.warm' as const;

export type ContextCacheIssueCode =
  | 'CONTEXT_CACHE_MISS'
  | 'CONTEXT_CACHE_STALE'
  | 'CONTEXT_CACHE_CORRUPT'
  | 'CONTEXT_CACHE_SCHEMA_MISMATCH';

export type ContextSourceManifestCacheFastPath = 'hit' | 'miss' | 'skipped' | 'assumed-hot';

export type ContextGraphExtractorShardKey =
  | 'extractTaskBoard'
  | 'extractDocsRegistry'
  | 'extractCommandRegistry';

export type ContextGraphCacheShardKey = ContextGraphExtractorShardKey | 'graphCore' | 'codeIndex';

export interface ContextCacheIssue {
  severity: 'info' | 'warning' | 'error';
  code: ContextCacheIssueCode;
  message: string;
  path?: string;
  fixHint?: string;
}

export interface ContextCacheRecord<TPayload = unknown> {
  schemaVersion: typeof CONTEXT_CACHE_RECORD_SCHEMA_ID;
  cacheRecordVersion: typeof CONTEXT_CACHE_RECORD_VERSION;
  cacheKey: string;
  projection: string;
  projectionSchemaVersion: string;
  createdAt: string;
  manifestHash: string;
  sourceSubsetHash: string;
  extractorVersions: Record<string, string>;
  degraded: boolean;
  issues: ContextCacheIssue[];
  payload: TPayload;
}

export interface BuildContextCacheRecordOptions<TPayload> {
  projection: string;
  projectionSchemaVersion: string;
  manifest: ContextSourceManifest;
  payload: TPayload;
  createdAt?: string;
  extractorKeys?: string[];
  extractorVersions?: Record<string, string>;
  degraded?: boolean;
  issues?: ContextCacheIssue[];
}

export interface ContextCacheReadResult<TPayload = unknown> {
  ok: boolean;
  status: 'missing' | 'valid' | 'corrupt' | 'schema-mismatch';
  path: string;
  record?: ContextCacheRecord<TPayload>;
  issues: ContextCacheIssue[];
}

export interface ContextSourceManifestCacheReadResult {
  ok: boolean;
  status: 'missing' | 'valid' | 'corrupt' | 'schema-mismatch';
  path: typeof CONTEXT_SOURCE_MANIFEST_CACHE_PATH;
  manifest?: ContextSourceManifest;
  issues: ContextCacheIssue[];
}

export interface ContextCacheStatusReport {
  schemaVersion: typeof CONTEXT_CACHE_STATUS_SCHEMA_ID;
  command: typeof CONTEXT_CACHE_STATUS_COMMAND;
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  cacheRoot: typeof CONTEXT_SOURCE_MANIFEST_CACHE_ROOT;
  readOnly: true;
  summary: {
    mode: 'miss' | 'hit' | 'stale' | 'corrupt';
    cachePresent: boolean;
    cacheFresh: boolean;
    fastPath?: ContextSourceManifestCacheFastPath;
    degraded: boolean;
    staleExtractorKeys: string[];
  };
  manifest: {
    cachePath: typeof CONTEXT_SOURCE_MANIFEST_CACHE_PATH;
    status: 'missing' | 'fresh' | 'stale' | 'corrupt' | 'schema-mismatch';
    currentManifestHash: string;
    currentSourceCount: number;
    currentSkippedSourceCount: number;
    cachedManifestHash?: string;
    cachedGeneratedAt?: string;
    cachedSourceCount?: number;
    addedPaths: string[];
    removedPaths: string[];
    changedPaths: string[];
    unchangedSourceCount: number;
    staleExtractorKeys: string[];
    fastPath?: ContextSourceManifestCacheFastPath;
    fastPathReason?: string;
    fastPathStrategy?: string;
  };
  diagnostics: ContextCacheDiagnostics;
  issues: ContextCacheIssue[];
}

export interface ContextCacheWarmReport {
  schemaVersion: typeof CONTEXT_CACHE_WARM_SCHEMA_ID;
  command: typeof CONTEXT_CACHE_WARM_COMMAND;
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  cacheRoot: typeof CONTEXT_SOURCE_MANIFEST_CACHE_ROOT;
  mode: 'dry-run' | 'execute';
  summary: {
    cacheMode: 'miss' | 'fresh' | 'stale' | 'corrupt';
    cachePresent: boolean;
    cacheFresh: boolean;
    fastPath?: ContextSourceManifestCacheFastPath;
    writePlanned: boolean;
    writeExecuted: boolean;
    shardWritePlanned: boolean;
    shardWriteExecuted: boolean;
    shardHitCount: number;
    shardMissCount: number;
    shardStaleCount: number;
    shardCorruptCount: number;
    shardSchemaMismatchCount: number;
    postWriteCacheFresh?: boolean;
    postWriteShardFreshCount?: number;
    postWriteStaleExtractorKeys?: string[];
    degraded: boolean;
    staleExtractorKeys: string[];
  };
  manifest: {
    cachePath: typeof CONTEXT_SOURCE_MANIFEST_CACHE_PATH;
    status: 'missing' | 'fresh' | 'stale' | 'corrupt' | 'schema-mismatch';
    currentManifestHash: string;
    currentSourceCount: number;
    currentSkippedSourceCount: number;
    cachedManifestHash?: string;
    cachedGeneratedAt?: string;
    cachedSourceCount?: number;
    addedPaths: string[];
    removedPaths: string[];
    changedPaths: string[];
    unchangedSourceCount: number;
    staleExtractorKeys: string[];
    fastPath?: ContextSourceManifestCacheFastPath;
    fastPathReason?: string;
    fastPathStrategy?: string;
  };
  write: {
    policy: 'dry-run' | 'execute';
    planned: boolean;
    executed: boolean;
    cachePath: typeof CONTEXT_SOURCE_MANIFEST_CACHE_PATH;
    beforeStatus: ContextSourceManifestCacheReadResult['status'];
    beforeManifestHash?: string;
    afterManifestHash: string;
    skippedReason?: 'cache-fresh';
  };
  shards: {
    planned: boolean;
    executed: boolean;
    items: ContextGraphExtractorShardWarmItem[];
  };
  after?: ContextCacheAfterWriteReport;
  diagnostics: ContextCacheDiagnostics;
  issues: ContextCacheIssue[];
}

export interface ContextCacheAfterWriteReport {
  cacheFresh: boolean;
  operatorSummary: string;
  manifestStatus: 'missing' | 'fresh' | 'stale' | 'corrupt' | 'schema-mismatch';
  manifestHash: string;
  staleExtractorKeys: string[];
  shardSummary: {
    total: number;
    fresh: number;
    missing: number;
    stale: number;
    corrupt: number;
    schemaMismatch: number;
  };
}

export interface ContextCacheDiagnostics {
  state: 'fresh' | 'missing' | 'stale' | 'corrupt' | 'partial';
  operatorSummary: string;
  recommendedCommand?: string;
  recommendedCommandArgs?: string[];
  slowPath: {
    mountedWorkspace: boolean;
    fullManifestBuilt: boolean;
    fastPath: ContextSourceManifestCacheFastPath;
    reason?: string;
    strategy?: string;
    trust?: 'verified' | 'assumed';
  };
  manifestChanges: {
    addedPathCount: number;
    removedPathCount: number;
    changedPathCount: number;
    unchangedSourceCount: number;
    staleExtractorKeys: string[];
  };
  shardSummary: {
    total: number;
    fresh: number;
    missing: number;
    stale: number;
    corrupt: number;
    schemaMismatch: number;
    planned: number;
    plannedShardKeys: string[];
  };
}

export interface ContextGraphExtractorShardWarmItem {
  extractorKey: ContextGraphCacheShardKey;
  cachePath: string;
  beforeStatus: ContextGraphExtractorShardReadStatus;
  planned: boolean;
  executed: boolean;
  beforeCacheKey?: string;
  afterCacheKey?: string;
  skippedReason?: 'cache-fresh';
  readFileSummaryCount?: number;
  reusedFileSummaryCount?: number;
  recomputedFileSummaryCount?: number;
  missingFileSummaryCount?: number;
  staleFileSummaryCount?: number;
  corruptFileSummaryCount?: number;
  schemaMismatchFileSummaryCount?: number;
}

export type ContextGraphExtractorShardReadStatus =
  | 'missing'
  | 'fresh'
  | 'stale'
  | 'corrupt'
  | 'schema-mismatch';

export interface ContextGraphExtractorShardReadResult {
  ok: boolean;
  hit: boolean;
  status: ContextGraphExtractorShardReadStatus;
  extractorKey: ContextGraphExtractorShardKey;
  path: string;
  record?: ContextCacheRecord<GraphExtractionResult>;
  result?: GraphExtractionResult;
  issues: ContextCacheIssue[];
}

export interface ContextGraphCoreShardReadResult {
  ok: boolean;
  hit: boolean;
  status: ContextGraphExtractorShardReadStatus;
  path: string;
  record?: ContextCacheRecord<GraphExtractionResult>;
  result?: GraphExtractionResult;
  issues: ContextCacheIssue[];
}

export interface ContextCodeIndexShardReadResult {
  ok: boolean;
  hit: boolean;
  status: ContextGraphExtractorShardReadStatus;
  path: string;
  record?: ContextCacheRecord<CodeIndexReport>;
  result?: CodeIndexReport;
  issues: ContextCacheIssue[];
}

export interface ContextSourceManifestCacheAnalysis {
  generatedAt: string;
  cached: ContextSourceManifestCacheReadResult;
  currentManifest: ContextSourceManifest;
  comparison: ReturnType<typeof compareContextSourceManifests>;
  staleExtractorKeys: string[];
  cacheFresh: boolean;
  fastPath: ContextSourceManifestCacheFastPath;
  fastPathReason?: string;
  fastPathStrategy?: string;
  fullManifestBuilt: boolean;
  trust: 'verified' | 'assumed';
  degraded: boolean;
  issues: ContextCacheIssue[];
}

const CONTEXT_GRAPH_EXTRACTOR_SHARD_PROJECTION_PREFIX = 'context.graph.extractor' as const;
const CONTEXT_GRAPH_CORE_PROJECTION = 'context.graph.core' as const;
const CONTEXT_CODE_INDEX_PROJECTION = 'context.codeIndex' as const;
const CONTEXT_GRAPH_EXTRACTOR_SHARD_SCHEMA_VERSION = 'hadara.contextGraph.v1' as const;
const CONTEXT_GRAPH_CORE_CACHE_PATH = `${CONTEXT_SOURCE_MANIFEST_CACHE_ROOT}/graph-core.json` as const;
const CONTEXT_CODE_INDEX_CACHE_PATH = `${CONTEXT_SOURCE_MANIFEST_CACHE_ROOT}/code-index.json` as const;

const CONTEXT_GRAPH_EXTRACTOR_SHARD_KEYS: ContextGraphExtractorShardKey[] = [
  'extractTaskBoard',
  'extractDocsRegistry',
  'extractCommandRegistry'
];

const CONTEXT_GRAPH_EXTRACTOR_SHARD_CACHE_PATHS: Record<ContextGraphExtractorShardKey, string> = {
  extractTaskBoard: `${CONTEXT_SOURCE_MANIFEST_CACHE_ROOT}/extractors/task-board.json`,
  extractDocsRegistry: `${CONTEXT_SOURCE_MANIFEST_CACHE_ROOT}/extractors/docs-registry.json`,
  extractCommandRegistry: `${CONTEXT_SOURCE_MANIFEST_CACHE_ROOT}/extractors/command-registry.json`
};

const CONTEXT_GRAPH_EXTRACTOR_SHARD_EXTRACTORS: Record<ContextGraphExtractorShardKey, (projectRoot: string) => GraphExtractionResult> = {
  extractTaskBoard,
  extractDocsRegistry,
  extractCommandRegistry
};

const CONTEXT_GRAPH_CORE_EXTRACTOR_KEYS = [
  'extractTaskCapsules',
  'extractTaskBoard',
  'extractDocsRegistry',
  'extractCommandRegistry',
  'extractManagedSections',
  'extractDecisions',
  'extractEvidence',
  'extractReleaseReadiness'
] as const;

export function buildContextCacheRecord<TPayload>(options: BuildContextCacheRecordOptions<TPayload>): ContextCacheRecord<TPayload> {
  const extractorKeys = options.extractorKeys?.length ? [...options.extractorKeys].sort() : undefined;
  const sourceSubsetHash = extractorKeys
    ? hashContextGraphJson(extractorKeys.map((extractorKey) => ({
      extractorKey,
      subsetHash: createContextSourceSubsetHash(options.manifest, { extractorKey })
    })))
    : createContextSourceSubsetHash(options.manifest);
  const extractorVersions = {
    ...Object.fromEntries(Object.entries(options.manifest.extractorVersions)
      .filter(([key]) => !extractorKeys || extractorKeys.includes(key))),
    ...(options.extractorVersions ?? {})
  };
  const createdAt = options.createdAt ?? new Date().toISOString();
  const cacheKey = hashContextGraphJson({
    projection: options.projection,
    projectionSchemaVersion: options.projectionSchemaVersion,
    manifestHash: options.manifest.manifestHash,
    sourceSubsetHash,
    extractorVersions
  });

  return {
    schemaVersion: CONTEXT_CACHE_RECORD_SCHEMA_ID,
    cacheRecordVersion: CONTEXT_CACHE_RECORD_VERSION,
    cacheKey,
    projection: options.projection,
    projectionSchemaVersion: options.projectionSchemaVersion,
    createdAt,
    manifestHash: options.manifest.manifestHash,
    sourceSubsetHash,
    extractorVersions,
    degraded: options.degraded ?? false,
    issues: options.issues ?? [],
    payload: options.payload
  };
}

export function readContextCacheRecord<TPayload = unknown>(
  projectRoot: string,
  cachePath: string
): ContextCacheReadResult<TPayload> {
  const relativePath = normalizeContextCachePath(cachePath);
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return {
      ok: false,
      status: 'missing',
      path: relativePath,
      issues: [contextCacheIssue('info', 'CONTEXT_CACHE_MISS', `Context cache record is missing at ${relativePath}.`, relativePath)]
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    return {
      ok: false,
      status: 'corrupt',
      path: relativePath,
      issues: [contextCacheIssue('warning', 'CONTEXT_CACHE_CORRUPT', `Context cache record at ${relativePath} could not be parsed: ${error instanceof Error ? error.message : String(error)}.`, relativePath)]
    };
  }

  const validation = validateSchema(CONTEXT_CACHE_RECORD_SCHEMA_ID, parsed);
  if (!validation.ok) {
    return {
      ok: false,
      status: 'schema-mismatch',
      path: relativePath,
      issues: [contextCacheIssue('warning', 'CONTEXT_CACHE_SCHEMA_MISMATCH', `Context cache record at ${relativePath} does not match ${CONTEXT_CACHE_RECORD_SCHEMA_ID}.`, relativePath)]
    };
  }

  return {
    ok: true,
    status: 'valid',
    path: relativePath,
    record: parsed as ContextCacheRecord<TPayload>,
    issues: []
  };
}

export function writeContextCacheRecord<TPayload>(
  projectRoot: string,
  cachePath: string,
  record: ContextCacheRecord<TPayload>
): void {
  const relativePath = normalizeContextCachePath(cachePath);
  const validation = validateSchema(CONTEXT_CACHE_RECORD_SCHEMA_ID, record);
  if (!validation.ok) {
    throw new Error(`Context cache record does not match ${CONTEXT_CACHE_RECORD_SCHEMA_ID}: ${validation.issues[0]?.path ?? '$'}`);
  }
  atomicWriteTextFile(projectRoot, relativePath, `${JSON.stringify(record, null, 2)}\n`);
}

export function readContextSourceManifestCache(projectRoot: string): ContextSourceManifestCacheReadResult {
  const absolutePath = path.join(projectRoot, CONTEXT_SOURCE_MANIFEST_CACHE_PATH);
  if (!fs.existsSync(absolutePath)) {
    return {
      ok: false,
      status: 'missing',
      path: CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
      issues: [contextCacheIssue('info', 'CONTEXT_CACHE_MISS', `Source manifest cache is missing at ${CONTEXT_SOURCE_MANIFEST_CACHE_PATH}.`, CONTEXT_SOURCE_MANIFEST_CACHE_PATH)]
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    return {
      ok: false,
      status: 'corrupt',
      path: CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
      issues: [contextCacheIssue('warning', 'CONTEXT_CACHE_CORRUPT', `Source manifest cache could not be parsed: ${error instanceof Error ? error.message : String(error)}.`, CONTEXT_SOURCE_MANIFEST_CACHE_PATH)]
    };
  }

  const validation = validateSchema(CONTEXT_SOURCE_MANIFEST_SCHEMA_ID, parsed);
  if (!validation.ok) {
    return {
      ok: false,
      status: 'schema-mismatch',
      path: CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
      issues: [contextCacheIssue('warning', 'CONTEXT_CACHE_SCHEMA_MISMATCH', `Source manifest cache does not match ${CONTEXT_SOURCE_MANIFEST_SCHEMA_ID}.`, CONTEXT_SOURCE_MANIFEST_CACHE_PATH)]
    };
  }

  return {
    ok: true,
    status: 'valid',
    path: CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
    manifest: parsed as ContextSourceManifest,
    issues: []
  };
}

export function writeContextSourceManifestCache(projectRoot: string, manifest: ContextSourceManifest): void {
  const validation = validateSchema(CONTEXT_SOURCE_MANIFEST_SCHEMA_ID, manifest);
  if (!validation.ok) {
    throw new Error(`Context source manifest does not match ${CONTEXT_SOURCE_MANIFEST_SCHEMA_ID}: ${validation.issues[0]?.path ?? '$'}`);
  }
  atomicWriteTextFile(projectRoot, CONTEXT_SOURCE_MANIFEST_CACHE_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}

export function listContextGraphExtractorShardKeys(): ContextGraphExtractorShardKey[] {
  return [...CONTEXT_GRAPH_EXTRACTOR_SHARD_KEYS];
}

export function contextGraphExtractorShardCachePath(extractorKey: ContextGraphExtractorShardKey): string {
  return CONTEXT_GRAPH_EXTRACTOR_SHARD_CACHE_PATHS[extractorKey];
}

export function contextGraphCoreShardCachePath(): string {
  return CONTEXT_GRAPH_CORE_CACHE_PATH;
}

export function contextCodeIndexShardCachePath(): string {
  return CONTEXT_CODE_INDEX_CACHE_PATH;
}

export function buildContextGraphExtractorShardRecord(input: {
  manifest: ContextSourceManifest;
  extractorKey: ContextGraphExtractorShardKey;
  result: GraphExtractionResult;
  createdAt?: string;
}): ContextCacheRecord<GraphExtractionResult> {
  return buildContextCacheRecord({
    projection: contextGraphExtractorShardProjection(input.extractorKey),
    projectionSchemaVersion: CONTEXT_GRAPH_EXTRACTOR_SHARD_SCHEMA_VERSION,
    manifest: input.manifest,
    extractorKeys: [input.extractorKey],
    payload: input.result,
    createdAt: input.createdAt,
    degraded: input.result.issues.some((issue) => issue.severity === 'warning' || issue.severity === 'error')
  });
}

export function writeContextGraphExtractorShard(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
  extractorKey: ContextGraphExtractorShardKey;
  result: GraphExtractionResult;
  createdAt?: string;
}): ContextCacheRecord<GraphExtractionResult> {
  const record = buildContextGraphExtractorShardRecord(input);
  writeContextCacheRecord(input.projectRoot, contextGraphExtractorShardCachePath(input.extractorKey), record);
  return record;
}

export function readContextGraphExtractorShard(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
  extractorKey: ContextGraphExtractorShardKey;
}): ContextGraphExtractorShardReadResult {
  const cachePath = contextGraphExtractorShardCachePath(input.extractorKey);
  const read = readContextCacheRecord<GraphExtractionResult>(input.projectRoot, cachePath);
  if (!read.ok || !read.record) {
    return {
      ok: false,
      hit: false,
      status: read.status === 'valid' ? 'schema-mismatch' : read.status,
      extractorKey: input.extractorKey,
      path: read.path,
      issues: read.issues
    };
  }

  const expected = buildContextCacheRecord({
    projection: contextGraphExtractorShardProjection(input.extractorKey),
    projectionSchemaVersion: CONTEXT_GRAPH_EXTRACTOR_SHARD_SCHEMA_VERSION,
    manifest: input.manifest,
    extractorKeys: [input.extractorKey],
    payload: read.record.payload,
    createdAt: read.record.createdAt
  });
  const shapeIssue = validateGraphExtractionPayload(read.record.payload, input.extractorKey, read.path);
  if (shapeIssue) {
    return {
      ok: false,
      hit: false,
      status: 'schema-mismatch',
      extractorKey: input.extractorKey,
      path: read.path,
      record: read.record,
      issues: [shapeIssue]
    };
  }
  if (
    read.record.projection !== expected.projection
    || read.record.projectionSchemaVersion !== expected.projectionSchemaVersion
    || read.record.sourceSubsetHash !== expected.sourceSubsetHash
    || !sameRecord(read.record.extractorVersions, expected.extractorVersions)
  ) {
    return {
      ok: false,
      hit: false,
      status: 'stale',
      extractorKey: input.extractorKey,
      path: read.path,
      record: read.record,
      issues: [contextCacheIssue('warning', 'CONTEXT_CACHE_STALE', `Context graph extractor shard ${input.extractorKey} is stale.`, read.path)]
    };
  }

  return {
    ok: true,
    hit: true,
    status: 'fresh',
    extractorKey: input.extractorKey,
    path: read.path,
    record: read.record,
    result: read.record.payload,
    issues: []
  };
}

export function collectContextGraphExtractorShards(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
}): { results: Partial<Record<ContextGraphExtractorShardKey, GraphExtractionResult>>; cache: ContextCacheMetadata; issues: ContextCacheIssue[] } {
  const results: Partial<Record<ContextGraphExtractorShardKey, GraphExtractionResult>> = {};
  const reads = CONTEXT_GRAPH_EXTRACTOR_SHARD_KEYS.map((extractorKey) =>
    readContextGraphExtractorShard({ projectRoot: input.projectRoot, manifest: input.manifest, extractorKey })
  );
  for (const read of reads) {
    if (read.hit && read.result) results[read.extractorKey] = read.result;
  }
  const hitReads = reads.filter((read) => read.hit);
  const staleReads = reads.filter((read) => read.status === 'stale');
  const cache: ContextCacheMetadata = {
    used: hitReads.length > 0,
    hit: hitReads.length > 0,
    mode: 'extractor-shards',
    manifestHash: input.manifest.manifestHash,
    readShardCount: reads.length,
    hitShardCount: hitReads.length,
    missShardCount: reads.filter((read) => read.status === 'missing').length,
    staleShardCount: staleReads.length,
    corruptShardCount: reads.filter((read) => read.status === 'corrupt').length,
    schemaMismatchShardCount: reads.filter((read) => read.status === 'schema-mismatch').length,
    shardPaths: reads.map((read) => read.path).sort(),
    staleExtractorKeys: staleReads.map((read) => read.extractorKey).sort(),
    ...(hitReads[0]?.record ? { createdAt: hitReads[0].record.createdAt, cachePath: hitReads[0].path } : {})
  };
  return {
    results,
    cache,
    issues: reads.flatMap((read) => read.issues)
  };
}

export function buildContextGraphCoreExtractionResult(projectRoot: string): GraphExtractionResult {
  return mergeGraphExtractionResults([
    extractTaskCapsules(projectRoot),
    extractTaskBoard(projectRoot),
    extractDocsRegistry(projectRoot),
    extractCommandRegistry(projectRoot),
    extractManagedSections(projectRoot),
    extractDecisions(projectRoot),
    extractEvidence(projectRoot),
    extractReleaseReadiness(projectRoot)
  ]);
}

export function buildContextGraphCoreShardRecord(input: {
  manifest: ContextSourceManifest;
  result: GraphExtractionResult;
  createdAt?: string;
}): ContextCacheRecord<GraphExtractionResult> {
  return buildContextCacheRecord({
    projection: CONTEXT_GRAPH_CORE_PROJECTION,
    projectionSchemaVersion: CONTEXT_GRAPH_EXTRACTOR_SHARD_SCHEMA_VERSION,
    manifest: input.manifest,
    extractorKeys: [...CONTEXT_GRAPH_CORE_EXTRACTOR_KEYS],
    payload: input.result,
    createdAt: input.createdAt,
    degraded: input.result.issues.some((issue) => issue.severity === 'warning' || issue.severity === 'error')
  });
}

export function writeContextGraphCoreShard(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
  result: GraphExtractionResult;
  createdAt?: string;
}): ContextCacheRecord<GraphExtractionResult> {
  const record = buildContextGraphCoreShardRecord(input);
  writeContextCacheRecord(input.projectRoot, CONTEXT_GRAPH_CORE_CACHE_PATH, record);
  return record;
}

export function readContextGraphCoreShard(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
}): ContextGraphCoreShardReadResult {
  const read = readContextCacheRecord<GraphExtractionResult>(input.projectRoot, CONTEXT_GRAPH_CORE_CACHE_PATH);
  if (!read.ok || !read.record) {
    return {
      ok: false,
      hit: false,
      status: read.status === 'valid' ? 'schema-mismatch' : read.status,
      path: read.path,
      issues: read.issues
    };
  }

  const expected = buildContextCacheRecord({
    projection: CONTEXT_GRAPH_CORE_PROJECTION,
    projectionSchemaVersion: CONTEXT_GRAPH_EXTRACTOR_SHARD_SCHEMA_VERSION,
    manifest: input.manifest,
    extractorKeys: [...CONTEXT_GRAPH_CORE_EXTRACTOR_KEYS],
    payload: read.record.payload,
    createdAt: read.record.createdAt
  });
  const shapeIssue = validateGraphCorePayload(read.record.payload, read.path);
  if (shapeIssue) {
    return {
      ok: false,
      hit: false,
      status: 'schema-mismatch',
      path: read.path,
      record: read.record,
      issues: [shapeIssue]
    };
  }
  if (
    read.record.projection !== expected.projection
    || read.record.projectionSchemaVersion !== expected.projectionSchemaVersion
    || read.record.sourceSubsetHash !== expected.sourceSubsetHash
    || !sameRecord(read.record.extractorVersions, expected.extractorVersions)
  ) {
    return {
      ok: false,
      hit: false,
      status: 'stale',
      path: read.path,
      record: read.record,
      issues: [contextCacheIssue('warning', 'CONTEXT_CACHE_STALE', 'Context graph core shard is stale.', read.path)]
    };
  }

  return {
    ok: true,
    hit: true,
    status: 'fresh',
    path: read.path,
    record: read.record,
    result: read.record.payload,
    issues: []
  };
}

export function buildContextCodeIndexShardRecord(input: {
  manifest: ContextSourceManifest;
  result: CodeIndexReport;
  createdAt?: string;
}): ContextCacheRecord<CodeIndexReport> {
  return buildContextCacheRecord({
    projection: CONTEXT_CODE_INDEX_PROJECTION,
    projectionSchemaVersion: CODE_INDEX_SCHEMA_ID,
    manifest: input.manifest,
    extractorKeys: ['codeIndex'],
    payload: input.result,
    createdAt: input.createdAt,
    degraded: input.result.summary.degraded || input.result.issues.some((issue) => issue.severity === 'warning' || issue.severity === 'error')
  });
}

export function writeContextCodeIndexShard(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
  result: CodeIndexReport;
  createdAt?: string;
}): ContextCacheRecord<CodeIndexReport> {
  const record = buildContextCodeIndexShardRecord(input);
  writeContextCacheRecord(input.projectRoot, CONTEXT_CODE_INDEX_CACHE_PATH, record);
  return record;
}

export function readContextCodeIndexShard(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
}): ContextCodeIndexShardReadResult {
  const read = readContextCacheRecord<CodeIndexReport>(input.projectRoot, CONTEXT_CODE_INDEX_CACHE_PATH);
  if (!read.ok || !read.record) {
    return {
      ok: false,
      hit: false,
      status: read.status === 'valid' ? 'schema-mismatch' : read.status,
      path: read.path,
      issues: read.issues
    };
  }

  const expected = buildContextCacheRecord({
    projection: CONTEXT_CODE_INDEX_PROJECTION,
    projectionSchemaVersion: CODE_INDEX_SCHEMA_ID,
    manifest: input.manifest,
    extractorKeys: ['codeIndex'],
    payload: read.record.payload,
    createdAt: read.record.createdAt
  });
  const shapeIssue = validateCodeIndexPayload(read.record.payload, read.path);
  if (shapeIssue) {
    return {
      ok: false,
      hit: false,
      status: 'schema-mismatch',
      path: read.path,
      record: read.record,
      issues: [shapeIssue]
    };
  }
  if (
    read.record.projection !== expected.projection
    || read.record.projectionSchemaVersion !== expected.projectionSchemaVersion
    || read.record.sourceSubsetHash !== expected.sourceSubsetHash
    || !sameRecord(read.record.extractorVersions, expected.extractorVersions)
  ) {
    return {
      ok: false,
      hit: false,
      status: 'stale',
      path: read.path,
      record: read.record,
      issues: [contextCacheIssue('warning', 'CONTEXT_CACHE_STALE', 'Context code-index shard is stale.', read.path)]
    };
  }

  return {
    ok: true,
    hit: true,
    status: 'fresh',
    path: read.path,
    record: read.record,
    result: withCodeIndexCacheHitMetadata(read.record.payload, read.record, read.path),
    issues: []
  };
}

export function createContextCacheStatusReport(input: { projectRoot: string; generatedAt?: string }): ContextCacheStatusReport {
  const analysis = createSourceManifestCacheAnalysis({
    projectRoot: input.projectRoot,
    generatedAt: input.generatedAt,
    generatedByCommand: CONTEXT_CACHE_STATUS_COMMAND,
    allowAssumedHotOnFingerprintMismatch: true
  });
  const shardItems = createContextGraphExtractorShardWarmItems({
    projectRoot: input.projectRoot,
    manifest: analysis.currentManifest,
    execute: false,
    generatedAt: analysis.generatedAt
  });

  return {
    schemaVersion: CONTEXT_CACHE_STATUS_SCHEMA_ID,
    command: CONTEXT_CACHE_STATUS_COMMAND,
    ok: true,
    generatedAt: analysis.generatedAt,
    projectRoot: input.projectRoot,
    cacheRoot: CONTEXT_SOURCE_MANIFEST_CACHE_ROOT,
    readOnly: true,
    summary: {
      mode: analysis.cacheFresh ? 'hit' : analysis.cached.status === 'missing' ? 'miss' : analysis.cached.status === 'valid' ? 'stale' : 'corrupt',
      cachePresent: analysis.cached.status !== 'missing',
      cacheFresh: analysis.cacheFresh,
      fastPath: analysis.fastPath,
      degraded: analysis.degraded,
      staleExtractorKeys: analysis.staleExtractorKeys
    },
    manifest: createManifestReportSection(analysis),
    diagnostics: createContextCacheDiagnostics({
      projectRoot: input.projectRoot,
      analysis,
      shardItems
    }),
    issues: analysis.issues
  };
}

export function createContextCacheWarmReport(input: { projectRoot: string; execute?: boolean; generatedAt?: string }): ContextCacheWarmReport {
  const execute = input.execute ?? false;
  const analysis = createSourceManifestCacheAnalysis({
    projectRoot: input.projectRoot,
    generatedAt: input.generatedAt,
    generatedByCommand: CONTEXT_CACHE_WARM_COMMAND
  });
  const shardItems = createContextGraphExtractorShardWarmItems({
    projectRoot: input.projectRoot,
    manifest: analysis.currentManifest,
    execute,
    generatedAt: analysis.generatedAt
  });
  const shardWritePlanned = shardItems.some((item) => item.planned);
  const shardWriteExecuted = shardItems.some((item) => item.executed);
  const writePlanned = !analysis.cacheFresh;
  let writeExecuted = false;
  if (execute && writePlanned) {
    writeContextSourceManifestCache(input.projectRoot, analysis.currentManifest);
    writeExecuted = true;
  }
  const after = execute && (writeExecuted || shardWriteExecuted)
    ? createContextCacheAfterWriteReport({
      projectRoot: input.projectRoot,
      manifest: analysis.currentManifest
    })
    : undefined;

  return {
    schemaVersion: CONTEXT_CACHE_WARM_SCHEMA_ID,
    command: CONTEXT_CACHE_WARM_COMMAND,
    ok: true,
    generatedAt: analysis.generatedAt,
    projectRoot: input.projectRoot,
    cacheRoot: CONTEXT_SOURCE_MANIFEST_CACHE_ROOT,
    mode: execute ? 'execute' : 'dry-run',
    summary: {
      cacheMode: analysis.cacheFresh ? 'fresh' : analysis.cached.status === 'missing' ? 'miss' : analysis.cached.status === 'valid' ? 'stale' : 'corrupt',
      cachePresent: analysis.cached.status !== 'missing',
      cacheFresh: analysis.cacheFresh,
      fastPath: analysis.fastPath,
      writePlanned: writePlanned || shardWritePlanned,
      writeExecuted: writeExecuted || shardWriteExecuted,
      shardWritePlanned,
      shardWriteExecuted,
      shardHitCount: shardItems.filter((item) => item.beforeStatus === 'fresh').length,
      shardMissCount: shardItems.filter((item) => item.beforeStatus === 'missing').length,
      shardStaleCount: shardItems.filter((item) => item.beforeStatus === 'stale').length,
      shardCorruptCount: shardItems.filter((item) => item.beforeStatus === 'corrupt').length,
      shardSchemaMismatchCount: shardItems.filter((item) => item.beforeStatus === 'schema-mismatch').length,
      ...(after ? {
        postWriteCacheFresh: after.cacheFresh,
        postWriteShardFreshCount: after.shardSummary.fresh,
        postWriteStaleExtractorKeys: after.staleExtractorKeys
      } : {}),
      degraded: analysis.degraded,
      staleExtractorKeys: analysis.staleExtractorKeys
    },
    manifest: createManifestReportSection(analysis),
    write: {
      policy: execute ? 'execute' : 'dry-run',
      planned: writePlanned,
      executed: writeExecuted,
      cachePath: CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
      beforeStatus: analysis.cached.status,
      ...(analysis.cached.manifest ? { beforeManifestHash: analysis.cached.manifest.manifestHash } : {}),
      afterManifestHash: analysis.currentManifest.manifestHash,
      ...(!writePlanned ? { skippedReason: 'cache-fresh' as const } : {})
    },
    shards: {
      planned: shardWritePlanned,
      executed: shardWriteExecuted,
      items: shardItems
    },
    ...(after ? { after } : {}),
    diagnostics: createContextCacheDiagnostics({
      projectRoot: input.projectRoot,
      analysis,
      shardItems
    }),
    issues: analysis.issues
  };
}

function createContextCacheAfterWriteReport(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
}): ContextCacheAfterWriteReport {
  const sourceManifest = readContextSourceManifestCache(input.projectRoot);
  const manifestStatus: ContextCacheAfterWriteReport['manifestStatus'] = sourceManifest.status === 'valid'
    ? sourceManifest.manifest?.manifestHash === input.manifest.manifestHash ? 'fresh' : 'stale'
    : sourceManifest.status;
  const shardReads = [
    ...CONTEXT_GRAPH_EXTRACTOR_SHARD_KEYS.map((extractorKey) =>
      readContextGraphExtractorShard({
        projectRoot: input.projectRoot,
        manifest: input.manifest,
        extractorKey
      })
    ),
    {
      extractorKey: 'graphCore' as const,
      ...readContextGraphCoreShard({
        projectRoot: input.projectRoot,
        manifest: input.manifest
      })
    },
    {
      extractorKey: 'codeIndex' as const,
      ...readContextCodeIndexShard({
        projectRoot: input.projectRoot,
        manifest: input.manifest
      })
    }
  ];
  const staleExtractorKeys = shardReads
    .filter((read) => read.status === 'stale')
    .map((read) => read.extractorKey)
    .sort();
  const shardSummary = {
    total: shardReads.length,
    fresh: shardReads.filter((read) => read.status === 'fresh').length,
    missing: shardReads.filter((read) => read.status === 'missing').length,
    stale: shardReads.filter((read) => read.status === 'stale').length,
    corrupt: shardReads.filter((read) => read.status === 'corrupt').length,
    schemaMismatch: shardReads.filter((read) => read.status === 'schema-mismatch').length
  };
  return {
    cacheFresh: manifestStatus === 'fresh'
      && shardSummary.fresh === shardSummary.total
      && staleExtractorKeys.length === 0,
    operatorSummary: manifestStatus === 'fresh'
      && shardSummary.fresh === shardSummary.total
      && staleExtractorKeys.length === 0
      ? 'Post-write context cache is fresh and all warm shards are available.'
      : 'Post-write context cache still needs attention; inspect manifestStatus and shardSummary.',
    manifestStatus,
    manifestHash: input.manifest.manifestHash,
    staleExtractorKeys,
    shardSummary
  };
}

function createContextCacheDiagnostics(input: {
  projectRoot: string;
  analysis: ContextSourceManifestCacheAnalysis;
  shardItems: ContextGraphExtractorShardWarmItem[];
}): ContextCacheDiagnostics {
  const shardSummary = {
    total: input.shardItems.length,
    fresh: input.shardItems.filter((item) => item.beforeStatus === 'fresh').length,
    missing: input.shardItems.filter((item) => item.beforeStatus === 'missing').length,
    stale: input.shardItems.filter((item) => item.beforeStatus === 'stale').length,
    corrupt: input.shardItems.filter((item) => item.beforeStatus === 'corrupt').length,
    schemaMismatch: input.shardItems.filter((item) => item.beforeStatus === 'schema-mismatch').length,
    planned: input.shardItems.filter((item) => item.planned).length,
    plannedShardKeys: input.shardItems.filter((item) => item.planned).map((item) => item.extractorKey).sort()
  };
  const manifestCorrupt = input.analysis.cached.status === 'corrupt' || input.analysis.cached.status === 'schema-mismatch';
  const hasPartialShards = input.analysis.cacheFresh && shardSummary.planned > 0;
  const state: ContextCacheDiagnostics['state'] = manifestCorrupt
    ? 'corrupt'
    : input.analysis.cached.status === 'missing'
      ? 'missing'
      : input.analysis.cacheFresh
        ? hasPartialShards ? 'partial' : 'fresh'
        : 'stale';
  const needsWarm = state !== 'fresh';
  return {
    state,
    operatorSummary: contextCacheOperatorSummary(state, shardSummary.planned),
    ...(needsWarm ? {
      recommendedCommand: 'hadara context cache warm --execute --json',
      recommendedCommandArgs: ['context', 'cache', 'warm', '--execute', '--json']
    } : {}),
    slowPath: {
      mountedWorkspace: input.projectRoot.startsWith('/mnt/'),
      fullManifestBuilt: input.analysis.fullManifestBuilt,
      fastPath: input.analysis.fastPath,
      ...(input.analysis.fastPathReason ? { reason: input.analysis.fastPathReason } : {}),
      ...(input.analysis.fastPathStrategy ? { strategy: input.analysis.fastPathStrategy } : {}),
      trust: input.analysis.trust
    },
    manifestChanges: {
      addedPathCount: input.analysis.comparison.addedPaths.length,
      removedPathCount: input.analysis.comparison.removedPaths.length,
      changedPathCount: input.analysis.comparison.changedPaths.length,
      unchangedSourceCount: input.analysis.comparison.unchangedPaths.length,
      staleExtractorKeys: input.analysis.staleExtractorKeys
    },
    shardSummary
  };
}

function contextCacheOperatorSummary(state: ContextCacheDiagnostics['state'], plannedShardCount: number): string {
  if (state === 'fresh') return 'Context cache is fresh and all warm shards are available.';
  if (state === 'missing') return 'Context cache is missing; run an explicit warm execute to populate source manifest and shards.';
  if (state === 'corrupt') return 'Context cache has corrupt or schema-mismatched records; run an explicit warm execute to repair it.';
  if (state === 'partial') return `Source manifest is fresh but ${plannedShardCount} warm shard(s) are missing, stale, corrupt, or schema-mismatched.`;
  return 'Context cache is stale relative to current project source metadata; run an explicit warm execute to refresh it.';
}

function createContextGraphExtractorShardWarmItems(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
  execute: boolean;
  generatedAt: string;
}): ContextGraphExtractorShardWarmItem[] {
  const extractorItems = CONTEXT_GRAPH_EXTRACTOR_SHARD_KEYS.map((extractorKey) => {
    const read = readContextGraphExtractorShard({
      projectRoot: input.projectRoot,
      manifest: input.manifest,
      extractorKey
    });
    const planned = !read.hit;
    let afterCacheKey: string | undefined;
    if (input.execute && planned) {
      const result = CONTEXT_GRAPH_EXTRACTOR_SHARD_EXTRACTORS[extractorKey](input.projectRoot);
      const record = writeContextGraphExtractorShard({
        projectRoot: input.projectRoot,
        manifest: input.manifest,
        extractorKey,
        result,
        createdAt: input.generatedAt
      });
      afterCacheKey = record.cacheKey;
    }
    return {
      extractorKey,
      cachePath: read.path,
      beforeStatus: read.status,
      planned,
      executed: input.execute && planned,
      ...(read.record ? { beforeCacheKey: read.record.cacheKey } : {}),
      ...(afterCacheKey ? { afterCacheKey } : {}),
      ...(!planned ? { skippedReason: 'cache-fresh' as const } : {})
    };
  });
  const graphCoreRead = readContextGraphCoreShard({
    projectRoot: input.projectRoot,
    manifest: input.manifest
  });
  const graphCorePlanned = !graphCoreRead.hit;
  let graphCoreAfterCacheKey: string | undefined;
  if (input.execute && graphCorePlanned) {
    const result = buildContextGraphCoreExtractionResult(input.projectRoot);
    const record = writeContextGraphCoreShard({
      projectRoot: input.projectRoot,
      manifest: input.manifest,
      result,
      createdAt: input.generatedAt
    });
    graphCoreAfterCacheKey = record.cacheKey;
  }
  return [
    ...extractorItems,
    {
      extractorKey: 'graphCore',
      cachePath: graphCoreRead.path,
      beforeStatus: graphCoreRead.status,
      planned: graphCorePlanned,
      executed: input.execute && graphCorePlanned,
      ...(graphCoreRead.record ? { beforeCacheKey: graphCoreRead.record.cacheKey } : {}),
      ...(graphCoreAfterCacheKey ? { afterCacheKey: graphCoreAfterCacheKey } : {}),
      ...(!graphCorePlanned ? { skippedReason: 'cache-fresh' as const } : {})
    },
    createContextCodeIndexShardWarmItem(input)
  ];
}

function createContextCodeIndexShardWarmItem(input: {
  projectRoot: string;
  manifest: ContextSourceManifest;
  execute: boolean;
  generatedAt: string;
}): ContextGraphExtractorShardWarmItem {
  const read = readContextCodeIndexShard({
    projectRoot: input.projectRoot,
    manifest: input.manifest
  });
  const planned = !read.hit;
  let afterCacheKey: string | undefined;
  let result: CodeIndexReport | undefined;
  if (input.execute && planned) {
    result = buildCodeIndexReport({
      projectRoot: input.projectRoot,
      generatedAt: input.generatedAt,
      sourceEntries: codeIndexSourceEntries(input.manifest),
      fileSummaryCache: {
        mode: 'read-write',
        createdAt: input.generatedAt,
        extractorVersion: input.manifest.extractorVersions.codeIndex
      }
    });
    const record = writeContextCodeIndexShard({
      projectRoot: input.projectRoot,
      manifest: input.manifest,
      result,
      createdAt: input.generatedAt
    });
    afterCacheKey = record.cacheKey;
  }
  return {
    extractorKey: 'codeIndex',
    cachePath: read.path,
    beforeStatus: read.status,
    planned,
    executed: input.execute && planned,
    ...(read.record ? { beforeCacheKey: read.record.cacheKey } : {}),
    ...(afterCacheKey ? { afterCacheKey } : {}),
    ...(result?.cache?.readFileSummaryCount === undefined ? {} : {
      readFileSummaryCount: result.cache.readFileSummaryCount,
      reusedFileSummaryCount: result.cache.reusedFileSummaryCount,
      recomputedFileSummaryCount: result.cache.recomputedFileSummaryCount,
      missingFileSummaryCount: result.cache.missingFileSummaryCount,
      staleFileSummaryCount: result.cache.staleFileSummaryCount,
      corruptFileSummaryCount: result.cache.corruptFileSummaryCount,
      schemaMismatchFileSummaryCount: result.cache.schemaMismatchFileSummaryCount
    }),
    ...(!planned ? { skippedReason: 'cache-fresh' as const } : {})
  };
}

function codeIndexSourceEntries(manifest: ContextSourceManifest): CodeIndexSourceEntry[] {
  return manifest.sources
    .filter((source) => source.extractorKeys.includes('codeIndex'))
    .map((source) => ({
      path: source.path,
      sizeBytes: source.sizeBytes,
      ...(source.mtimeMs === undefined ? {} : { mtimeMs: source.mtimeMs }),
      ...(source.contentHash ? { contentHash: source.contentHash } : {}),
      metadataHash: source.metadataHash,
      extractorKeys: source.extractorKeys
    }));
}

function withCodeIndexCacheHitMetadata(report: CodeIndexReport, record: ContextCacheRecord<CodeIndexReport>, cachePath: string): CodeIndexReport {
  return {
    ...report,
    cache: {
      used: true,
      hit: true,
      mode: 'code-index',
      manifestHash: record.manifestHash,
      createdAt: record.createdAt,
      cachePath
    }
  };
}

export function createSourceManifestCacheAnalysis(input: {
  projectRoot: string;
  generatedAt?: string;
  generatedByCommand: string;
  allowAssumedHotOnFingerprintMismatch?: boolean;
}): ContextSourceManifestCacheAnalysis {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const cached = readContextSourceManifestCache(input.projectRoot);
  const fastFreshness = cached.status === 'valid' && cached.manifest
    ? checkContextSourceManifestFastFreshness(input.projectRoot, cached.manifest)
    : undefined;
  if (cached.status === 'valid' && cached.manifest) {
    if (fastFreshness?.ok) {
      return {
        generatedAt,
        cached,
        currentManifest: cached.manifest,
        comparison: {
          addedPaths: [],
          removedPaths: [],
          changedPaths: [],
          unchangedPaths: cached.manifest.sources.map((source) => source.path).sort(),
          staleExtractorKeys: []
        },
        staleExtractorKeys: [],
        cacheFresh: true,
        fastPath: 'hit',
        fastPathReason: fastFreshness.reason,
        fastPathStrategy: fastFreshness.strategy,
        fullManifestBuilt: false,
        trust: 'verified',
        degraded: cached.manifest.issues.some((issue) => issue.severity === 'warning' || issue.severity === 'error'),
        issues: [...cached.issues]
      };
    }
    if (
      input.allowAssumedHotOnFingerprintMismatch
      && fastFreshness?.reason === 'fingerprint-mismatch'
      && fastFreshness.relevantStatusEntries
    ) {
      const comparison = compareCachedManifestWithGitStatusEntries(cached.manifest, fastFreshness.relevantStatusEntries);
      const issues: ContextCacheIssue[] = [...cached.issues, contextCacheIssue(
        'warning',
        'CONTEXT_CACHE_STALE',
        'Source manifest cache freshness used a metadata-only assumed-hot path; run context cache warm for full verification.',
        CONTEXT_SOURCE_MANIFEST_CACHE_PATH
      )];
      return {
        generatedAt,
        cached,
        currentManifest: cached.manifest,
        comparison,
        staleExtractorKeys: comparison.staleExtractorKeys,
        cacheFresh: false,
        fastPath: 'assumed-hot',
        fastPathReason: 'fingerprint-mismatch-metadata-only',
        fastPathStrategy: fastFreshness.strategy,
        fullManifestBuilt: false,
        trust: 'assumed',
        degraded: true,
        issues
      };
    }
  }
  const currentManifest = buildContextSourceManifest({
    projectRoot: input.projectRoot,
    generatedAt,
    generatedByCommand: input.generatedByCommand,
    ...(cached.status === 'valid' && cached.manifest ? { previousManifest: cached.manifest } : {})
  });
  const comparison = cached.manifest
    ? compareContextSourceManifests(cached.manifest, currentManifest)
    : { addedPaths: [], removedPaths: [], changedPaths: [], unchangedPaths: [], staleExtractorKeys: [] };
  const staleExtractorKeys = comparison.staleExtractorKeys;
  const cacheFresh = cached.status === 'valid'
    && cached.manifest?.manifestHash === currentManifest.manifestHash
    && staleExtractorKeys.length === 0
    && comparison.addedPaths.length === 0
    && comparison.removedPaths.length === 0
    && comparison.changedPaths.length === 0;
  const degraded = currentManifest.issues.some((issue) => issue.severity === 'warning' || issue.severity === 'error');
  const issues: ContextCacheIssue[] = [...cached.issues];
  if (cached.status === 'valid' && !cacheFresh) {
    issues.push(contextCacheIssue('warning', 'CONTEXT_CACHE_STALE', 'Source manifest cache is stale relative to current project source metadata.', CONTEXT_SOURCE_MANIFEST_CACHE_PATH));
  }

  return {
    generatedAt,
    cached,
    currentManifest,
    comparison,
    staleExtractorKeys,
    cacheFresh,
    fastPath: fastFreshness ? 'miss' : 'skipped',
    ...(fastFreshness ? {
      fastPathReason: fastFreshness.reason,
      ...(fastFreshness.strategy ? { fastPathStrategy: fastFreshness.strategy } : {})
    } : {}),
    fullManifestBuilt: true,
    trust: 'verified',
    degraded,
    issues
  };
}

function compareCachedManifestWithGitStatusEntries(
  manifest: ContextSourceManifest,
  entries: Array<{ status: string; path: string }>
): ReturnType<typeof compareContextSourceManifests> {
  const cachedByPath = new Map(manifest.sources.map((source) => [source.path, source]));
  const addedPaths = new Set<string>();
  const removedPaths = new Set<string>();
  const changedPaths = new Set<string>();
  const staleExtractorKeys = new Set<string>();

  for (const entry of entries) {
    const cached = cachedByPath.get(entry.path);
    const deleted = entry.status.includes('D');
    if (cached && deleted) {
      removedPaths.add(entry.path);
      cached.extractorKeys.forEach((key) => staleExtractorKeys.add(key));
      continue;
    }
    if (cached) {
      changedPaths.add(entry.path);
      cached.extractorKeys.forEach((key) => staleExtractorKeys.add(key));
      continue;
    }
    addedPaths.add(entry.path);
    const kind = classifyContextSourcePath(entry.path);
    if (kind) extractorKeysForContextSource(entry.path, kind).forEach((key) => staleExtractorKeys.add(key));
  }

  const dirtyPaths = new Set([...addedPaths, ...removedPaths, ...changedPaths]);
  return {
    addedPaths: Array.from(addedPaths).sort(),
    removedPaths: Array.from(removedPaths).sort(),
    changedPaths: Array.from(changedPaths).sort(),
    unchangedPaths: manifest.sources.map((source) => source.path).filter((sourcePath) => !dirtyPaths.has(sourcePath)).sort(),
    staleExtractorKeys: Array.from(staleExtractorKeys).sort()
  };
}

function createManifestReportSection(analysis: ContextSourceManifestCacheAnalysis): ContextCacheStatusReport['manifest'] {
  return {
    cachePath: CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
    status: analysis.cacheFresh ? 'fresh' : analysis.cached.status === 'valid' ? 'stale' : analysis.cached.status,
    currentManifestHash: analysis.currentManifest.manifestHash,
    currentSourceCount: analysis.currentManifest.summary.sourceCount,
    currentSkippedSourceCount: analysis.currentManifest.summary.skippedSourceCount,
    ...(analysis.cached.manifest ? {
      cachedManifestHash: analysis.cached.manifest.manifestHash,
      cachedGeneratedAt: analysis.cached.manifest.generatedAt,
      cachedSourceCount: analysis.cached.manifest.summary.sourceCount
    } : {}),
    addedPaths: analysis.comparison.addedPaths,
    removedPaths: analysis.comparison.removedPaths,
    changedPaths: analysis.comparison.changedPaths,
    unchangedSourceCount: analysis.comparison.unchangedPaths.length,
    staleExtractorKeys: analysis.staleExtractorKeys,
    fastPath: analysis.fastPath,
    ...(analysis.fastPathReason ? { fastPathReason: analysis.fastPathReason } : {}),
    ...(analysis.fastPathStrategy ? { fastPathStrategy: analysis.fastPathStrategy } : {})
  };
}

function normalizeContextCachePath(inputPath: string): string {
  const normalizedPath = normalizeContextGraphPath(inputPath);
  if (path.isAbsolute(inputPath) || normalizedPath.startsWith('../') || normalizedPath === '..') {
    throw new Error(`Context cache path must be project-relative: ${inputPath}`);
  }
  if (normalizedPath !== CONTEXT_SOURCE_MANIFEST_CACHE_ROOT && !normalizedPath.startsWith(`${CONTEXT_SOURCE_MANIFEST_CACHE_ROOT}/`)) {
    throw new Error(`Context cache path must stay under ${CONTEXT_SOURCE_MANIFEST_CACHE_ROOT}: ${inputPath}`);
  }
  return normalizedPath;
}

function contextGraphExtractorShardProjection(extractorKey: ContextGraphExtractorShardKey): string {
  return `${CONTEXT_GRAPH_EXTRACTOR_SHARD_PROJECTION_PREFIX}.${extractorKey}`;
}

function validateGraphExtractionPayload(payload: GraphExtractionResult, extractorKey: ContextGraphExtractorShardKey, cachePath: string): ContextCacheIssue | undefined {
  if (
    !payload
    || typeof payload !== 'object'
    || !payload.source
    || payload.source.extractor !== extractorKey
    || !Array.isArray(payload.source.paths)
    || typeof payload.source.sourceHash !== 'string'
    || !Array.isArray(payload.nodes)
    || !Array.isArray(payload.edges)
    || !Array.isArray(payload.issues)
  ) {
    return contextCacheIssue('warning', 'CONTEXT_CACHE_SCHEMA_MISMATCH', `Context graph extractor shard ${extractorKey} payload is not a valid extraction result.`, cachePath);
  }
  return undefined;
}

function validateGraphCorePayload(payload: GraphExtractionResult, cachePath: string): ContextCacheIssue | undefined {
  if (
    !payload
    || typeof payload !== 'object'
    || !payload.source
    || payload.source.extractor !== 'mergeGraphExtractionResults'
    || !Array.isArray(payload.source.paths)
    || typeof payload.source.sourceHash !== 'string'
    || !Array.isArray(payload.nodes)
    || !Array.isArray(payload.edges)
    || !Array.isArray(payload.issues)
  ) {
    return contextCacheIssue('warning', 'CONTEXT_CACHE_SCHEMA_MISMATCH', 'Context graph core shard payload is not a valid merged extraction result.', cachePath);
  }
  return undefined;
}

function validateCodeIndexPayload(payload: CodeIndexReport, cachePath: string): ContextCacheIssue | undefined {
  const validation = validateSchema(CODE_INDEX_SCHEMA_ID, payload);
  if (!validation.ok) {
    return contextCacheIssue('warning', 'CONTEXT_CACHE_SCHEMA_MISMATCH', `Context code-index shard payload is not a valid ${CODE_INDEX_SCHEMA_ID} report.`, cachePath);
  }
  return undefined;
}

function sameRecord(left: Record<string, string>, right: Record<string, string>): boolean {
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key, index) => key === rightKeys[index] && left[key] === right[key]);
}

function contextCacheIssue(
  severity: ContextCacheIssue['severity'],
  code: ContextCacheIssueCode,
  message: string,
  issuePath?: string
): ContextCacheIssue {
  return {
    severity,
    code,
    message,
    ...(issuePath ? { path: issuePath } : {})
  };
}
