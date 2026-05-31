import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../../package.json';

export interface RuntimeVersionReport {
  schemaVersion: 'hadara.runtime.version.v1';
  command: 'version.verbose';
  ok: boolean;
  cliEntry: string;
  cwd: string;
  projectRoot: string;
  packageVersion: string;
  git: {
    branch: string | null;
    head: string | null;
  };
  build: {
    distMtime: string | null;
    sourceMtime: string | null;
    distLooksStale: boolean;
  };
  node: {
    version: string;
  };
  issues: Array<{
    severity: 'warning' | 'error';
    code: string;
    message: string;
    path?: string;
  }>;
}

export interface RuntimeVersionOptions {
  cliEntry?: string;
  cwd?: string;
}

export function createRuntimeVersionReport(projectRoot: string, options: RuntimeVersionOptions = {}): RuntimeVersionReport {
  const cwd = options.cwd ?? process.cwd();
  const cliEntry = normalizePath(options.cliEntry ?? process.argv[1] ?? '');
  const issues: RuntimeVersionReport['issues'] = [];
  const distMtime = readFileMtime(cliEntry);
  if (!distMtime && cliEntry) {
    issues.push({
      severity: 'warning',
      code: 'CLI_ENTRY_MTIME_UNAVAILABLE',
      message: `Could not stat CLI entry: ${cliEntry}`,
      path: cliEntry
    });
  }

  const sourceMtime = readLatestSourceMtime(projectRoot);
  const distLooksStale = Boolean(distMtime && sourceMtime && sourceMtime.getTime() > distMtime.getTime() + 1000);
  if (distLooksStale) {
    issues.push({
      severity: 'warning',
      code: 'DIST_LOOKS_STALE',
      message: 'The newest source file is newer than the current CLI entry build output.'
    });
  }

  const git = readGitInfo(projectRoot, issues);
  return {
    schemaVersion: 'hadara.runtime.version.v1',
    command: 'version.verbose',
    ok: !issues.some((issue) => issue.severity === 'error'),
    cliEntry,
    cwd: normalizePath(cwd),
    projectRoot: normalizePath(projectRoot),
    packageVersion: packageJson.version,
    git,
    build: {
      distMtime: distMtime?.toISOString() ?? null,
      sourceMtime: sourceMtime?.toISOString() ?? null,
      distLooksStale
    },
    node: {
      version: process.version
    },
    issues
  };
}

function readGitInfo(projectRoot: string, issues: RuntimeVersionReport['issues']): RuntimeVersionReport['git'] {
  try {
    return {
      branch: execFileSync('git', ['-c', `safe.directory=${projectRoot}`, 'rev-parse', '--abbrev-ref', 'HEAD'], {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      }).trim(),
      head: execFileSync('git', ['-c', `safe.directory=${projectRoot}`, 'rev-parse', 'HEAD'], {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      }).trim()
    };
  } catch {
    issues.push({
      severity: 'warning',
      code: 'GIT_METADATA_UNAVAILABLE',
      message: 'Could not read git branch/head metadata for the project root.'
    });
    return { branch: null, head: null };
  }
}

function readFileMtime(filePath: string): Date | null {
  if (!filePath || !fs.existsSync(filePath)) return null;
  return fs.statSync(filePath).mtime;
}

function readLatestSourceMtime(projectRoot: string): Date | null {
  const roots = ['src', 'package.json', 'tsconfig.json'].map((relativePath) => path.join(projectRoot, relativePath));
  let latest: Date | null = null;
  for (const root of roots) {
    latest = maxDate(latest, readLatestMtime(root));
  }
  return latest;
}

function readLatestMtime(targetPath: string): Date | null {
  if (!fs.existsSync(targetPath)) return null;
  const stat = fs.statSync(targetPath);
  if (!stat.isDirectory()) return stat.mtime;

  let latest: Date | null = stat.mtime;
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    latest = maxDate(latest, readLatestMtime(path.join(targetPath, entry.name)));
  }
  return latest;
}

function maxDate(left: Date | null, right: Date | null): Date | null {
  if (!left) return right;
  if (!right) return left;
  return left.getTime() >= right.getTime() ? left : right;
}

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}
