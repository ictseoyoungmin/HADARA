import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/** Filesystem-only primitives used by the close marker transaction. */
export interface AtomicJsonWriteSummary {
  contentWrites: number;
  fileFsyncs: number;
  directoryFsyncs: number;
  unchangedSkips: number;
}

export function hashObject(value: unknown): string {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')}`;
}

export function hashContent(value: string): string {
  return `sha256:${crypto.createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

export function readJsonObject(absolutePath: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export function jsonSemanticallyEqualIgnoringUpdatedAt(left: Record<string, unknown>, right: Record<string, unknown>): boolean {
  return JSON.stringify({ ...left, updatedAt: '' }) === JSON.stringify({ ...right, updatedAt: '' });
}

export function writeJsonAtomic(absolutePath: string, value: unknown): AtomicJsonWriteSummary {
  const tempPath = `${absolutePath}.${process.pid}.${Date.now()}.${crypto.randomUUID()}.tmp`;
  const payload = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(absolutePath) && fs.readFileSync(absolutePath, 'utf8') === payload) {
    return { contentWrites: 0, fileFsyncs: 0, directoryFsyncs: 0, unchangedSkips: 1 };
  }
  const fd = fs.openSync(tempPath, 'wx');
  try {
    fs.writeFileSync(fd, payload, 'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tempPath, absolutePath);
  let directoryFsyncs = 0;
  try {
    fsyncDirectoryBestEffort(path.dirname(absolutePath));
    directoryFsyncs = 1;
  } catch {
    // Directory fsync is best-effort across platforms/filesystems.
  }
  return { contentWrites: 1, fileFsyncs: 1, directoryFsyncs, unchangedSkips: 0 };
}

export function fsyncDirectoryBestEffort(dirPath: string): void {
  const dirFd = fs.openSync(dirPath, 'r');
  try {
    fs.fsyncSync(dirFd);
  } finally {
    fs.closeSync(dirFd);
  }
}

export function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

export function safeFilePart(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]/g, '_');
}
