import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import {
  buildContextCacheRecord,
  contextCodeIndexShardCachePath,
  contextGraphCoreShardCachePath,
  contextGraphExtractorShardCachePath,
  createContextCacheStatusReport,
  createContextCacheWarmReport,
  readContextCodeIndexShard,
  readContextGraphExtractorShard,
  readContextGraphCoreShard,
  readContextCacheRecord,
  readContextSourceManifestCache,
  writeContextCacheRecord,
  writeContextSourceManifestCache
} from '../../src/context/context-cache-store';
import { codeIndexFileSummaryCachePath } from '../../src/context/code-index';
import { buildContextGraphReport } from '../../src/context/context-graph-builder';
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
      },
      diagnostics: {
        state: 'missing',
        recommendedCommandArgs: ['context', 'cache', 'warm', '--execute', '--json'],
        slowPath: {
          fullManifestBuilt: true
        },
        shardSummary: {
          total: 5,
          planned: 5,
          plannedShardKeys: ['codeIndex', 'extractCommandRegistry', 'extractDocsRegistry', 'extractTaskBoard', 'graphCore']
        }
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
      },
      shards: {
        planned: true,
        executed: false,
        items: expect.arrayContaining([
          expect.objectContaining({ extractorKey: 'extractTaskBoard', beforeStatus: 'missing', planned: true, executed: false }),
          expect.objectContaining({ extractorKey: 'extractDocsRegistry', beforeStatus: 'missing', planned: true, executed: false }),
          expect.objectContaining({ extractorKey: 'extractCommandRegistry', beforeStatus: 'missing', planned: true, executed: false }),
          expect.objectContaining({ extractorKey: 'graphCore', beforeStatus: 'missing', planned: true, executed: false }),
          expect.objectContaining({ extractorKey: 'codeIndex', beforeStatus: 'missing', planned: true, executed: false })
        ])
      },
      diagnostics: {
        state: 'missing',
        recommendedCommand: 'hadara context cache warm --execute --json',
        shardSummary: {
          missing: 5,
          planned: 5
        }
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
    expect(report.shards).toMatchObject({
      planned: true,
      executed: true,
      items: expect.arrayContaining([
        expect.objectContaining({ extractorKey: 'extractTaskBoard', executed: true }),
        expect.objectContaining({ extractorKey: 'extractDocsRegistry', executed: true }),
        expect.objectContaining({ extractorKey: 'extractCommandRegistry', executed: true }),
        expect.objectContaining({ extractorKey: 'graphCore', executed: true }),
        expect.objectContaining({ extractorKey: 'codeIndex', executed: true })
      ])
    });
    assertSchema('hadara.context.cacheWarm.v1', report);

    const cached = readContextSourceManifestCache(root);
    expect(cached.status).toBe('valid');
    expect(cached.manifest?.manifestHash).toBe(report.write.afterManifestHash);
    expect(readContextCacheRecord(root, contextGraphExtractorShardCachePath('extractTaskBoard')).status).toBe('valid');
    expect(readContextCacheRecord(root, contextGraphExtractorShardCachePath('extractDocsRegistry')).status).toBe('valid');
    expect(readContextCacheRecord(root, contextGraphExtractorShardCachePath('extractCommandRegistry')).status).toBe('valid');
    expect(readContextCacheRecord(root, contextGraphCoreShardCachePath()).status).toBe('valid');
    expect(readContextCacheRecord(root, contextCodeIndexShardCachePath()).status).toBe('valid');

    const status = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:00:50.000Z'
    });
    expect(status.summary.mode).toBe('hit');
    expect(status.manifest.status).toBe('fresh');
    expect(status.diagnostics).toMatchObject({
      state: 'fresh',
      shardSummary: {
        total: 5,
        fresh: 5,
        planned: 0,
        plannedShardKeys: []
      }
    });
  });

  it('reports partial cache diagnostics when source manifest is fresh but a warm shard is missing', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:00:45.000Z'
    });
    fs.rmSync(path.join(root, contextCodeIndexShardCachePath()), { force: true });

    const status = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:00:50.000Z'
    });

    expect(status.summary).toMatchObject({
      mode: 'hit',
      cacheFresh: true
    });
    expect(status.diagnostics).toMatchObject({
      state: 'partial',
      recommendedCommandArgs: ['context', 'cache', 'warm', '--execute', '--json'],
      shardSummary: {
        total: 5,
        fresh: 4,
        missing: 1,
        planned: 1,
        plannedShardKeys: ['codeIndex']
      }
    });
    assertSchema('hadara.context.cacheStatus.v1', status);
  });

  it('serves graph reports from a fresh graph-core shard without read-command writes', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', [
      '# TASK_BOARD',
      '',
      '| ID | Title | Status | Capsule | Notes |',
      '|---|---|---|---|---|',
      '| T-0001 | Cached graph fixture | In Progress | tasks/T-0001-cached-graph-fixture | |',
      ''
    ].join('\n'));
    write(root, 'tasks/T-0001-cached-graph-fixture/TASK.md', [
      '# T-0001 Cached graph fixture',
      '',
      '## Metadata',
      '',
      '| Field | Value |',
      '|---|---|',
      '| ID | T-0001 |',
      '| Title | Cached graph fixture |',
      '| Status | In Progress |',
      '| Created | 2026-06-18 |',
      '| Updated | 2026-06-18 |',
      ''
    ].join('\n'));
    const warm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:00:45.000Z'
    });
    expect(warm.shards.items).toContainEqual(expect.objectContaining({
      extractorKey: 'graphCore',
      executed: true
    }));
    const cached = readContextSourceManifestCache(root);
    expect(cached.status).toBe('valid');
    const graphCore = readContextGraphCoreShard({
      projectRoot: root,
      manifest: cached.manifest!
    });
    expect(graphCore.hit).toBe(true);

    const before = snapshotProject(root);
    const graph = buildContextGraphReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:00:50.000Z'
    });

    expect(graph.cache).toMatchObject({
      used: true,
      hit: true,
      mode: 'graph-core',
      cachePath: contextGraphCoreShardCachePath()
    });
    expect(graph.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'task:T-0001' })
    ]));
    assertSchema('hadara.contextGraph.v1', graph);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('marks graph-core shard stale when core graph sources change', () => {
    const changes = [
      {
        path: 'tasks/T-0001-cached-graph-fixture/TASK.md',
        content: '# T-0001 Cached graph fixture\n\nChanged task body\n'
      },
      {
        path: 'docs/PROJECT_STATE.md',
        content: '# PROJECT_STATE\n\nChanged project state\n'
      },
      {
        path: 'docs/AGENT_HANDOFF.md',
        content: '# AGENT_HANDOFF\n\nChanged handoff\n'
      },
      {
        path: 'tasks/T-0001-cached-graph-fixture/evidence.jsonl',
        content: '{"taskId":"T-0001","summary":"changed evidence"}\n'
      }
    ];

    for (const change of changes) {
      const root = graphCoreFixtureProject();
      createContextCacheWarmReport({
        projectRoot: root,
        execute: true,
        generatedAt: '2026-06-18T15:00:45.000Z'
      });
      const cached = readContextSourceManifestCache(root);
      expect(cached.status).toBe('valid');

      write(root, change.path, change.content);
      const changedManifest = buildContextSourceManifest({
        projectRoot: root,
        generatedAt: '2026-06-18T15:01:45.000Z',
        previousManifest: cached.manifest
      });
      const graphCore = readContextGraphCoreShard({
        projectRoot: root,
        manifest: changedManifest
      });

      expect(graphCore).toMatchObject({
        ok: false,
        hit: false,
        status: 'stale',
        path: contextGraphCoreShardCachePath()
      });
      expect(graphCore.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_CACHE_STALE' }));
    }
  });

  it('reports corrupt graph-core payload shape as schema-mismatch without throwing', () => {
    const root = graphCoreFixtureProject();
    createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:00:45.000Z'
    });
    const cached = readContextSourceManifestCache(root);
    const graphCoreRecord = readContextCacheRecord(root, contextGraphCoreShardCachePath());
    expect(cached.status).toBe('valid');
    expect(graphCoreRecord.status).toBe('valid');

    writeContextCacheRecord(root, contextGraphCoreShardCachePath(), {
      ...graphCoreRecord.record!,
      payload: {
        source: { extractor: 'notMergeGraphExtractionResults' },
        nodes: [],
        edges: [],
        issues: []
      }
    });

    const graphCore = readContextGraphCoreShard({
      projectRoot: root,
      manifest: cached.manifest!
    });
    expect(graphCore).toMatchObject({
      ok: false,
      hit: false,
      status: 'schema-mismatch',
      path: contextGraphCoreShardCachePath()
    });
    expect(graphCore.issues).toContainEqual(expect.objectContaining({ code: 'CONTEXT_CACHE_SCHEMA_MISMATCH' }));
  });

  it('writes code-index shard records and invalidates them only for code-index source changes', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    write(root, 'src/example.ts', 'export const before = 1;\n');
    write(root, 'tests/unit/example.test.ts', "import { before } from '../../src/example';\nit('uses before', () => before);\n");

    const warm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:00:55.000Z'
    });
    expect(warm.shards.items).toContainEqual(expect.objectContaining({
      extractorKey: 'codeIndex',
      executed: true
    }));

    const cached = readContextSourceManifestCache(root);
    expect(cached.status).toBe('valid');
    const codeIndex = readContextCodeIndexShard({
      projectRoot: root,
      manifest: cached.manifest!
    });

    expect(codeIndex).toMatchObject({
      ok: true,
      hit: true,
      status: 'fresh',
      path: contextCodeIndexShardCachePath()
    });
    expect(codeIndex.result?.cache).toMatchObject({
      used: true,
      hit: true,
      mode: 'code-index',
      cachePath: contextCodeIndexShardCachePath()
    });
    expect(codeIndex.result?.files.map((file) => file.path)).toEqual(expect.arrayContaining([
      'src/example.ts',
      'tests/unit/example.test.ts'
    ]));
    assertSchema('hadara.codeIndex.v1', codeIndex.result);

    write(root, 'src/example.ts', 'export const after = 22;\n');
    const changedManifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T15:01:05.000Z',
      previousManifest: cached.manifest
    });
    const stale = readContextCodeIndexShard({
      projectRoot: root,
      manifest: changedManifest
    });
    expect(stale.status).toBe('stale');
    expect(stale.hit).toBe(false);
  });

  it('reuses unchanged per-file code-index summaries during stale warm execute', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    write(root, 'src/example.ts', 'export const before = 1;\n');
    write(root, 'src/helper.ts', 'export const helper = 2;\n');

    const firstWarm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:01:10.000Z'
    });
    expect(firstWarm.shards.items).toContainEqual(expect.objectContaining({
      extractorKey: 'codeIndex',
      executed: true,
      readFileSummaryCount: 2,
      reusedFileSummaryCount: 0,
      recomputedFileSummaryCount: 2,
      missingFileSummaryCount: 2
    }));
    const helperCachePath = codeIndexFileSummaryCachePath('src/helper.ts');
    const helperCacheBefore = fs.readFileSync(path.join(root, helperCachePath), 'utf8');

    write(root, 'src/example.ts', 'export const after = 22;\n');
    const secondWarm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:01:20.000Z'
    });
    expect(secondWarm.shards.items).toContainEqual(expect.objectContaining({
      extractorKey: 'codeIndex',
      beforeStatus: 'stale',
      executed: true,
      readFileSummaryCount: 2,
      reusedFileSummaryCount: 1,
      recomputedFileSummaryCount: 1,
      staleFileSummaryCount: 1
    }));
    expect(fs.readFileSync(path.join(root, helperCachePath), 'utf8')).toBe(helperCacheBefore);
    assertSchema('hadara.context.cacheWarm.v1', secondWarm);
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

  it('reuses a cached source manifest through the git fingerprint fast path', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    initGitRepository(root);
    const warm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:02:30.000Z'
    });
    expect(warm.summary.cacheFresh).toBe(false);

    const taskBoard = path.join(root, 'docs/TASK_BOARD.md');
    const nextTime = new Date('2026-06-18T15:02:40.000Z');
    fs.utimesSync(taskBoard, nextTime, nextTime);
    const report = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:02:45.000Z'
    });
    expect(report.summary).toMatchObject({
      mode: 'hit',
      cacheFresh: true,
      fastPath: 'hit'
    });
    expect(report.manifest).toMatchObject({
      status: 'fresh',
      fastPath: 'hit',
      fastPathStrategy: 'git-worktree-v1',
      unchangedSourceCount: 1
    });
    assertSchema('hadara.context.cacheStatus.v1', report);

    const graph = buildContextGraphReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:02:50.000Z'
    });
    expect(graph.cache).toMatchObject({
      sourceManifestCacheFresh: true,
      sourceManifestFastPath: 'hit'
    });
    assertSchema('hadara.contextGraph.v1', graph);

    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n\nChanged\n');
    const stale = createContextCacheStatusReport({
      projectRoot: root,
      generatedAt: '2026-06-18T15:02:55.000Z'
    });
    expect(stale.summary).toMatchObject({
      mode: 'stale',
      cacheFresh: false,
      fastPath: 'miss'
    });
    expect(stale.manifest.changedPaths).toEqual(['docs/TASK_BOARD.md']);
    expect(stale.manifest.fastPathReason).toBe('fingerprint-mismatch');
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
    expect(report.diagnostics).toMatchObject({
      state: 'stale',
      recommendedCommand: 'hadara context cache warm --execute --json',
      manifestChanges: {
        changedPathCount: 1,
        staleExtractorKeys: expect.arrayContaining(['extractTaskBoard'])
      },
      shardSummary: {
        plannedShardKeys: expect.arrayContaining(['extractTaskBoard', 'graphCore'])
      }
    });
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
    expect(report.diagnostics).toMatchObject({
      state: 'corrupt',
      recommendedCommandArgs: ['context', 'cache', 'warm', '--execute', '--json']
    });
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

  it('keeps task-board shard fresh across unrelated source-code changes and stales it on task-board edits', () => {
    const root = tempProject();
    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n');
    write(root, 'src/example.ts', 'export const before = 1;\n');
    const warm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-18T15:05:45.000Z'
    });
    const cached = readContextSourceManifestCache(root);
    expect(cached.status).toBe('valid');
    expect(warm.shards.items.find((item) => item.extractorKey === 'extractTaskBoard')?.executed).toBe(true);

    write(root, 'src/example.ts', 'export const after = 2;\n');
    const sourceOnlyManifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T15:05:50.000Z',
      previousManifest: cached.manifest
    });
    const sourceOnlyRead = readContextGraphExtractorShard({
      projectRoot: root,
      manifest: sourceOnlyManifest,
      extractorKey: 'extractTaskBoard'
    });
    expect(sourceOnlyRead.status).toBe('fresh');
    expect(sourceOnlyRead.hit).toBe(true);

    write(root, 'docs/TASK_BOARD.md', '# TASK_BOARD\n\nChanged\n');
    const taskBoardChangedManifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T15:05:55.000Z',
      previousManifest: sourceOnlyManifest
    });
    const taskBoardRead = readContextGraphExtractorShard({
      projectRoot: root,
      manifest: taskBoardChangedManifest,
      extractorKey: 'extractTaskBoard'
    });
    expect(taskBoardRead.status).toBe('stale');
    expect(taskBoardRead.hit).toBe(false);
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

function graphCoreFixtureProject(): string {
  const root = tempProject();
  write(root, 'docs/TASK_BOARD.md', [
    '# TASK_BOARD',
    '',
    '| ID | Title | Status | Capsule | Notes |',
    '|---|---|---|---|---|',
    '| T-0001 | Cached graph fixture | In Progress | tasks/T-0001-cached-graph-fixture | |',
    ''
  ].join('\n'));
  write(root, 'docs/PROJECT_STATE.md', '# PROJECT_STATE\n\nActive task: T-0001\n');
  write(root, 'docs/AGENT_HANDOFF.md', '# AGENT_HANDOFF\n\nActive task: T-0001\n');
  write(root, 'tasks/T-0001-cached-graph-fixture/TASK.md', [
    '# T-0001 Cached graph fixture',
    '',
    '## Metadata',
    '',
    '| Field | Value |',
    '|---|---|',
    '| ID | T-0001 |',
    '| Title | Cached graph fixture |',
    '| Status | In Progress |',
    '| Created | 2026-06-18 |',
    '| Updated | 2026-06-18 |',
    ''
  ].join('\n'));
  write(root, 'tasks/T-0001-cached-graph-fixture/evidence.jsonl', '{"taskId":"T-0001","summary":"initial evidence"}\n');
  return root;
}

function write(root: string, relativePath: string, content: string): void {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function initGitRepository(root: string): void {
  execFileSync('git', ['-C', root, 'init'], { stdio: 'ignore' });
  execFileSync('git', ['-C', root, 'add', '.'], { stdio: 'ignore' });
  execFileSync('git', ['-C', root, '-c', 'user.name=Hadara Test', '-c', 'user.email=hadara@example.test', 'commit', '-m', 'init'], { stdio: 'ignore' });
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
