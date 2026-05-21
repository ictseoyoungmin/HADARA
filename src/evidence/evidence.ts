import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../core/fs';

export interface EvidenceRecord {
  time: string;
  taskId: string;
  kind: 'test-log' | 'command-log' | 'diff-summary' | 'screenshot' | 'note';
  path?: string;
  summary: string;
  result: 'passed' | 'failed' | 'blocked' | 'unknown';
}

export function appendEvidence(projectRoot: string, record: Omit<EvidenceRecord, 'time'>): string {
  const taskDir = findTaskDir(projectRoot, record.taskId);
  if (!taskDir) {
    throw new Error(`Task capsule not found: ${record.taskId}`);
  }

  const evidencePath = path.join(taskDir, 'EVIDENCE.md');
  const row = `| ${new Date().toISOString()} | ${record.kind} | ${record.summary.replace(/\|/g, '/')} | ${record.result} |\n`;

  if (!fs.existsSync(evidencePath)) {
    fs.writeFileSync(evidencePath, '# Evidence\n\n| Time | Kind | Summary | Result |\n|---|---|---|---|\n', 'utf8');
  }
  fs.appendFileSync(evidencePath, row, 'utf8');
  return evidencePath;
}

function findTaskDir(projectRoot: string, taskId: string): string | null {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return null;
  const entry = fs.readdirSync(tasksDir).find((name) => name.startsWith(`${taskId}-`));
  return entry ? path.join(tasksDir, entry) : null;
}

export function createSessionEvidenceDirs(dataRoot: string, sessionId: string): string {
  const evidenceDir = path.join(dataRoot, 'sessions', sessionId, 'evidence');
  for (const child of ['command-logs', 'test-results', 'diff-summary', 'screenshots', 'release-smoke']) {
    ensureDir(path.join(evidenceDir, child));
  }
  return evidenceDir;
}
