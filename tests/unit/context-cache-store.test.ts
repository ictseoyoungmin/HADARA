import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import {
  buildContextCacheRecord,
  createContextCacheStatusReport,
  createContextCacheWarmReport,
  readContextCacheRecord,
  readContextSourceManifestCache,
  writeContextCacheRecord,
  writeContextSourceManifestCache
} from '../../src/context/context-cache-store';
import {
  buildContextSourceManifest,
  CONTEXT_SOURCE_MANIFEST_CACHE_PATH
} from '../../src/context/source-manifest';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('context cache store', () => {
  it('reports a schema-valid miss without creating cache directories', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    const before = snapshotProject(root);

    const report = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:00:00.000Z'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.context.cacheStatus.v1',
      command: 'context.cache.status',
      ok: true,
      readOnly: true,
      summary: {
        mode: 'miss',
        cachePresent: false,
        cacheFresh: false
      },
      manifest: {
        status: 'missing',
        cachePath: CONTEXT_SOURCE_MANIFEST_CACHE_PATH
      }
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_CACHE_MISS' }));
    assertSchema('hadara.context.cacheStatus.v1', report);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('previews source-manifest cache warm without creating cache files', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    const before = snapshotProject(root);

    const report = createContextCacheWarmReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:00:30.000Z'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.context.cacheWarm.v1',
      command: 'context.cache.warm',
      ok: true,
      mode: 'dry-run',
      summary: {
        cacheMode: 'miss',
        cachePresent: false,
        cacheFresh: false,
        writePlanned: true,
        writeExecuted: false
      },
      write: {
        policy: 'dry-run',
        planned: true,
        executed: false,
        beforeStatus: 'missing'
      }
    });
    assertSchema('hadara.context.cacheWarm.v1', report);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('executes source-manifest cache warm and makes status a hit', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');

    const report = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:00:45.000Z'
    });

    expect(report.summary).toMatchObject({
      cacheMode: 'miss',
      writePlanned: true,
      writeExecuted: true
    });
    expect(report.write).toMatchObject({
      policy: 'execute',
      planned: true,
      executed: true,
      beforeStatus: 'missing'
    });
    assertSchema('hadara.context.cacheWarm.v1', report);

    const cached = readContextSourceManifestCache(root);
    expect(cached.status).toBe('valid');
    expect(cached.manifest?.manifestHash).toBe(report.write.afterManifestHash);

    const status = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:00:50.000Z'
    });
    expect(status.summary.mode).toBe('hit');
    expect(status.manifest.status).toBe('fresh');
  });

  it('writes and reads source-manifest cache as a fresh hit across generatedAt changes', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    const manifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T15:01:00.000Z',
      generatedByCommand: 'test'
    });

    writeContextSourceManifestCache(root, manifest);
    const cached = readContextSourceManifestCache(root);
    expect(cached.status).toBe('valid');
    expect(cached.manifest?.manifestHash).toBe(manifest.manifestHash);

    const report = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:02:00.000Z'
    });

    expect(report.summary).toMatchObject({
      mode: 'hit',
      cachePresent: true,
      cacheFresh: true,
      staleExtractorKeys: []
    });
    expect(report.manifest).toMatchObject({
      status: 'fresh',
      cachedManifestHash: manifest.manifestHash,
      changedPaths: [],
      addedPaths: [],
      removedPaths: [],
      unchangedSourceCount: manifest.sources.length
    });
    assertSchema('hadara.context.cacheStatus.v1', report);
  });

  it('marks stale cache by changed source metadata and returns extractor invalidation keys', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    const manifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T15:03:00.000Z'
    });
    writeContextSourceManifestCache(root, manifest);

    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n\nChanged\n');
    const report = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:04:00.000Z'
    });

    expect(report.summary.mode).toBe('stale');
    expect(report.manifest.status).toBe('stale');
    expect(report.manifest.changedPaths).toEqual(['docs/TASK_BOARD.md']);
    expect(report.summary.staleExtractorKeys).toContain('extractTaskBoard');
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_CACHE_STALE' }));
    assertSchema('hadara.context.cacheStatus.v1', report);
  });

  it('executes source-manifest cache warm to refresh stale cache', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    const manifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T15:04:30.000Z'
    });
    writeContextSourceManifestCache(root, manifest);

    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n\nChanged\n');
    const report = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:04:45.000Z'
    });

    expect(report.summary).toMatchObject({
      cacheMode: 'stale',
      cachePresent: true,
      cacheFresh: false,
      writePlanned: true,
      writeExecuted: true
    });
    expect(report.manifest.changedPaths).toEqual(['docs/TASK_BOARD.md']);
    expect(report.write.beforeManifestHash).toBe(manifest.manifestHash);
    assertSchema('hadara.context.cacheWarm.v1', report);

    const status = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:04:50.000Z'
    });
    expect(status.summary.mode).toBe('hit');
  });

  it('reports corrupt source-manifest cache without throwing', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    write(root, CONTEXT_SOURCE_MANIFEST_CACHE_PATH, '{not-json');

    const report = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:05:00.000Z'
    });

    expect(report.summary.mode).toBe('corrupt');
    expect(report.manifest.status).toBe('corrupt');
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_CACHE_CORRUPT' }));
    assertSchema('hadara.context.cacheStatus.v1', report);
  });

  it('executes source-manifest cache warm to repair corrupt cache', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    write(root, CONTEXT_SOURCE_MANIFEST_CACHE_PATH, '{not-json');

    const report = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:05:30.000Z'
    });

    expect(report.summary).toMatchObject({
      cacheMode: 'corrupt',
      cachePresent: true,
      cacheFresh: false,
      writePlanned: true,
      writeExecuted: true
    });
    expect(report.write.beforeStatus).toBe('corrupt');
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_CACHE_CORRUPT' }));
    assertSchema('hadara.context.cacheWarm.v1', report);

    const cached = readContextSourceManifestCache(root);
    expect(cached.status).toBe('valid');
  });

  it('builds schema-valid projection cache records and constrains cache paths', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    const manifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T15:06:00.000Z'
    });
    const record = buildContextCacheRecord({
      projection: 'context.graph',
      projectionSchemaVersion: 'hadara.contextGraph.v1',
      manifest,
      extractorKeys: ['extractTaskBoard'],
      payload: { ok: true, nodes: [] },
      createdAt: '2026-06-18T15:07:00.000Z'
    });

    expect(record.cacheKey).toMatch(/^sha256:/);
    expect(record.sourceSubsetHash).toMatch(/^sha256:/);
    assertSchema('hadara.context.cacheRecord.v1', record);

    writeContextCacheRecord(root, '.hadara/local/cache/context/graph.json', record);
    const read = readContextCacheRecord<{ ok: boolean; nodes: unknown[] }>(root, '.hadara/local/cache/context/graph.json');
    expect(read).toMatchObject({
      ok: true,
      status: 'valid',
      path: '.hadara/local/cache/context/graph.json'
    });
    expect(read.record?.payload.ok).toBe(true);
    expect(() => writeContextCacheRecord(root, 'docs/cache.json', record)).toThrow(/must stay under/);
  });
});

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-cache-'));
  roots.push(root);
  return root;
}

function write(root: string, relativePath: string, content: string): void {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function snapshotProject(root: string): Record<string, string> {
  const snapshot: Record<string, string> = {};
  for (const filePath of listFiles(root)) {
    snapshot[path.relative(root, filePath).replace(/\\/g, '/')] = fs.readFileSync(filePath, 'utf8');
  }
  return snapshot;
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(entryPath));
    if (entry.isFile()) files.push(entryPath);
  }
  return files.sort();
}
