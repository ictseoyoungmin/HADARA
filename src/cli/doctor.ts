import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../../package.json';
import { HadaraPaths } from '../core/paths';
import { readSlicesState, slicesProjectionDrift, SLICES_PROJECTION_PATH } from '../services/slices-state';

export type DoctorCheckStatus = 'ok' | 'missing' | 'drift';

export interface DoctorCheck {
  id: string;
  status: DoctorCheckStatus;
  path?: string;
  detail?: string;
}

export interface DoctorReport {
  schemaVersion: 'hadara.doctor.v1';
  command: 'doctor';
  ok: boolean;
  runtime: {
    node: string;
    nodePath: string;
  };
  installation: {
    executablePath: string | null;
    resolvedExecutablePath: string | null;
    packageRoot: string | null;
    packageVersion: string;
    registry: string;
    installCommand: string;
    latestInstallCommand: string;
  };
  paths: {
    portableRoot: string;
    dataRoot: string;
    projectRoot: string;
  };
  checks: DoctorCheck[];
}

export interface DoctorReportOptions {
  cliEntry?: string;
  nodePath?: string;
}

export function createDoctorReport(paths: HadaraPaths, nodeVersion = process.version, options: DoctorReportOptions = {}): DoctorReport {
  const projectContextPath = resolveProjectContextPath(paths);
  const checks: DoctorCheck[] = [
    pathCheck('docs', paths.projectDocsDir),
    pathCheck('tasks', paths.projectTasksDir),
    pathCheck('project-context', projectContextPath)
  ];
  // FD-012 ownership-contract check: the generated slices projection must
  // match its canonical state; hand edits are surfaced here instead of
  // being silently overwritten by the next render.
  const slices = readSlicesState(paths.projectRoot);
  if (slices.state) {
    const drift = slicesProjectionDrift(paths.projectRoot, slices.state);
    checks.push({
      id: 'slices-projection',
      status: drift.driftDetected ? 'drift' : 'ok',
      path: SLICES_PROJECTION_PATH,
      ...(drift.driftDetected
        ? { detail: `${SLICES_PROJECTION_PATH} does not match the rendered slices state. Run \`hadara slice render\` to discard the manual edit or \`hadara slice migrate --execute\` to import it into state.` }
        : {})
    });
  }
  const executablePath = normalizeOptionalPath(options.cliEntry ?? process.argv[1] ?? null);
  const resolvedExecutablePath = resolveExecutablePath(executablePath);
  const packageRoot = findPackageRoot([resolvedExecutablePath, executablePath]);

  return {
    schemaVersion: 'hadara.doctor.v1',
    command: 'doctor',
    ok: checks.every((check) => check.status === 'ok'),
    runtime: {
      node: nodeVersion,
      nodePath: normalizePath(options.nodePath ?? process.execPath)
    },
    installation: {
      executablePath,
      resolvedExecutablePath,
      packageRoot,
      packageVersion: packageJson.version,
      registry: 'https://registry.npmjs.org',
      installCommand: `npm install -g ${packageJson.name}@${packageJson.version}`,
      latestInstallCommand: `npm install -g ${packageJson.name}`
    },
    paths: {
      portableRoot: paths.portableRoot,
      dataRoot: paths.dataRoot,
      projectRoot: paths.projectRoot
    },
    checks
  };
}

function resolveProjectContextPath(paths: HadaraPaths): string {
  const contextPath = path.join(paths.projectContextDir, 'HADARA_CONTEXT.md');
  if (fs.existsSync(contextPath)) return contextPath;
  const readMapPath = path.join(paths.projectContextDir, 'READ_MAP.md');
  if (fs.existsSync(readMapPath)) return readMapPath;
  return contextPath;
}

export function formatDoctorReport(report: DoctorReport): string {
  return [
    '[HADARA] Doctor',
    `portableRoot: ${report.paths.portableRoot}`,
    `dataRoot:     ${report.paths.dataRoot}`,
    `projectRoot:  ${report.paths.projectRoot}`,
    `Node:         ${report.runtime.node}`,
    `Node path:    ${report.runtime.nodePath}`,
    'Install:',
    `  executable: ${report.installation.executablePath ?? 'unknown'}`,
    `  resolved:   ${report.installation.resolvedExecutablePath ?? 'unknown'}`,
    `  package:    ${report.installation.packageVersion}${report.installation.packageRoot ? ` at ${report.installation.packageRoot}` : ' (package root unknown)'}`,
    `  registry:   ${report.installation.registry}`,
    `  install:    ${report.installation.installCommand}`,
    ...report.checks.map((check) => `${formatCheckLabel(check.id)}${check.status}`)
  ].join('\n');
}

export interface DoctorCommandInput {
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handleDoctorCommand(input: DoctorCommandInput): boolean {
  const report = createDoctorReport(input.paths, process.version, { cliEntry: process.argv[1] });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatDoctorReport(report));
  }
  if (!report.ok) process.exitCode = 7;
  return true;
}

function pathCheck(id: string, targetPath: string): DoctorCheck {
  return {
    id,
    status: fs.existsSync(targetPath) ? 'ok' : 'missing',
    path: targetPath
  };
}

function normalizeOptionalPath(value: string | null): string | null {
  if (!value) return null;
  return normalizePath(value);
}

function normalizePath(value: string): string {
  return path.normalize(value);
}

function resolveExecutablePath(executablePath: string | null): string | null {
  if (!executablePath) return null;
  try {
    return normalizePath(fs.realpathSync.native(executablePath));
  } catch {
    return null;
  }
}

function findPackageRoot(candidates: Array<string | null>): string | null {
  for (const candidate of candidates) {
    const found = candidate ? findPackageRootFromFile(candidate) : null;
    if (found) return found;
  }
  return null;
}

function findPackageRootFromFile(filePath: string): string | null {
  let current = fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
    ? filePath
    : path.dirname(filePath);

  while (true) {
    const packagePath = path.join(current, 'package.json');
    if (isHadaraPackageJson(packagePath)) return normalizePath(current);

    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function isHadaraPackageJson(packagePath: string): boolean {
  try {
    const parsed = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as { name?: unknown };
    return parsed.name === packageJson.name;
  } catch {
    return false;
  }
}

function formatCheckLabel(id: string): string {
  if (id === 'docs') return 'docs/:       ';
  if (id === 'tasks') return 'tasks/:      ';
  if (id === 'project-context') return '.hadara/context/HADARA_CONTEXT.md: ';
  return `${id}: `;
}
