import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleContextCommand } from '../../src/cli/context';
import { handleSessionCommand } from '../../src/cli/session';
import { validateSchema } from '../../src/core/schema';
import { writeContextGraphExtractorShard } from '../../src/context/context-cache-store';
import { buildContextSourceManifest } from '../../src/context/source-manifest';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-graph-cli-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('context graph CLI', () => {
  it('prints a schema-valid full context graph report without writing files', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), '# RELEASE_READINESS\n', 'utf8');
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'graph', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.contextGraph.v1',
      command: 'context.graph',
      projectRoot: root,
      mode: 'full',
      cache: { used: false, hit: false }
    });
    expect(validateSchema('hadara.contextGraph.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('prints full context graph using fresh extractor shards without writing files', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), '# RELEASE_READINESS\n', 'utf8');
    const manifest = buildContextSourceManifest({
      projectRoot: root,
      generatedAt: '2026-06-18T16:00:00.000Z'
    });
    writeContextGraphExtractorShard({
      projectRoot: root,
      manifest,
      extractorKey: 'extractTaskBoard',
      createdAt: '2026-06-18T16:00:00.000Z',
      result: {
        source: {
          extractor: 'extractTaskBoard',
          paths: ['docs/TASK_BOARD.md'],
          sourceHash: 'sha256:cached-task-board'
        },
        nodes: [{
          id: 'task:T-9999',
          type: 'Task',
          label: 'T-9999 Cached Task',
          path: 'tasks/T-9999-cached/TASK.md',
          status: 'Cached',
          kind: 'task-board-row',
          source: {
            path: 'docs/TASK_BOARD.md',
            extractor: 'extractTaskBoard',
            hash: 'sha256:cached-task-board'
          }
        }],
        edges: [],
        stateSources: [{
          id: 'state-source:task-board',
          path: 'docs/TASK_BOARD.md',
          kind: 'task-board',
          hash: 'sha256:cached-task-board',
          extracted: { rows: 1, latestDoneTask: null, activeTasks: [] }
        }],
        issues: []
      }
    });
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'graph', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload.cache).toMatchObject({
      used: true,
      hit: true,
      mode: 'extractor-shards',
      hitShardCount: 1
    });
    expect(payload.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'task:T-9999', label: 'T-9999 Cached Task' })
    ]));
    expect(validateSchema('hadara.contextGraph.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('prints task-scoped context when --task is supplied', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI task context');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'graph', '--task', task.id, '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.contextGraph.v1',
      command: 'context.graph',
      mode: 'task',
      taskId: task.id,
      taskContext: {
        schemaVersion: 'hadara.taskContext.v1',
        taskId: task.id,
        readFirst: [expect.objectContaining({ id: `task:${task.id}`, type: 'Task' })]
      }
    });
    expect(validateSchema('hadara.contextGraph.v1', payload).ok).toBe(true);
    expect(validateSchema('hadara.taskContext.v1', payload.taskContext).ok).toBe(true);
  });

  it('prints code-aware graph output when --include-code is supplied', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), '# RELEASE_READINESS\n', 'utf8');
    fs.mkdirSync(path.join(root, 'src', 'cli'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'cli', 'context.ts'), 'export function handleContextCommand() {}\n', 'utf8');
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'graph', '--include-code', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'file:src/cli/context.ts', type: 'SourceFile' }),
      expect.objectContaining({ id: 'symbol:src/cli/context.ts#handleContextCommand', type: 'Symbol' })
    ]));
    expect(payload.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({ from: 'file:src/cli/context.ts', to: 'command:context.graph', type: 'IMPLEMENTS_COMMAND' })
    ]));
    expect(validateSchema('hadara.contextGraph.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('prints task-scoped code-aware graph output when --task and --include-code are supplied together', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI task context with code');
    fs.mkdirSync(path.join(root, 'src', 'cli'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'cli', 'context.ts'), 'export function handleContextCommand() {}\n', 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'graph', '--task', task.id, '--include-code', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      mode: 'task',
      taskId: task.id,
      taskContext: {
        taskId: task.id
      }
    });
    expect(payload.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'file:src/cli/context.ts', type: 'SourceFile' })
    ]));
    expect(validateSchema('hadara.contextGraph.v1', payload).ok).toBe(true);
    expect(validateSchema('hadara.taskContext.v1', payload.taskContext).ok).toBe(true);
  });

  it('does not expose context pack as a CLI subcommand', () => {
    const root = tempProject();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'pack', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(false);
    expect(log).not.toHaveBeenCalled();
  });

  it('prints a schema-valid session start report for a task without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI session start');
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleSessionCommand({
      args: ['session', 'start', '--task', task.id, '--max-read-first', '3', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.sessionStart.v1',
      command: 'session.start',
      ok: true,
      projectRoot: root,
      currentState: {
        recommendedNextTask: task.id
      },
      guidance: {
        mode: 'bounded-no-live',
        primaryNextAction: 'inspect-task',
        taskRequired: false
      },
      contextPack: {
        schemaVersion: 'hadara.contextPack.v1',
        taskId: task.id,
        cache: { used: false, hit: false }
      }
    });
    expect(payload.contextPack.readFirst.length).toBeLessThanOrEqual(3);
    expect(payload.lifecycle.primaryNextCommands).toEqual(expect.arrayContaining([
      `hadara task status --task ${task.id} --json`
    ]));
    expect(payload.guidance.commands).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'task-status',
        args: ['task', 'status', '--task', task.id, '--json']
      })
    ]));
    expect(validateSchema('hadara.sessionStart.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('prints a schema-valid context slice report without writing files', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'slice.md'), 'alpha\nbeta\ngamma\n', 'utf8');
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'slice', '--path', 'docs/slice.md', '--from', '2', '--to', '3', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.contextSlice.v1',
      command: 'context.slice',
      ok: true,
      path: 'docs/slice.md',
      strategy: 'explicit-range',
      slices: [expect.objectContaining({ startLine: 2, endLine: 3, text: 'beta\ngamma\n' })]
    });
    expect(validateSchema('hadara.contextSlice.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('prints a schema-valid context symbol slice report without writing files', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'src', 'cli'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'cli', 'symbol.ts'), [
      'const before = true;',
      'export function handleSymbolSlice() {',
      '  return before;',
      '}'
    ].join('\n'), 'utf8');
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'slice', '--path', 'src/cli/symbol.ts', '--symbol', 'handleSymbolSlice', '--window', '1', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.contextSlice.v1',
      command: 'context.slice',
      ok: true,
      path: 'src/cli/symbol.ts',
      strategy: 'symbol-neighborhood',
      slices: [expect.objectContaining({ startLine: 1, endLine: 3, confidence: 'derived' })]
    });
    expect(validateSchema('hadara.contextSlice.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('prints read-only context cache status without creating cache files', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'cache', 'status', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.context.cacheStatus.v1',
      command: 'context.cache.status',
      ok: true,
      projectRoot: root,
      readOnly: true,
      summary: {
        mode: 'miss',
        cachePresent: false,
        cacheFresh: false
      }
    });
    expect(validateSchema('hadara.context.cacheStatus.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('prints dry-run context cache warm without creating cache files', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'cache', 'warm', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.context.cacheWarm.v1',
      command: 'context.cache.warm',
      ok: true,
      mode: 'dry-run',
      summary: {
        cacheMode: 'miss',
        writePlanned: true,
        writeExecuted: false
      }
    });
    expect(validateSchema('hadara.context.cacheWarm.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('executes context cache warm and writes source manifest cache', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'cache', 'warm', '--execute', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.context.cacheWarm.v1',
      command: 'context.cache.warm',
      ok: true,
      mode: 'execute',
      summary: {
        cacheMode: 'miss',
        writePlanned: true,
        writeExecuted: true
      }
    });
    expect(validateSchema('hadara.context.cacheWarm.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toHaveProperty('.hadara/local/cache/context/source-manifest.json');
    expect(snapshotProject(root)).toHaveProperty('.hadara/local/cache/context/extractors/task-board.json');
    expect(snapshotProject(root)).toHaveProperty('.hadara/local/cache/context/graph-core.json');
    expect(snapshotProject(root)).toHaveProperty('.hadara/local/cache/context/code-index.json');
  });
});

function snapshotProject(root: string): Record<string, string> {
  const snapshot: Record<string, string> = {};
  for (const filePath of listFiles(root)) {
    snapshot[path.relative(root, filePath).replace(/\\/g, '/')] = fs.readFileSync(filePath, 'utf8');
  }
  return snapshot;
}

function listFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(entryPath));
    if (entry.isFile()) files.push(entryPath);
  }
  return files.sort();
}
