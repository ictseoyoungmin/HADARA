import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { assertInsideProject, toProjectRelativePath } from '../core/workspace';
import { parseEvidenceIndexFile } from '../services/evidence-list';
import { TaskJsonSummary, TaskReadReport } from '../services/task-read-model';
import { TuiReadModel, TuiReadModelOptions, createTuiReadModel } from './read-model';

export type TuiCacheRefreshMode = 'full' | 'fast' | 'detail' | 'none';

export interface TuiCacheOptions {
  projectRoot: string;
  cacheRoot?: string;
  enabled?: boolean;
}

export interface TuiTaskIndexEntry {
  id: string;
  title: string;
  status: string;
  capsule: string;
  mtimeMs: number;
  size: number;
  hash?: string;
}

export interface TuiCacheRecord {
  schemaVersion: 'hadara.tui.cache.v1';
  projectRoot: string;
  generatedAt: string;
  taskIndex: TuiTaskIndexEntry[];
  model: TuiReadModel;
}

export interface TuiCachedReadModelOptions extends TuiReadModelOptions {
  cache?: {
    enabled?: boolean;
    root?: string;
    refresh?: TuiCacheRefreshMode;
  };
}

export interface TuiCachedReadModelResult {
  model: TuiReadModel;
  cache: {
    enabled: boolean;
    refresh: TuiCacheRefreshMode;
    hit: boolean;
    path: string;
    issues: Array<{ severity: 'warning'; code: string; message: string }>;
  };
}

const CACHE_FILE = 'read-model-cache.json';
const TASK_CAPSULE_FILES = [
  'TASK.md',
  'PLAN.md',
  'CONTEXT.md',
  'ACCEPTANCE.md',
  'FILES.md',
  'TESTS.md',
  'RISKS.md',
  'DECISIONS.md',
  'EVIDENCE.md',
  'evidence.jsonl',
  'HANDOFF.md'
];

export function resolveTuiCacheRoot(projectRoot: string): string {
  return path.join(projectRoot, '.hadara', 'local', 'tui');
}

export function readTuiCache(options: TuiCacheOptions): TuiCacheRecord | null {
  if (options.enabled === false) return null;
  try {
    const cachePath = tuiCacheFilePath(options);
    const parsed = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    return isTuiCacheRecord(parsed, options.projectRoot) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeTuiCache(options: TuiCacheOptions, record: TuiCacheRecord): void {
  if (options.enabled === false) return;
  const cacheRoot = normalizeTuiCacheRoot(options);
  const cachePath = path.join(cacheRoot, CACHE_FILE);
  assertTuiCachePath(options.projectRoot, cachePath, options.cacheRoot);
  fs.mkdirSync(cacheRoot, { recursive: true });
  fs.writeFileSync(cachePath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
}

export function buildTaskIndex(projectRoot: string): TuiTaskIndexEntry[] {
  const model = createTuiReadModel(projectRoot);
  return buildTaskIndexFromSummaries(projectRoot, model.tasks.tasks);
}

export function refreshTaskIndex(projectRoot: string, previous: TuiTaskIndexEntry[]): TuiTaskIndexEntry[] {
  const current = buildTaskIndex(projectRoot);
  const previousById = new Map(previous.map((entry) => [entry.id, entry]));
  return current.map((entry) => {
    const oldEntry = previousById.get(entry.id);
    if (oldEntry && oldEntry.mtimeMs === entry.mtimeMs && oldEntry.size === entry.size && oldEntry.hash) {
      return { ...entry, hash: oldEntry.hash };
    }
    return entry;
  });
}

export function createTuiReadModelWithCache(projectRoot: string, options: TuiCachedReadModelOptions = {}): TuiCachedReadModelResult {
  const refresh = options.cache?.refresh ?? 'fast';
  const cacheRoot = options.cache?.root ?? resolveTuiCacheRoot(projectRoot);
  const cachePath = path.join(cacheRoot, CACHE_FILE);
  const cacheOptions = { projectRoot, cacheRoot, enabled: options.cache?.enabled };
  const issues: TuiCachedReadModelResult['cache']['issues'] = [];

  if (options.cache?.enabled === false || refresh === 'none') {
    return {
      model: createTuiReadModel(projectRoot, options),
      cache: { enabled: options.cache?.enabled !== false, refresh, hit: false, path: toProjectRelativePath(projectRoot, cachePath), issues }
    };
  }

  const cached = readTuiCache(cacheOptions);
  const taskIndex = buildTaskIndexFromSummaries(projectRoot, cached?.model.tasks.tasks ?? createTuiReadModel(projectRoot, options).tasks.tasks);
  const valid = cached ? taskIndexesEqual(cached.taskIndex, taskIndex) : false;

  if (refresh === 'detail' && cached && valid && options.selectedTaskId) {
    const selectedSummary = cached.model.tasks.tasks.find((task) => task.id === options.selectedTaskId) ?? null;
    if (selectedSummary) {
      const model = {
        ...cached.model,
        generatedAt: new Date().toISOString(),
        selectedTaskId: options.selectedTaskId,
        selectedTask: createSelectedTask(projectRoot, selectedSummary, options)
      };
      writeTuiCache(cacheOptions, createCacheRecord(projectRoot, model, taskIndex));
      return { model, cache: { enabled: true, refresh, hit: true, path: toProjectRelativePath(projectRoot, cachePath), issues } };
    }
  }

  if (refresh === 'fast' && cached && valid) {
    return { model: cached.model, cache: { enabled: true, refresh, hit: true, path: toProjectRelativePath(projectRoot, cachePath), issues } };
  }

  const model = createTuiReadModel(projectRoot, options);
  try {
    writeTuiCache(cacheOptions, createCacheRecord(projectRoot, model, buildTaskIndexFromSummaries(projectRoot, model.tasks.tasks)));
  } catch (error) {
    issues.push({
      severity: 'warning',
      code: 'TUI_CACHE_WRITE_FAILED',
      message: `TUI cache could not be written: ${error instanceof Error ? error.message : String(error)}`
    });
  }
  return { model, cache: { enabled: true, refresh, hit: false, path: toProjectRelativePath(projectRoot, cachePath), issues } };
}

function createSelectedTask(projectRoot: string, summary: TaskJsonSummary, options: TuiReadModelOptions): NonNullable<TuiReadModel['selectedTask']> {
  const detail = createTaskReadReportFromSummary(projectRoot, summary, options);
  const evidenceRecords = detail.evidenceIndex ?? [];
  const limit = Math.max(0, Math.floor(options.evidenceLimit ?? 20));
  return {
    summary,
    detail,
    evidence: {
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      ok: detail.ok,
      taskId: summary.id,
      count: evidenceRecords.slice(0, limit).length,
      records: evidenceRecords.slice(0, limit),
      issues: detail.issues
    }
  };
}

function createTaskReadReportFromSummary(projectRoot: string, summary: TaskJsonSummary, options: TuiReadModelOptions): TaskReadReport {
  const taskDir = path.join(projectRoot, summary.capsule);
  assertInsideProject(projectRoot, taskDir, summary.capsule);
  const files = Object.fromEntries(
    TASK_CAPSULE_FILES.map((fileName) => {
      const filePath = path.join(taskDir, fileName);
      return [fileName, fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''];
    })
  );
  const parsed = parseEvidenceIndexFile(path.join(taskDir, 'evidence.jsonl'), summary.id);
  const includePrivate = options.includePrivateEvidence === true;
  const evidenceIndex = parsed.records.filter((record) => includePrivate || record.visibility !== 'private');
  files['evidence.jsonl'] = evidenceIndex.length ? `${evidenceIndex.map((record) => JSON.stringify(record)).join('\n')}\n` : '';
  return {
    schemaVersion: 'hadara.task.read.v1',
    command: 'task.read',
    ok: !parsed.issues.some((issue) => issue.severity === 'error'),
    task: summary,
    files,
    evidenceIndex,
    issues: parsed.issues
  };
}

function createCacheRecord(projectRoot: string, model: TuiReadModel, taskIndex: TuiTaskIndexEntry[]): TuiCacheRecord {
  return {
    schemaVersion: 'hadara.tui.cache.v1',
    projectRoot: '.',
    generatedAt: new Date().toISOString(),
    taskIndex,
    model
  };
}

function buildTaskIndexFromSummaries(projectRoot: string, tasks: TaskJsonSummary[]): TuiTaskIndexEntry[] {
  return tasks.map((task) => {
    const taskPath = path.join(projectRoot, task.capsule, 'TASK.md');
    const stat = fs.statSync(taskPath);
    const content = fs.readFileSync(taskPath);
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      capsule: task.capsule,
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      hash: crypto.createHash('sha256').update(content).digest('hex')
    };
  });
}

function taskIndexesEqual(left: TuiTaskIndexEntry[], right: TuiTaskIndexEntry[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((entry, index) => {
    const other = right[index];
    return Boolean(
      other &&
        entry.id === other.id &&
        entry.capsule === other.capsule &&
        entry.mtimeMs === other.mtimeMs &&
        entry.size === other.size &&
        entry.hash === other.hash
    );
  });
}

function tuiCacheFilePath(options: TuiCacheOptions): string {
  const cacheRoot = normalizeTuiCacheRoot(options);
  const cachePath = path.join(cacheRoot, CACHE_FILE);
  assertTuiCachePath(options.projectRoot, cachePath, options.cacheRoot);
  return cachePath;
}

function normalizeTuiCacheRoot(options: TuiCacheOptions): string {
  return options.cacheRoot ?? resolveTuiCacheRoot(options.projectRoot);
}

function assertTuiCachePath(projectRoot: string, candidatePath: string, explicitRoot?: string): void {
  const root = explicitRoot ?? resolveTuiCacheRoot(projectRoot);
  assertInsideProject(projectRoot, root);
  if (path.relative(resolveTuiCacheRoot(projectRoot), root).startsWith('..')) {
    throw new Error('TUI cache root must stay under .hadara/local/tui.');
  }
  if (path.relative(root, candidatePath).startsWith('..')) {
    throw new Error('TUI cache path must stay under the configured cache root.');
  }
}

function isTuiCacheRecord(value: unknown, projectRoot: string): value is TuiCacheRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Partial<TuiCacheRecord>;
  return (
    record.schemaVersion === 'hadara.tui.cache.v1' &&
    record.projectRoot === '.' &&
    typeof record.generatedAt === 'string' &&
    Array.isArray(record.taskIndex) &&
    typeof record.model === 'object' &&
    record.model !== null &&
    record.model.schemaVersion === 'hadara.tui.read_model.internal.v1'
  );
}
