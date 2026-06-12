import fs from 'node:fs';
import path from 'node:path';

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeFileIfMissing(filePath: string, content: string): boolean {
  ensureDir(path.dirname(filePath));
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

export function appendLine(filePath: string, line: string): void {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, `${line}\n`, 'utf8');
}

export function readTextIfExists(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

export function writeJsonl(filePath: string, event: unknown): void {
  appendLine(filePath, JSON.stringify(event));
}

export interface PreparedAtomicTextFileWrite {
  relativePath: string;
  targetPath: string;
  tempPath: string;
  content: string;
  previousExists: boolean;
  previousContent: string;
}

export function prepareAtomicTextFileWrite(projectRoot: string, relativePath: string, content: string): PreparedAtomicTextFileWrite {
  const targetPath = path.join(projectRoot, relativePath);
  ensureDir(path.dirname(targetPath));
  const previousExists = fs.existsSync(targetPath);
  const previousContent = previousExists ? fs.readFileSync(targetPath, 'utf8') : '';
  const tempPath = uniqueTempPath(targetPath, 'write');
  fs.writeFileSync(tempPath, content, { encoding: 'utf8', flag: 'wx' });
  return { relativePath, targetPath, tempPath, content, previousExists, previousContent };
}

export function commitPreparedAtomicTextFileWrite(write: PreparedAtomicTextFileWrite): void {
  fs.renameSync(write.tempPath, write.targetPath);
}

export function cleanupPreparedAtomicTextFileWrite(write: PreparedAtomicTextFileWrite): void {
  if (fs.existsSync(write.tempPath)) fs.rmSync(write.tempPath, { force: true });
}

export function rollbackPreparedAtomicTextFileWrite(write: PreparedAtomicTextFileWrite): void {
  cleanupPreparedAtomicTextFileWrite(write);
  if (write.previousExists) {
    const rollbackTempPath = uniqueTempPath(write.targetPath, 'rollback');
    fs.writeFileSync(rollbackTempPath, write.previousContent, { encoding: 'utf8', flag: 'wx' });
    fs.renameSync(rollbackTempPath, write.targetPath);
  } else if (fs.existsSync(write.targetPath)) {
    fs.rmSync(write.targetPath, { force: true });
  }
}

export function atomicWriteTextFile(projectRoot: string, relativePath: string, content: string): void {
  const prepared = prepareAtomicTextFileWrite(projectRoot, relativePath, content);
  try {
    commitPreparedAtomicTextFileWrite(prepared);
  } catch (error) {
    cleanupPreparedAtomicTextFileWrite(prepared);
    throw error;
  }
}

function uniqueTempPath(targetPath: string, purpose: 'write' | 'rollback'): string {
  const dir = path.dirname(targetPath);
  const base = path.basename(targetPath);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = `${process.pid}-${Date.now()}-${attempt}-${Math.random().toString(16).slice(2)}`;
    const candidate = path.join(dir, `.hadara-atomic-${purpose}-${suffix}-${base}`);
    if (!fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`Could not allocate temporary path for ${targetPath}`);
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'task';
}
