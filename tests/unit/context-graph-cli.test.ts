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
