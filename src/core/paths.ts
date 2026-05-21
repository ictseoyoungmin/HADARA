import fs from 'node:fs';
import path from 'node:path';

export interface HadaraPaths {
  portableRoot: string;
  dataRoot: string;
  configDir: string;
  secretsDir: string;
  sessionsDir: string;
  logsDir: string;
  auditDir: string;
  exportsDir: string;
  projectRoot: string;
  projectHadaraDir: string;
  projectDocsDir: string;
  projectTasksDir: string;
  projectContextDir: string;
}

export interface ResolveHadaraPathsInput {
  portableRoot?: string;
  projectRoot?: string;
}

export function resolveHadaraPaths(input: ResolveHadaraPathsInput = {}): HadaraPaths {
  const projectRoot = normalizeHadaraPath(input.projectRoot ?? process.env.HADARA_PROJECT_ROOT ?? process.cwd());
  const portableRoot = normalizeHadaraPath(
    input.portableRoot ?? process.env.HADARA_HOME ?? path.join(projectRoot, '.hadara', 'local', 'portable')
  );
  const dataRoot = path.join(portableRoot, 'data');
  const projectHadaraDir = path.join(projectRoot, '.hadara');
  assertProjectStoreBoundary({ dataRoot, projectRoot });

  return {
    portableRoot,
    dataRoot,
    configDir: path.join(dataRoot, 'config'),
    secretsDir: path.join(dataRoot, 'secrets'),
    sessionsDir: path.join(dataRoot, 'sessions'),
    logsDir: path.join(dataRoot, 'logs'),
    auditDir: path.join(dataRoot, 'audit'),
    exportsDir: path.join(dataRoot, 'exports'),
    projectRoot,
    projectHadaraDir,
    projectDocsDir: path.join(projectRoot, 'docs'),
    projectTasksDir: path.join(projectRoot, 'tasks'),
    projectContextDir: path.join(projectHadaraDir, 'context')
  };
}

export function isInside(parent: string, child: string): boolean {
  const normalizedParent = normalizeHadaraPath(parent);
  const normalizedChild = normalizeHadaraPath(child);
  const relative = path.relative(realpathIfExists(normalizedParent), realpathIfExists(normalizedChild));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export function normalizeHadaraPath(value: string): string {
  if (/^[A-Za-z]:[\\/]/.test(value)) {
    return path.win32.normalize(value);
  }
  return path.resolve(value);
}

export function assertProjectStoreBoundary(paths: Pick<HadaraPaths, 'dataRoot' | 'projectRoot'>): void {
  const projectDataDir = path.join(paths.projectRoot, 'data');
  if (isInside(projectDataDir, paths.dataRoot)) {
    throw new Error('HADARA dataRoot must not use projectRoot/data. Set HADARA_HOME outside the repo or use .hadara/local.');
  }
}

function realpathIfExists(value: string): string {
  try {
    return fs.realpathSync.native(value);
  } catch {
    return value;
  }
}
