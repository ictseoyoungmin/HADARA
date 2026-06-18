import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleContextCommand } from '../../src/cli/context';
import { validateSchema } from '../../src/core/schema';
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

  it('prints a schema-valid context pack report for a task without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI context pack');
    const before = snapshotProject(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'pack', '--task', task.id, '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.contextPack.v1',
      command: 'context.pack',
      ok: true,
      taskId: task.id,
      projectRoot: root,
      cache: { used: false, hit: false },
      sourceSummary: expect.objectContaining({
        graphAvailable: true,
        stateProjectionAvailable: true
      })
    });
    expect(payload.readFirst).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: `task:${task.id}`, type: 'Task', required: true })
    ]));
    expect(payload.validateWith.some((item: { command: string }) => item.command.includes(`task ready --task ${task.id}`))).toBe(true);
    expect(validateSchema('hadara.contextPack.v1', payload).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('prints code-aware context pack output when --include-code is supplied', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI code-aware context pack');
    fs.mkdirSync(path.join(root, 'src', 'cli'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'cli', 'context.ts'), 'export function handleContextCommand() {}\n', 'utf8');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'pack', '--task', task.id, '--include-code', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload.sourceSummary.codeIndexAvailable).toBe(true);
    expect(payload.issues).not.toContainEqual(expect.objectContaining({
      code: 'CONTEXT_PACK_CODE_INDEX_UNAVAILABLE'
    }));
    expect(validateSchema('hadara.contextPack.v1', payload).ok).toBe(true);
  });

  it('passes context pack budget options through to the report', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI budgeted context pack');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleContextCommand({
      args: ['context', 'pack', '--task', task.id, '--budget', '8000', '--max-items', '5', '--max-read-first', '2', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload.budget).toMatchObject({
      targetTokens: 8000,
      maxItems: 5,
      maxReadFirstItems: 2,
      mode: 'bounded'
    });
    expect(payload.readFirst.length).toBeLessThanOrEqual(2);
    expect(validateSchema('hadara.contextPack.v1', payload).ok).toBe(true);
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
