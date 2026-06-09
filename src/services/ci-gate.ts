import fs from 'node:fs';
import path from 'node:path';
import { createProofStatusReport, ProofStatusReport } from './proof-status';
import { createEvidenceLintReport } from './evidence-lint';
import { createAllProtocolConsistencyReport, createTaskProtocolConsistencyReport } from './protocol-consistency';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';

export type CiGateMode = 'advisory' | 'strict';

export interface CiGateCheck {
  id: string;
  source: 'protocol' | 'evidence' | 'proof' | 'release';
  ok: boolean;
  taskId?: string;
  summary: string;
}

export interface CiGateIssue {
  severity: 'error' | 'warning' | 'info';
  source: 'protocol' | 'evidence' | 'proof' | 'release';
  code: string;
  message: string;
  taskId?: string;
  path?: string;
}

export interface CiGateReport {
  schemaVersion: 'hadara.ci.gate.v1';
  command: 'ci.gate';
  ok: boolean;
  mode: CiGateMode;
  scope: {
    taskId?: string;
    taskCount: number;
  };
  checks: CiGateCheck[];
  blockers: CiGateIssue[];
  warnings: CiGateIssue[];
}

export interface CreateCiGateOptions {
  taskId?: string;
}

export function createCiGateReport(projectRoot: string, mode: CiGateMode, options: CreateCiGateOptions = {}): CiGateReport {
  const tasks = selectTasks(projectRoot, options.taskId);
  const checks: CiGateCheck[] = [];
  const blockers: CiGateIssue[] = [];
  const warnings: CiGateIssue[] = [];

  const protocol = options.taskId ? createTaskProtocolConsistencyReport(projectRoot, options.taskId) : createAllProtocolConsistencyReport(projectRoot);
  checks.push({
    id: options.taskId ? `protocol:${options.taskId}` : 'protocol:all',
    source: 'protocol',
    ok: protocol.ok,
    ...(options.taskId ? { taskId: options.taskId } : {}),
    summary: protocol.ok ? 'Protocol checks passed.' : 'Protocol checks reported issues.'
  });
  for (const issue of protocol.issues) {
    const target = issue.severity === 'error' ? blockers : warnings;
    target.push({ severity: issue.severity, source: 'protocol', code: issue.code, message: issue.message, path: issue.path });
  }

  for (const task of tasks) {
    const evidence = createEvidenceLintReport(projectRoot, task.id);
    checks.push({
      id: `evidence:${task.id}`,
      source: 'evidence',
      ok: evidence.ok,
      taskId: task.id,
      summary: evidence.ok ? 'Evidence lint passed.' : 'Evidence lint reported issues.'
    });
    for (const issue of evidence.issues) {
      const target = issue.severity === 'error' ? blockers : warnings;
      target.push({ severity: issue.severity, source: 'evidence', code: issue.code, message: issue.message, taskId: task.id, path: issue.path });
    }

    if (taskLooksDone(task.dir) || options.taskId) {
      const proof = createProofStatusReport(projectRoot, task.id);
      checks.push(toProofCheck(task.id, proof));
      for (const issue of proof.blockers) blockers.push({ ...issue, source: 'proof', taskId: task.id });
      for (const issue of proof.warnings) warnings.push({ ...issue, source: 'proof', taskId: task.id });
    }
  }

  checks.push({
    id: 'release:deferred',
    source: 'release',
    ok: true,
    summary: 'Release gate aggregation is deferred unless release work is explicitly requested.'
  });

  return {
    schemaVersion: 'hadara.ci.gate.v1',
    command: 'ci.gate',
    ok: mode === 'advisory' ? true : blockers.length === 0,
    mode,
    scope: { ...(options.taskId ? { taskId: options.taskId } : {}), taskCount: tasks.length },
    checks,
    blockers,
    warnings
  };
}

function selectTasks(projectRoot: string, taskId?: string): TaskCapsule[] {
  const tasks = listTaskCapsules(projectRoot);
  if (taskId) return tasks.filter((task) => task.id === taskId);
  return tasks.filter((task) => taskLooksDone(task.dir));
}

function taskLooksDone(taskDir: string): boolean {
  const taskPath = path.join(taskDir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return false;
  return /\| Status \| Done \|/.test(fs.readFileSync(taskPath, 'utf8'));
}

function toProofCheck(taskId: string, proof: ProofStatusReport): CiGateCheck {
  return {
    id: `proof:${taskId}`,
    source: 'proof',
    ok: proof.ok,
    taskId,
    summary: `Proof verdict ${proof.verdict}; freshness ${proof.freshness.status}.`
  };
}
