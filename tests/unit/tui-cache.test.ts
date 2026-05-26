import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTuiReadModelWithCache, readTuiCache, resolveTuiCacheRoot } from '../../src/tui/cache';
import { buildHadaraContextContent } from '../../src/hermes/context-export';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-tui-cache-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('TUI local cache', () => {
  it('writes read-model cache only under .hadara/local/tui', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Cached TUI task');
    writeProjectDocs(root, task.id);

    const result = createTuiReadModelWithCache(root, { cache: { refresh: 'full' } });
    const cacheRoot = resolveTuiCacheRoot(root);

    expect(result.cache).toMatchObject({
      enabled: true,
      refresh: 'full',
      hit: false,
      path: '.hadara/local/tui/read-model-cache.json',
      issues: []
    });
    expect(fs.existsSync(path.join(cacheRoot, 'read-model-cache.json'))).toBe(true);
    expect(listProjectFiles(path.join(root, '.hadara'))).toEqual([path.join(cacheRoot, 'read-model-cache.json')]);

    const cache = readTuiCache({ projectRoot: root });
    expect(cache?.schemaVersion).toBe('hadara.tui.cache.v1');
    expect(cache?.taskIndex).toHaveLength(1);
    expect(cache?.model.selectedTaskId).toBe(task.id);
  });

  it('rejects cache roots outside .hadara/local/tui', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Cache boundary task');
    writeProjectDocs(root, task.id);

    const result = createTuiReadModelWithCache(root, {
      cache: { refresh: 'full', root: path.join(root, '.hadara', 'local', 'elsewhere') }
    });

    expect(result.cache.issues).toContainEqual({
      severity: 'warning',
      code: 'TUI_CACHE_WRITE_FAILED',
      message: 'TUI cache could not be written: TUI cache root must stay under .hadara/local/tui.'
    });
    expect(fs.existsSync(path.join(root, '.hadara', 'local', 'elsewhere'))).toBe(false);
  });

  it('uses a valid fast cache and invalidates when a task changes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Fast cache task');
    writeProjectDocs(root, task.id);

    createTuiReadModelWithCache(root, { cache: { refresh: 'full' } });
    const fast = createTuiReadModelWithCache(root, { cache: { refresh: 'fast' } });
    expect(fast.cache.hit).toBe(true);

    fs.appendFileSync(path.join(task.dir, 'TASK.md'), '\nCache invalidation note.\n', 'utf8');
    const invalidated = createTuiReadModelWithCache(root, { cache: { refresh: 'fast' } });
    expect(invalidated.cache.hit).toBe(false);
  });

  it('keeps TUI cache out of context export content', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Context export cache task');
    writeProjectDocs(root, task.id);

    createTuiReadModelWithCache(root, { cache: { refresh: 'full' } });
    const content = buildHadaraContextContent(root);

    expect(content).not.toContain('.hadara/local/tui');
    expect(content).not.toContain('hadara.tui.cache.v1');
    expect(content).not.toContain('read-model-cache.json');
  });

  it('refreshes selected detail from cached task summaries without scanning every capsule', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'First cached detail task');
    const second = createTaskCapsule(root, 'Second cached detail task');
    writeProjectDocs(root, second.id);
    createTuiReadModelWithCache(root, { cache: { refresh: 'full' } });

    const before = countReadDirCalls(() => {
      const result = createTuiReadModelWithCache(root, { selectedTaskId: first.id, cache: { refresh: 'detail' } });
      expect(result.cache.hit).toBe(true);
      expect(result.model.selectedTask?.summary.id).toBe(first.id);
      expect(result.model.selectedTask?.detail.files?.['TASK.md']).toContain('First cached detail task');
    });

    expect(before).toBe(0);
  });
});

function countReadDirCalls(fn: () => void): number {
  const original = fs.readdirSync;
  let count = 0;
  fs.readdirSync = ((...args: Parameters<typeof fs.readdirSync>) => {
    count += 1;
    return original(...args);
  }) as typeof fs.readdirSync;
  try {
    fn();
    return count;
  } finally {
    fs.readdirSync = original;
  }
}

function writeProjectDocs(root: string, activeTaskId: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase 0 / Phase 1 boundary.\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      `- ${activeTaskId} is current.`,
      '',
      '## Current Known Problems',
      '',
      '- Docker is the working validation path for now.',
      '',
      '## Last 3 Completed Tasks',
      '',
      '- T-0108 TUI Native Runtime Docs Assimilation: complete.',
      '',
      '## Next Recommended Step',
      '',
      '- Continue TUI local cache.',
      '',
      '## Validation Baseline',
      '',
      '- Latest full check: Docker npm run check passed',
      '- Latest done-level validation: T-0108 ok'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');
}

function listProjectFiles(root: string): string[] {
  const files: string[] = [];
  walk(root, files);
  return files.sort();
}

function walk(dir: string, files: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
}
