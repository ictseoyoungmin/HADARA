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
    expect(cache?.projectRoot).toBe('.');
    expect(cache?.sourceSignals.taskBoard).toMatchObject({ size: expect.any(Number), hash: expect.any(String) });
    expect(cache?.sourceSignals.tasksDir?.entries).toEqual([path.basename(task.dir)]);
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

  it('invalidates fast cache when a task capsule is created', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'Initial cache task');
    writeProjectDocs(root, first.id);

    createTuiReadModelWithCache(root, { cache: { refresh: 'full' } });
    const created = createTaskCapsule(root, 'New cache task');
    const result = createTuiReadModelWithCache(root, { cache: { refresh: 'fast' } });

    expect(result.cache.hit).toBe(false);
    expect(result.model.tasks.tasks.map((task) => task.id)).toContain(created.id);
  });

  it('invalidates fast cache when a task capsule is deleted', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'First cache task');
    const deleted = createTaskCapsule(root, 'Deleted cache task');
    writeProjectDocs(root, first.id);

    createTuiReadModelWithCache(root, { cache: { refresh: 'full' } });
    fs.rmSync(deleted.dir, { recursive: true, force: true });
    const result = createTuiReadModelWithCache(root, { cache: { refresh: 'fast' } });

    expect(result.cache.hit).toBe(false);
    expect(result.model.tasks.tasks.map((task) => task.id)).not.toContain(deleted.id);
  });

  it('invalidates fast cache when only TASK_BOARD changes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Task board cache task');
    writeProjectDocs(root, task.id);

    createTuiReadModelWithCache(root, { cache: { refresh: 'full' } });
    fs.appendFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '\n<!-- board-only cache change -->\n', 'utf8');
    const result = createTuiReadModelWithCache(root, { cache: { refresh: 'fast' } });

    expect(result.cache.hit).toBe(false);
  });

  it('reflects selected task evidence changes during detail refresh', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Selected evidence cache task');
    writeProjectDocs(root, task.id);

    createTuiReadModelWithCache(root, { selectedTaskId: task.id, cache: { refresh: 'full' } });
    appendEvidence(task.dir, task.id, 'selected evidence cache update');
    const result = createTuiReadModelWithCache(root, { selectedTaskId: task.id, cache: { refresh: 'detail' } });

    expect(result.cache.hit).toBe(false);
    expect(result.model.selectedTask?.evidence.records).toHaveLength(1);
    expect(result.model.selectedTask?.evidence.records[0]?.summary).toBe('selected evidence cache update');
  });

  it('does not cache read models that include private evidence metadata', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Private evidence cache task');
    writeProjectDocs(root, task.id);
    appendEvidence(task.dir, task.id, 'private cache metadata', 'private');

    const result = createTuiReadModelWithCache(root, {
      selectedTaskId: task.id,
      includePrivateEvidence: true,
      cache: { refresh: 'full' }
    });

    expect(result.cache).toMatchObject({
      enabled: false,
      hit: false,
      issues: [
        {
          severity: 'warning',
          code: 'TUI_PRIVATE_EVIDENCE_CACHE_DISABLED',
          message: 'TUI cache is disabled when includePrivateEvidence is true.'
        }
      ]
    });
    expect(result.model.selectedTask?.evidence.records[0]?.visibility).toBe('private');
    expect(fs.existsSync(resolveTuiCacheRoot(root))).toBe(false);
  });

  it('reuses task hashes on fast cache validation instead of reading every TASK.md', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'First performance cache task');
    createTaskCapsule(root, 'Second performance cache task');
    createTaskCapsule(root, 'Third performance cache task');
    writeProjectDocs(root, first.id);
    createTuiReadModelWithCache(root, { selectedTaskId: first.id, cache: { refresh: 'full' } });

    const taskReads = countTaskMarkdownReads(() => {
      const result = createTuiReadModelWithCache(root, { selectedTaskId: first.id, cache: { refresh: 'fast' } });
      expect(result.cache.hit).toBe(true);
    });

    expect(taskReads).toBeLessThanOrEqual(1);
  });

  it('reuses unchanged source signal hashes during fast validation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Source signal performance cache task');
    writeProjectDocs(root, task.id);
    fs.mkdirSync(path.join(root, '.hadara', 'local', 'state'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'local', 'state', 'active-run.json'), '{"schemaVersion":"hadara.activeRun.local.v1"}\n', 'utf8');
    appendEvidence(task.dir, task.id, 'source signal cache reuse');

    createTuiReadModelWithCache(root, { selectedTaskId: task.id, cache: { refresh: 'full' } });

    const sourceReads = countReadsMatching(
      [
        path.join(root, 'docs', 'TASK_BOARD.md'),
        path.join(root, 'docs', 'AGENT_HANDOFF.md'),
        path.join(root, '.hadara', 'local', 'state', 'active-run.json'),
        path.join(task.dir, 'evidence.jsonl')
      ],
      () => {
        const result = createTuiReadModelWithCache(root, { selectedTaskId: task.id, cache: { refresh: 'fast' } });
        expect(result.cache.hit).toBe(true);
      }
    );

    expect(sourceReads).toBe(0);
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

    const capsuleScans = countTaskCapsuleDirReads(() => {
      const result = createTuiReadModelWithCache(root, { selectedTaskId: first.id, cache: { refresh: 'detail' } });
      expect(result.cache.hit).toBe(true);
      expect(result.model.selectedTask?.summary.id).toBe(first.id);
      expect(result.model.selectedTask?.detail.files?.['TASK.md']).toContain('First cached detail task');
    });

    expect(capsuleScans).toBe(0);
  });
});

function countTaskCapsuleDirReads(fn: () => void): number {
  const original = fs.readdirSync;
  let count = 0;
  fs.readdirSync = ((...args: Parameters<typeof fs.readdirSync>) => {
    const dirPath = String(args[0]);
    if (new RegExp(`${path.sep}tasks${path.sep}T-\\d{4}-`).test(dirPath)) count += 1;
    return original(...args);
  }) as typeof fs.readdirSync;
  try {
    fn();
    return count;
  } finally {
    fs.readdirSync = original;
  }
}

function countTaskMarkdownReads(fn: () => void): number {
  const original = fs.readFileSync;
  let count = 0;
  fs.readFileSync = ((...args: Parameters<typeof fs.readFileSync>) => {
    const filePath = String(args[0]);
    if (filePath.endsWith(`${path.sep}TASK.md`)) count += 1;
    return original(...args);
  }) as typeof fs.readFileSync;
  try {
    fn();
    return count;
  } finally {
    fs.readFileSync = original;
  }
}

function countReadsMatching(paths: string[], fn: () => void): number {
  const normalized = new Set(paths.map((filePath) => path.normalize(filePath)));
  const original = fs.readFileSync;
  let count = 0;
  fs.readFileSync = ((...args: Parameters<typeof fs.readFileSync>) => {
    const filePath = path.normalize(String(args[0]));
    if (normalized.has(filePath)) count += 1;
    return original(...args);
  }) as typeof fs.readFileSync;
  try {
    fn();
    return count;
  } finally {
    fs.readFileSync = original;
  }
}

function appendEvidence(taskDir: string, taskId: string, summary: string, visibility: 'public' | 'private' = 'public'): void {
  fs.writeFileSync(
    path.join(taskDir, 'evidence.jsonl'),
    `${JSON.stringify({
      schemaVersion: 'hadara.evidence.v1',
      time: '2026-05-26T00:00:00.000Z',
      taskId,
      kind: 'note',
      summary,
      result: 'passed',
      visibility
    })}\n`,
    'utf8'
  );
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
