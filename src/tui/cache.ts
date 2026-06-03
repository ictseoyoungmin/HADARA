import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { assertInsideProject, toProjectRelativePath } from '../core/workspace';
import { TaskJsonSummary } from '../services/task-read-model';
import { TuiReadModel, TuiReadModelOptions, createSelectedTaskReadModel, createTuiReadModel, createTuiTaskListReport } from './read-model';

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

export interface TuiFileSignal {
  mtimeMs: number;
  size: number;
  hash?: string;
}

export interface TuiDirectorySignal {
  entries: string[];
  mtimeMs?: number;
}

export interface TuiCacheSourceSignals {
  taskBoard?: TuiFileSignal;
  taskProjection?: TuiFileSignal;
  tasksDir?: TuiDirectorySignal;
  handoff?: TuiFileSignal;
  activeRun?: TuiFileSignal;
  selectedTask?: TuiFileSignal;
  selectedEvidence?: TuiFileSignal;
}

export interface TuiCacheRecord {
  schemaVersion: 'hadara.tui.cache.v1';
  projectRoot: string;
  generatedAt: string;
  sourceSignals: TuiCacheSourceSignals;
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
  return buildTaskIndexFromSummaries(projectRoot, createTuiTaskListReport(projectRoot).tasks);
}

export function refreshTaskIndex(projectRoot: string, previous: TuiTaskIndexEntry[]): TuiTaskIndexEntry[] {
  const previousById = new Map(previous.map((entry) => [entry.id, entry]));
  return buildTaskIndexFromSummaries(
    projectRoot,
    previous.map((entry) => ({
      id: entry.id,
      title: entry.title,
      status: entry.status,
      slug: path.basename(entry.capsule).replace(/^T-\d{4}-/, ''),
      capsule: entry.capsule
    })),
    previousById
  );
}

export function collectTuiCacheSourceSignals(projectRoot: string, selectedTask?: TaskJsonSummary | null, previous?: TuiCacheSourceSignals): TuiCacheSourceSignals {
  return {
    taskBoard: fileSignal(projectRoot, 'docs/TASK_BOARD.md', true, previous?.taskBoard),
    taskProjection: fileSignal(projectRoot, '.hadara/local/cache/dashboard/source-signals/tasks.json', false, previous?.taskProjection),
    tasksDir: undefined,
    handoff: fileSignal(projectRoot, 'docs/AGENT_HANDOFF.md', true, previous?.handoff),
    activeRun: fileSignal(projectRoot, '.hadara/local/state/active-run.json', true, previous?.activeRun),
    selectedTask: selectedTask ? fileSignal(projectRoot, path.join(selectedTask.capsule, 'TASK.md'), true, previous?.selectedTask) : undefined,
    selectedEvidence: selectedTask ? fileSignal(projectRoot, path.join(selectedTask.capsule, 'evidence.jsonl'), true, previous?.selectedEvidence) : undefined
  };
}

export function areTuiCacheSourceSignalsEqual(left: TuiCacheSourceSignals | undefined, right: TuiCacheSourceSignals): boolean {
  if (!left) return false;
  return (
    fileSignalsEqual(left.taskBoard, right.taskBoard) &&
    fileSignalsEqual(left.taskProjection, right.taskProjection) &&
    fileSignalsEqual(left.handoff, right.handoff) &&
    fileSignalsEqual(left.activeRun, right.activeRun) &&
    fileSignalsEqual(left.selectedTask, right.selectedTask) &&
    fileSignalsEqual(left.selectedEvidence, right.selectedEvidence)
  );
}

function sourceSignalsForCachedSelection(projectRoot: string, cached: TuiCacheRecord): TuiCacheSourceSignals {
  return collectTuiCacheSourceSignals(projectRoot, cached.model.selectedTask?.summary ?? null, cached.sourceSignals);
}

function validateCachedRecord(projectRoot: string, cached: TuiCacheRecord | null): { valid: boolean; taskIndex: TuiTaskIndexEntry[] } {
  if (!cached) return { valid: false, taskIndex: [] };
  const sourceSignals = sourceSignalsForCachedSelection(projectRoot, cached);
  if (!areTuiCacheSourceSignalsEqual(cached.sourceSignals, sourceSignals)) return { valid: false, taskIndex: [] };
  return { valid: true, taskIndex: cached.taskIndex };
}

function disablePrivateEvidenceCache(
  projectRoot: string,
  cachePath: string,
  refresh: TuiCacheRefreshMode,
  options: TuiCachedReadModelOptions
): TuiCachedReadModelResult {
  return {
    model: createTuiReadModel(projectRoot, options),
    cache: {
      enabled: false,
      refresh,
      hit: false,
      path: toProjectRelativePath(projectRoot, cachePath),
      issues: [
        {
          severity: 'warning',
          code: 'TUI_PRIVATE_EVIDENCE_CACHE_DISABLED',
          message: 'TUI cache is disabled when includePrivateEvidence is true.'
        }
      ]
    }
  };
}

export function createTuiReadModelWithCache(projectRoot: string, options: TuiCachedReadModelOptions = {}): TuiCachedReadModelResult {
  const refresh = options.cache?.refresh ?? 'fast';
  const cacheRoot = options.cache?.root ?? resolveTuiCacheRoot(projectRoot);
  const cachePath = path.join(cacheRoot, CACHE_FILE);
  const cacheOptions = { projectRoot, cacheRoot, enabled: options.cache?.enabled };
  const issues: TuiCachedReadModelResult['cache']['issues'] = [];

  if (options.includePrivateEvidence === true) {
    return disablePrivateEvidenceCache(projectRoot, cachePath, refresh, options);
  }

  if (options.cache?.enabled === false || refresh === 'none') {
    return {
      model: createTuiReadModel(projectRoot, options),
      cache: { enabled: options.cache?.enabled !== false, refresh, hit: false, path: toProjectRelativePath(projectRoot, cachePath), issues }
    };
  }

  const cached = readTuiCache(cacheOptions);
  const validation = validateCachedRecord(projectRoot, cached);
  const valid = validation.valid;

  if (refresh === 'detail' && cached && valid && options.selectedTaskId) {
    const selectedSummary = cached.model.tasks.tasks.find((task) => task.id === options.selectedTaskId) ?? null;
    if (selectedSummary) {
      const model = {
        ...cached.model,
        generatedAt: new Date().toISOString(),
        selectedTaskId: options.selectedTaskId,
        selectedTask: createSelectedTask(projectRoot, selectedSummary, options)
      };
      writeTuiCache(cacheOptions, createCacheRecord(projectRoot, model, validation.taskIndex));
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
  return createSelectedTaskReadModel(projectRoot, summary, options);
}

function createCacheRecord(projectRoot: string, model: TuiReadModel, taskIndex: TuiTaskIndexEntry[]): TuiCacheRecord {
  return {
    schemaVersion: 'hadara.tui.cache.v1',
    projectRoot: '.',
    generatedAt: new Date().toISOString(),
    sourceSignals: collectTuiCacheSourceSignals(projectRoot, model.selectedTask?.summary ?? null),
    taskIndex,
    model
  };
}

function buildTaskIndexFromSummaries(
  projectRoot: string,
  tasks: TaskJsonSummary[],
  previousById: Map<string, TuiTaskIndexEntry> = new Map()
): TuiTaskIndexEntry[] {
  return tasks.map((task) => {
    const taskPath = path.join(projectRoot, task.capsule, 'TASK.md');
    const previous = previousById.get(task.id);
    if (!fs.existsSync(taskPath)) {
      return {
        id: task.id,
        title: task.title,
        status: task.status,
        capsule: task.capsule,
        mtimeMs: 0,
        size: 0
      };
    }
    const stat = fs.statSync(taskPath);
    const hash =
      previous && previous.mtimeMs === stat.mtimeMs && previous.size === stat.size && previous.hash
        ? previous.hash
        : crypto.createHash('sha256').update(`${stat.mtimeMs}:${stat.size}`).digest('hex');
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      capsule: task.capsule,
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      hash
    };
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
    typeof record.sourceSignals === 'object' &&
    record.sourceSignals !== null &&
    Array.isArray(record.taskIndex) &&
    typeof record.model === 'object' &&
    record.model !== null &&
    record.model.schemaVersion === 'hadara.tui.read_model.internal.v1'
  );
}

function fileSignal(projectRoot: string, relativePath: string, includeHash: boolean, previous?: TuiFileSignal): TuiFileSignal | undefined {
  const filePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(filePath)) return undefined;
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) return undefined;
  const signal: TuiFileSignal = {
    mtimeMs: stat.mtimeMs,
    size: stat.size
  };
  if (includeHash) {
    signal.hash =
      previous && previous.mtimeMs === signal.mtimeMs && previous.size === signal.size && previous.hash
        ? previous.hash
        : crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
  }
  return signal;
}

function fileSignalsEqual(left: TuiFileSignal | undefined, right: TuiFileSignal | undefined): boolean {
  if (!left || !right) return left === right;
  return left.mtimeMs === right.mtimeMs && left.size === right.size && left.hash === right.hash;
}
