import crypto from 'node:crypto';
import fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import path from 'node:path';
import {
  createDashboardProjectionRecord,
  readDashboardProjection,
  writeDashboardProjection
} from './dashboard-projection-store';

export interface DashboardTaskFileSignal {
  mtimeMs: number;
  size: number;
  hash?: string;
}

export interface DashboardTaskProjectionSummary {
  id: string;
  title: string;
  status: string;
  slug: string;
  capsule: string;
  evidenceRecords: number;
}

export interface DashboardTaskProjectionEntry {
  summary: DashboardTaskProjectionSummary;
  signals: {
    taskMd?: DashboardTaskFileSignal;
    evidence?: DashboardTaskFileSignal;
  };
}

export interface DashboardTaskProjectionIndex {
  schemaVersion: 'hadara.dashboard.task_projection_index.v1';
  generatedAt: string;
  tasks: DashboardTaskProjectionEntry[];
  changedTaskIds: string[];
  reusedTaskIds: string[];
}

export interface DashboardTaskProjectionProgress {
  processed: number;
  total: number;
  lastYieldAt: string;
}

export interface DashboardTaskProjectionRefreshOptions {
  batchSize?: number;
  onProgress?: (progress: DashboardTaskProjectionProgress) => void;
}

export function readDashboardTaskProjectionIndex(projectRoot: string): DashboardTaskProjectionIndex | null {
  const record = readDashboardProjection<DashboardTaskProjectionIndex>({ projectRoot }, 'source-signals', 'tasks');
  return record?.body?.schemaVersion === 'hadara.dashboard.task_projection_index.v1' ? record.body : null;
}

export function refreshDashboardTaskProjectionIndex(projectRoot: string, now = new Date()): DashboardTaskProjectionIndex {
  const previous = readDashboardTaskProjectionIndex(projectRoot);
  const previousById = new Map((previous?.tasks ?? []).map((entry) => [entry.summary.id, entry]));
  const tasks = listTaskProjectionEntries(projectRoot, previousById);
  const index: DashboardTaskProjectionIndex = {
    schemaVersion: 'hadara.dashboard.task_projection_index.v1',
    generatedAt: now.toISOString(),
    tasks,
    changedTaskIds: tasks.filter((entry) => !previousEntryReusable(previousById.get(entry.summary.id), entry)).map((entry) => entry.summary.id),
    reusedTaskIds: tasks.filter((entry) => previousEntryReusable(previousById.get(entry.summary.id), entry)).map((entry) => entry.summary.id)
  };
  writeDashboardProjection({ projectRoot }, createDashboardProjectionRecord(projectRoot, 'source-signals', 'tasks', index, index.generatedAt));
  return index;
}

export async function refreshDashboardTaskProjectionIndexAsync(
  projectRoot: string,
  now = new Date(),
  options: number | DashboardTaskProjectionRefreshOptions = {}
): Promise<DashboardTaskProjectionIndex> {
  const refreshOptions = typeof options === 'number' ? { batchSize: options } : options;
  const previous = readDashboardTaskProjectionIndex(projectRoot);
  const previousById = new Map((previous?.tasks ?? []).map((entry) => [entry.summary.id, entry]));
  const tasks = await listTaskProjectionEntriesAsync(projectRoot, previousById, refreshOptions);
  const index: DashboardTaskProjectionIndex = {
    schemaVersion: 'hadara.dashboard.task_projection_index.v1',
    generatedAt: now.toISOString(),
    tasks,
    changedTaskIds: tasks.filter((entry) => !previousEntryReusable(previousById.get(entry.summary.id), entry)).map((entry) => entry.summary.id),
    reusedTaskIds: tasks.filter((entry) => previousEntryReusable(previousById.get(entry.summary.id), entry)).map((entry) => entry.summary.id)
  };
  writeDashboardProjection({ projectRoot }, createDashboardProjectionRecord(projectRoot, 'source-signals', 'tasks', index, index.generatedAt));
  return index;
}

function listTaskProjectionEntries(projectRoot: string, previousById: Map<string, DashboardTaskProjectionEntry>): DashboardTaskProjectionEntry[] {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  return fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^T-\d{4}-/.test(entry.name))
    .map((entry) => buildTaskProjectionEntry(projectRoot, entry.name, previousById))
    .sort((left, right) => left.summary.id.localeCompare(right.summary.id));
}

async function listTaskProjectionEntriesAsync(
  projectRoot: string,
  previousById: Map<string, DashboardTaskProjectionEntry>,
  options: DashboardTaskProjectionRefreshOptions
): Promise<DashboardTaskProjectionEntry[]> {
  const tasksDir = path.join(projectRoot, 'tasks');
  try {
    const batchSize = options.batchSize ?? 25;
    const entries = await fsp.readdir(tasksDir, { withFileTypes: true });
    const names = entries.filter((entry) => entry.isDirectory() && /^T-\d{4}-/.test(entry.name)).map((entry) => entry.name);
    const tasks: DashboardTaskProjectionEntry[] = [];
    if (names.length === 0) {
      options.onProgress?.({ processed: 0, total: 0, lastYieldAt: new Date().toISOString() });
    }
    for (let index = 0; index < names.length; index += batchSize) {
      const batch = names.slice(index, index + batchSize);
      tasks.push(...(await Promise.all(batch.map((name) => buildTaskProjectionEntryAsync(projectRoot, name, previousById)))));
      const processed = Math.min(index + batch.length, names.length);
      const yieldedAt = new Date().toISOString();
      options.onProgress?.({ processed, total: names.length, lastYieldAt: yieldedAt });
      if (index + batchSize < names.length) await yieldToEventLoop();
    }
    return tasks.sort((left, right) => left.summary.id.localeCompare(right.summary.id));
  } catch {
    options.onProgress?.({ processed: 0, total: 0, lastYieldAt: new Date().toISOString() });
    return [];
  }
}

function buildTaskProjectionEntry(
  projectRoot: string,
  directoryName: string,
  previousById: Map<string, DashboardTaskProjectionEntry>
): DashboardTaskProjectionEntry {
  const [prefix, number, ...slugParts] = directoryName.split('-');
  const id = `${prefix}-${number}`;
  const slug = slugParts.join('-');
  const capsule = `tasks/${directoryName}`;
  const taskPath = path.join(projectRoot, capsule, 'TASK.md');
  const evidencePath = path.join(projectRoot, capsule, 'evidence.jsonl');
  const taskSignal = fileSignal(taskPath);
  const evidenceSignal = fileSignal(evidencePath);
  const previous = previousById.get(id);
  const taskStable = fileSignalsEqual(previous?.signals.taskMd, taskSignal);
  const evidenceStable = fileSignalsEqual(previous?.signals.evidence, evidenceSignal);
  const taskFields = taskStable && previous ? previous.summary : readTaskFields(taskPath, id, slug);
  const evidenceRecords = evidenceStable && previous ? previous.summary.evidenceRecords : countEvidenceRecords(evidencePath);

  return {
    summary: {
      id,
      title: taskFields.title,
      status: taskFields.status,
      slug,
      capsule,
      evidenceRecords
    },
    signals: {
      taskMd: taskSignal,
      evidence: evidenceSignal
    }
  };
}

async function buildTaskProjectionEntryAsync(
  projectRoot: string,
  directoryName: string,
  previousById: Map<string, DashboardTaskProjectionEntry>
): Promise<DashboardTaskProjectionEntry> {
  const [prefix, number, ...slugParts] = directoryName.split('-');
  const id = `${prefix}-${number}`;
  const slug = slugParts.join('-');
  const capsule = `tasks/${directoryName}`;
  const taskPath = path.join(projectRoot, capsule, 'TASK.md');
  const evidencePath = path.join(projectRoot, capsule, 'evidence.jsonl');
  const taskSignal = await fileSignalAsync(taskPath);
  const evidenceSignal = await fileSignalAsync(evidencePath);
  const previous = previousById.get(id);
  const taskStable = fileSignalsEqual(previous?.signals.taskMd, taskSignal);
  const evidenceStable = fileSignalsEqual(previous?.signals.evidence, evidenceSignal);
  const taskFields = taskStable && previous ? previous.summary : await readTaskFieldsAsync(taskPath, id, slug);
  const evidenceRecords = evidenceStable && previous ? previous.summary.evidenceRecords : await countEvidenceRecordsAsync(evidencePath);

  return {
    summary: {
      id,
      title: taskFields.title,
      status: taskFields.status,
      slug,
      capsule,
      evidenceRecords
    },
    signals: {
      taskMd: taskSignal,
      evidence: evidenceSignal
    }
  };
}

function readTaskFields(taskPath: string, id: string, slug: string): { title: string; status: string } {
  if (!fs.existsSync(taskPath)) return { title: slug, status: 'Unknown' };
  const content = fs.readFileSync(taskPath, 'utf8');
  const title = content.split(/\r?\n/)[0]?.replace(new RegExp(`^#\\s*${id}\\s*`), '').trim() || slug;
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  const status = match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
  return { title, status };
}

async function readTaskFieldsAsync(taskPath: string, id: string, slug: string): Promise<{ title: string; status: string }> {
  try {
    const content = await fsp.readFile(taskPath, 'utf8');
    return parseTaskFields(content, id, slug);
  } catch {
    return { title: slug, status: 'Unknown' };
  }
}

function parseTaskFields(content: string, id: string, slug: string): { title: string; status: string } {
  const title = content.split(/\r?\n/)[0]?.replace(new RegExp(`^#\\s*${id}\\s*`), '').trim() || slug;
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  const status = match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
  return { title, status };
}

function countEvidenceRecords(evidencePath: string): number {
  if (!fs.existsSync(evidencePath)) return 0;
  return fs
    .readFileSync(evidencePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('{')).length;
}

async function countEvidenceRecordsAsync(evidencePath: string): Promise<number> {
  try {
    const content = await fsp.readFile(evidencePath, 'utf8');
    return countEvidenceRecordLines(content);
  } catch {
    return 0;
  }
}

function countEvidenceRecordLines(content: string): number {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('{')).length;
}

function fileSignal(filePath: string): DashboardTaskFileSignal | undefined {
  if (!fs.existsSync(filePath)) return undefined;
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) return undefined;
  return {
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    hash: crypto.createHash('sha256').update(`${stat.mtimeMs}:${stat.size}`).digest('hex')
  };
}

async function fileSignalAsync(filePath: string): Promise<DashboardTaskFileSignal | undefined> {
  try {
    const stat = await fsp.stat(filePath);
    if (!stat.isFile()) return undefined;
    return {
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      hash: crypto.createHash('sha256').update(`${stat.mtimeMs}:${stat.size}`).digest('hex')
    };
  } catch {
    return undefined;
  }
}

function previousEntryReusable(previous: DashboardTaskProjectionEntry | undefined, next: DashboardTaskProjectionEntry): boolean {
  return Boolean(previous && fileSignalsEqual(previous.signals.taskMd, next.signals.taskMd) && fileSignalsEqual(previous.signals.evidence, next.signals.evidence));
}

function fileSignalsEqual(left: DashboardTaskFileSignal | undefined, right: DashboardTaskFileSignal | undefined): boolean {
  if (!left || !right) return left === right;
  return left.mtimeMs === right.mtimeMs && left.size === right.size && left.hash === right.hash;
}

function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
