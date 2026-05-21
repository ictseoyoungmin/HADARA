import fs from 'node:fs';
import { HadaraPaths } from '../core/paths';

export type DoctorCheckStatus = 'ok' | 'missing';

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
  };
  paths: {
    portableRoot: string;
    dataRoot: string;
    projectRoot: string;
  };
  checks: DoctorCheck[];
}

export function createDoctorReport(paths: HadaraPaths, nodeVersion = process.version): DoctorReport {
  const checks: DoctorCheck[] = [
    pathCheck('docs', paths.projectDocsDir),
    pathCheck('tasks', paths.projectTasksDir),
    pathCheck('project-context', paths.projectHadaraDir)
  ];

  return {
    schemaVersion: 'hadara.doctor.v1',
    command: 'doctor',
    ok: checks.every((check) => check.status === 'ok'),
    runtime: {
      node: nodeVersion
    },
    paths: {
      portableRoot: paths.portableRoot,
      dataRoot: paths.dataRoot,
      projectRoot: paths.projectRoot
    },
    checks
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  return [
    '[HADARA] Doctor',
    `portableRoot: ${report.paths.portableRoot}`,
    `dataRoot:     ${report.paths.dataRoot}`,
    `projectRoot:  ${report.paths.projectRoot}`,
    `Node:         ${report.runtime.node}`,
    ...report.checks.map((check) => `${formatCheckLabel(check.id)}${check.status}`)
  ].join('\n');
}

function pathCheck(id: string, targetPath: string): DoctorCheck {
  return {
    id,
    status: fs.existsSync(targetPath) ? 'ok' : 'missing',
    path: targetPath
  };
}

function formatCheckLabel(id: string): string {
  if (id === 'docs') return 'docs/:       ';
  if (id === 'tasks') return 'tasks/:      ';
  if (id === 'project-context') return '.hadara/:    ';
  return `${id}: `;
}
