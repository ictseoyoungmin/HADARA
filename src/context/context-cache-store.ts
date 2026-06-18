import fs from 'node:fs';
import path from 'node:path';
import { atomicWriteTextFile } from '../core/fs';
import { validateSchema } from '../core/schema';
import {
  buildContextSourceManifest,
  compareContextSourceManifests,
  CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
  CONTEXT_SOURCE_MANIFEST_CACHE_ROOT,
  CONTEXT_SOURCE_MANIFEST_SCHEMA_ID,
  createContextSourceSubsetHash,
  type ContextSourceManifest
} from './source-manifest';
import { hashContextGraphJson, normalizeContextGraphPath } from './extractor-contract';

export const CONTEXT_CACHE_RECORD_SCHEMA_ID = 'hadara.context.cacheRecord.v1' as const;
export const CONTEXT_CACHE_STATUS_SCHEMA_ID = 'hadara.context.cacheStatus.v1' as const;
export const CONTEXT_CACHE_RECORD_VERSION = 'c6.2-cache-record-v1' as const;
export const CONTEXT_CACHE_STATUS_COMMAND = 'context.cache.status' as const;

export type ContextCacheIssueCode =
  | 'CONTEXT_CACHE_MISS'
  | 'CONTEXT_CACHE_STALE'
  | 'CONTEXT_CACHE_CORRUPT'
  | 'CONTEXT_CACHE_SCHEMA_MISMATCH';

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
  };
  issues: ContextCacheIssue[];
}

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

export function createContextCacheStatusReport(input: { projectRoot: string; generatedAt?: string }): ContextCacheStatusReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const cached = readContextSourceManifestCache(input.projectRoot);
  const currentManifest = buildContextSourceManifest({
    projectRoot: input.projectRoot,
    generatedAt,
    generatedByCommand: CONTEXT_CACHE_STATUS_COMMAND,
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
    schemaVersion: CONTEXT_CACHE_STATUS_SCHEMA_ID,
    command: CONTEXT_CACHE_STATUS_COMMAND,
    ok: true,
    generatedAt,
    projectRoot: input.projectRoot,
    cacheRoot: CONTEXT_SOURCE_MANIFEST_CACHE_ROOT,
    readOnly: true,
    summary: {
      mode: cacheFresh ? 'hit' : cached.status === 'missing' ? 'miss' : cached.status === 'valid' ? 'stale' : 'corrupt',
      cachePresent: cached.status !== 'missing',
      cacheFresh,
      degraded,
      staleExtractorKeys
    },
    manifest: {
      cachePath: CONTEXT_SOURCE_MANIFEST_CACHE_PATH,
      status: cacheFresh ? 'fresh' : cached.status === 'valid' ? 'stale' : cached.status,
      currentManifestHash: currentManifest.manifestHash,
      currentSourceCount: currentManifest.summary.sourceCount,
      currentSkippedSourceCount: currentManifest.summary.skippedSourceCount,
      ...(cached.manifest ? {
        cachedManifestHash: cached.manifest.manifestHash,
        cachedGeneratedAt: cached.manifest.generatedAt,
        cachedSourceCount: cached.manifest.summary.sourceCount
      } : {}),
      addedPaths: comparison.addedPaths,
      removedPaths: comparison.removedPaths,
      changedPaths: comparison.changedPaths,
      unchangedSourceCount: comparison.unchangedPaths.length,
      staleExtractorKeys
    },
    issues
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
