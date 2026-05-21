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
  const portableRoot = path.resolve(input.portableRoot ?? process.env.HADARA_HOME ?? process.cwd());
  const projectRoot = path.resolve(input.projectRoot ?? process.env.HADARA_PROJECT_ROOT ?? process.cwd());
  const dataRoot = path.join(portableRoot, 'data');
  const projectHadaraDir = path.join(projectRoot, '.hadara');

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
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}
