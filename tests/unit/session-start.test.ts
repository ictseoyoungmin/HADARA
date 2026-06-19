import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { buildSessionStartReport } from '../../src/context/session-start';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-session-start-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('session start', () => {
  it('builds a schema-valid bounded packet from context pack without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Session start task');
    const before = snapshotProject(root);

    const report = buildSessionStartReport({
      projectRoot: root,
      taskId: task.id,
      generatedAt: '2026-06-19T12:00:00.000Z',
      budget: { maxReadFirstItems: 3, maxItems: 8 }
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.sessionStart.v1',
      command: 'session.start',
      ok: true,
      projectRoot: root,
      currentState: {
        recommendedNextTask: task.id
      },
      contextPack: {
        schemaVersion: 'hadara.contextPack.v1',
        taskId: task.id
      },
      cache: { used: false, hit: false }
    });
    expect(report.contextPack.readFirst.length).toBeLessThanOrEqual(3);
    expect(report.lifecycle.primaryNextCommands).toEqual(expect.arrayContaining([
      `node dist/cli/main.js task status --task ${task.id} --json`,
      `node dist/cli/main.js context pack --task ${task.id} --json`,
      `node dist/cli/main.js task ready --task ${task.id} --level done --json`
    ]));
    expect(report.lifecycle.diagnosticCommands).toEqual(expect.arrayContaining([
      'node dist/cli/main.js context cache status --json',
      `node dist/cli/main.js context graph --task ${task.id} --json`,
      'node dist/cli/main.js state verify --json'
    ]));
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
    expect(validateSchema('hadara.contextPack.v1', report.contextPack).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('surfaces context-pack errors when no task is available', () => {
    const root = tempProject();

    const report = buildSessionStartReport({
      projectRoot: root,
      generatedAt: '2026-06-19T12:00:00.000Z'
    });

    expect(report.ok).toBe(false);
    expect(report.lifecycle.primaryNextCommands).toEqual(['node dist/cli/main.js task next --json']);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'CONTEXT_PACK_TASK_NOT_FOUND', severity: 'error' })
    ]));
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
  });
});

function snapshotProject(root: string): string[] {
  const entries: string[] = [];
  walk(root, root, entries);
  return entries.sort();
}

function walk(root: string, dir: string, entries: string[]): void {
  for (const name of fs.readdirSync(dir).sort()) {
    const fullPath = path.join(dir, name);
    const relative = path.relative(root, fullPath).split(path.sep).join('/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      entries.push(`${relative}/`);
      walk(root, fullPath, entries);
    } else {
      entries.push(`${relative}:${stat.size}`);
    }
  }
}
