import fs from 'node:fs';
import path from 'node:path';
import { toProjectRelativePath } from '../core/workspace';
import { createDashboardProjectFingerprint, createDashboardProjectReference, DashboardProjectReference } from './dashboard-cache';

export type DashboardProjectionSection = 'core' | 'task-detail' | 'timeline' | 'debt' | 'refresh-state' | 'source-signals';

export interface DashboardProjectionStoreOptions {
  projectRoot: string;
  storeRoot?: string;
  enabled?: boolean;
}

export interface DashboardProjectionRecord<T = unknown> {
  schemaVersion: 'hadara.dashboard.projection_record.v1';
  section: DashboardProjectionSection;
  key: string;
  generatedAt: string;
  project: DashboardProjectReference;
  body: T;
}

export interface DashboardProjectionWriteResult {
  path: string;
  bytes: number;
}

export function resolveDashboardProjectionStoreRoot(projectRoot: string): string {
  return path.join(projectRoot, '.hadara', 'local', 'cache', 'dashboard');
}

export function createDashboardProjectionRecord<T>(
  projectRoot: string,
  section: DashboardProjectionSection,
  key: string,
  body: T,
  generatedAt = new Date().toISOString()
): DashboardProjectionRecord<T> {
  assertProjectionPathPart(section, 'section');
  assertProjectionPathPart(key, 'key');
  return {
    schemaVersion: 'hadara.dashboard.projection_record.v1',
    section,
    key,
    generatedAt,
    project: createDashboardProjectReference(projectRoot),
    body
  };
}

export function dashboardProjectionFilePath(options: DashboardProjectionStoreOptions, section: DashboardProjectionSection, key: string): string {
  const storeRoot = normalizeDashboardProjectionStoreRoot(options);
  assertDashboardProjectionStoreRoot(options.projectRoot, storeRoot);
  assertProjectionPathPart(section, 'section');
  assertProjectionPathPart(key, 'key');
  const projectionPath = path.join(storeRoot, section, `${key}.json`);
  assertDashboardProjectionPath(storeRoot, projectionPath);
  return projectionPath;
}

export function readDashboardProjection<T>(
  options: DashboardProjectionStoreOptions,
  section: DashboardProjectionSection,
  key: string
): DashboardProjectionRecord<T> | null {
  if (options.enabled === false) return null;
  try {
    const filePath = dashboardProjectionFilePath(options, section, key);
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return isDashboardProjectionRecord<T>(parsed, options.projectRoot, section, key) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeDashboardProjection<T>(
  options: DashboardProjectionStoreOptions,
  record: DashboardProjectionRecord<T>
): DashboardProjectionWriteResult | null {
  if (options.enabled === false) return null;
  if (!isDashboardProjectionRecord<T>(record, options.projectRoot, record.section, record.key)) {
    throw new Error('Dashboard projection record does not match the configured project.');
  }
  assertDashboardProjectionBodyRedacted(options.projectRoot, record);
  const filePath = dashboardProjectionFilePath(options, record.section, record.key);
  const dir = path.dirname(filePath);
  const serialized = `${JSON.stringify(record, null, 2)}\n`;
  const tmpPath = path.join(dir, `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`);

  fs.mkdirSync(dir, { recursive: true });
  try {
    fs.writeFileSync(tmpPath, serialized, 'utf8');
    fs.renameSync(tmpPath, filePath);
  } catch (error) {
    try {
      if (fs.existsSync(tmpPath)) fs.rmSync(tmpPath, { force: true });
    } catch {
      // Best-effort cleanup only; preserve the original write failure.
    }
    throw error;
  }

  return {
    path: toProjectRelativePath(options.projectRoot, filePath),
    bytes: Buffer.byteLength(serialized, 'utf8')
  };
}

function normalizeDashboardProjectionStoreRoot(options: DashboardProjectionStoreOptions): string {
  return options.storeRoot ?? resolveDashboardProjectionStoreRoot(options.projectRoot);
}

function assertDashboardProjectionStoreRoot(projectRoot: string, storeRoot: string): void {
  const expectedRoot = resolveDashboardProjectionStoreRoot(projectRoot);
  assertInside(projectRoot, storeRoot, 'Dashboard projection store root must stay inside the project.');
  assertInside(expectedRoot, storeRoot, 'Dashboard projection store root must stay under .hadara/local/cache/dashboard.');
}

function assertDashboardProjectionPath(storeRoot: string, candidatePath: string): void {
  assertInside(storeRoot, candidatePath, 'Dashboard projection path must stay under the configured store root.');
}

function assertProjectionPathPart(value: string, label: string): void {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)) {
    throw new Error(`Dashboard projection ${label} must be a simple file-safe token.`);
  }
}

function assertDashboardProjectionBodyRedacted(projectRoot: string, record: DashboardProjectionRecord): void {
  const serialized = JSON.stringify(record);
  for (const rawPath of rawProjectPathCandidates(projectRoot)) {
    if (rawPath && serialized.includes(rawPath)) {
      throw new Error('Dashboard projection record must not contain raw project paths.');
    }
  }
}

function isDashboardProjectionRecord<T>(
  value: unknown,
  projectRoot: string,
  section: DashboardProjectionSection,
  key: string
): value is DashboardProjectionRecord<T> {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Partial<DashboardProjectionRecord<T>>;
  return (
    record.schemaVersion === 'hadara.dashboard.projection_record.v1' &&
    record.section === section &&
    record.key === key &&
    typeof record.generatedAt === 'string' &&
    typeof record.project === 'object' &&
    record.project !== null &&
    record.project.kind === 'project-root' &&
    record.project.pathRedacted === true &&
    record.project.fingerprint === createDashboardProjectFingerprint(projectRoot)
  );
}

function rawProjectPathCandidates(projectRoot: string): string[] {
  const candidates = new Set<string>([path.resolve(projectRoot)]);
  try {
    candidates.add(fs.realpathSync.native(projectRoot));
  } catch {
    try {
      candidates.add(fs.realpathSync(projectRoot));
    } catch {
      // The resolved project root is still checked when realpath is unavailable.
    }
  }
  return Array.from(candidates).filter((candidate) => candidate.length > 1);
}

function assertInside(root: string, candidatePath: string, message: string): void {
  const relative = path.relative(path.resolve(root), path.resolve(candidatePath));
  if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) return;
  throw new Error(message);
}
