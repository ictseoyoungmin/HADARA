import crypto from 'node:crypto';
import fs from 'node:fs';
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

function listTaskProjectionEntries(projectRoot: string, previousById: Map<string, DashboardTaskProjectionEntry>): DashboardTaskProjectionEntry[] {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  return fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^T-\d{4}-/.test(entry.name))
    .map((entry) => buildTaskProjectionEntry(projectRoot, entry.name, previousById))
    .sort((left, right) => left.summary.id.localeCompare(right.summary.id));
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

function readTaskFields(taskPath: string, id: string, slug: string): { title: string; status: string } {
  if (!fs.existsSync(taskPath)) return { title: slug, status: 'Unknown' };
  const content = fs.readFileSync(taskPath, 'utf8');
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

function previousEntryReusable(previous: DashboardTaskProjectionEntry | undefined, next: DashboardTaskProjectionEntry): boolean {
  return Boolean(previous && fileSignalsEqual(previous.signals.taskMd, next.signals.taskMd) && fileSignalsEqual(previous.signals.evidence, next.signals.evidence));
}

function fileSignalsEqual(left: DashboardTaskFileSignal | undefined, right: DashboardTaskFileSignal | undefined): boolean {
  if (!left || !right) return left === right;
  return left.mtimeMs === right.mtimeMs && left.size === right.size && left.hash === right.hash;
}
