import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const RELEASE_INPUT_ROOTS = ['src/', 'tools/', 'scripts/'] as const;
export const RELEASE_INPUT_FILES = new Set([
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.tools.json',
  'vitest.config.ts',
  'vitest.dev.config.ts',
  'README.md',
  'LICENSE'
]);

export const RELEASE_PACKAGE_FILES = ['package.json', 'README.md', 'LICENSE'] as const;
export const RELEASE_PACKAGE_GENERATED_ROOTS = ['dist/'] as const;
export const RELEASE_PACKAGE_REQUIRED_FILES = [...RELEASE_PACKAGE_FILES, 'dist/cli/main.js'] as const;
export const RELEASE_PACKAGE_ALLOWED_ROOTS = [...RELEASE_PACKAGE_GENERATED_ROOTS, ...RELEASE_PACKAGE_FILES] as const;

export interface ReleaseInputInventory {
  files: string[];
  relevantUntrackedFiles: string[];
}

export function computeReleaseInputHash(projectRoot: string): string | undefined {
  const inventory = inspectReleaseInputInventory(projectRoot);
  if (inventory.relevantUntrackedFiles.length > 0) return undefined;
  const files = inventory.files;
  if (files.length === 0) return undefined;
  const hash = crypto.createHash('sha256');
  for (const relativePath of files) {
    const absolutePath = path.join(projectRoot, relativePath);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) return undefined;
    hash.update(relativePath);
    hash.update('\0');
    hash.update(fs.readFileSync(absolutePath));
    hash.update('\0');
  }
  return `sha256:${hash.digest('hex')}`;
}

export function inspectReleaseInputInventory(projectRoot: string): ReleaseInputInventory {
  const relevantUntrackedFiles = listRelevantUntrackedFiles(projectRoot);
  return {
    files: listReleaseInputFiles(projectRoot),
    relevantUntrackedFiles
  };
}

function listReleaseInputFiles(projectRoot: string): string[] {
  const gitFiles = spawnSync('git', ['ls-files', '-z'], { cwd: projectRoot, encoding: 'buffer', timeout: 10_000 });
  if (gitFiles.status === 0 && gitFiles.stdout) {
    return gitFiles.stdout.toString('utf8').split('\0').filter(Boolean).filter(isReleaseInputPath).sort();
  }

  const files: string[] = [];
  for (const root of RELEASE_INPUT_ROOTS) collectFiles(projectRoot, root.slice(0, -1), files);
  for (const file of RELEASE_INPUT_FILES) if (fs.existsSync(path.join(projectRoot, file))) files.push(file);
  return files.filter(isReleaseInputPath).sort();
}

function listRelevantUntrackedFiles(projectRoot: string): string[] {
  const result = spawnSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--ignored'], {
    cwd: projectRoot,
    encoding: 'buffer',
    timeout: 10_000
  });
  if (result.status !== 0 || !result.stdout) return [];
  const entries = result.stdout.toString('utf8').split('\0').filter(Boolean);
  const paths: string[] = [];
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const status = entry.slice(0, 2);
    const firstPath = entry.slice(3);
    if (status.includes('R') || status.includes('C')) index += 1;
    if ((status === '??' || status === '!!') && isReleaseInputPath(firstPath)) paths.push(firstPath);
  }
  return paths.sort();
}

function isReleaseInputPath(relativePath: string): boolean {
  const portable = relativePath.split(path.sep).join('/');
  return RELEASE_INPUT_ROOTS.some((root) => portable.startsWith(root)) || RELEASE_INPUT_FILES.has(portable);
}

function collectFiles(projectRoot: string, relativeRoot: string, files: string[]): void {
  const absoluteRoot = path.join(projectRoot, relativeRoot);
  if (!fs.existsSync(absoluteRoot)) return;
  for (const entry of fs.readdirSync(absoluteRoot, { withFileTypes: true })) {
    const relativePath = path.join(relativeRoot, entry.name);
    if (entry.isDirectory()) collectFiles(projectRoot, relativePath, files);
    else if (entry.isFile()) files.push(relativePath.split(path.sep).join('/'));
  }
}
