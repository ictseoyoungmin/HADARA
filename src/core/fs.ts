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

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'task';
}
