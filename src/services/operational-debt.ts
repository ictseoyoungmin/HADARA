import fs from 'node:fs';
import path from 'node:path';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';

export interface OperationalDebtRecord {
  id: string;
  title: string;
  source: string;
  category: 'continuity' | 'validation' | 'scope-control' | 'complexity' | 'visibility' | 'environment';
  status: 'tracked' | 'mitigated' | 'candidate';
  targetCapability: string;
}

export interface CapsuleSizeIndicator {
  taskId: string;
  capsule: string;
  fileCount: number;
  lineCount: number;
  byteCount: number;
  size: 'tiny' | 'standard' | 'large';
}

export interface OperationalDebtReport {
  schemaVersion: 'hadara.operational_debt.v1';
  command: 'operational-debt.report';
  ok: true;
  records: OperationalDebtRecord[];
  capsuleSizeIndicators: CapsuleSizeIndicator[];
  issues: Array<{
    severity: 'warning';
    code: string;
    message: string;
    path?: string;
  }>;
}

export const OPERATIONAL_DEBT_RECORDS: OperationalDebtRecord[] = [
  {
    id: 'OD-0001',
    title: 'Task Capsule Markdown consistency can drift after context compaction',
    source: 'known_issue.log#1',
    category: 'validation',
    status: 'mitigated',
    targetCapability: 'Task Capsule format validation'
  },
  {
    id: 'OD-0002',
    title: 'New sessions may miss Docker-based validation environment details',
    source: 'known_issue.log#2',
    category: 'environment',
    status: 'mitigated',
    targetCapability: 'Validation environment handoff'
  },
  {
    id: 'OD-0003',
    title: 'Agents can overfit to the last capsule and miss broader roadmap state',
    source: 'known_issue.log#3',
    category: 'continuity',
    status: 'tracked',
    targetCapability: 'Roadmap-aware handoff validation'
  },
  {
    id: 'OD-0004',
    title: 'Long-running capsule work can concentrate too many features in one file',
    source: 'known_issue.log#4',
    category: 'complexity',
    status: 'tracked',
    targetCapability: 'LOC and complexity risk indicators'
  },
  {
    id: 'OD-0005',
    title: 'LOC calculation utility is needed for complexity management',
    source: 'known_issue.log#5',
    category: 'complexity',
    status: 'candidate',
    targetCapability: 'Changed LOC utility'
  },
  {
    id: 'OD-0006',
    title: 'Capsule size should scale with task complexity',
    source: 'known_issue.log#6',
    category: 'scope-control',
    status: 'tracked',
    targetCapability: 'Capsule size indicator'
  },
  {
    id: 'OD-0007',
    title: 'Task change size should be visible in dashboard or TUI surfaces',
    source: 'known_issue.log#7',
    category: 'visibility',
    status: 'candidate',
    targetCapability: 'Changed-size dashboard signal'
  },
  {
    id: 'OD-0008',
    title: 'ACCEPTANCE.md checkboxes can be marked before implementation evidence exists',
    source: 'known_issue.log#8',
    category: 'validation',
    status: 'tracked',
    targetCapability: 'Premature acceptance guard'
  }
];

export function createOperationalDebtReport(projectRoot: string): OperationalDebtReport {
  const tasks = listTaskCapsules(projectRoot);
  return {
    schemaVersion: 'hadara.operational_debt.v1',
    command: 'operational-debt.report',
    ok: true,
    records: OPERATIONAL_DEBT_RECORDS,
    capsuleSizeIndicators: tasks.map((task) => measureCapsuleSize(projectRoot, task)),
    issues: tasks.flatMap((task) => detectPrematureAcceptance(projectRoot, task))
  };
}

function measureCapsuleSize(projectRoot: string, task: TaskCapsule): CapsuleSizeIndicator {
  const files = fs
    .readdirSync(task.dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(task.dir, entry.name));
  const totals = files.reduce(
    (acc, filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        bytes: acc.bytes + Buffer.byteLength(content, 'utf8'),
        lines: acc.lines + countLines(content)
      };
    },
    { bytes: 0, lines: 0 }
  );
  return {
    taskId: task.id,
    capsule: toPortablePath(path.relative(projectRoot, task.dir)),
    fileCount: files.length,
    lineCount: totals.lines,
    byteCount: totals.bytes,
    size: classifyCapsuleSize(totals.lines)
  };
}

function detectPrematureAcceptance(
  projectRoot: string,
  task: TaskCapsule
): OperationalDebtReport['issues'] {
  const taskPath = path.join(task.dir, 'TASK.md');
  const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
  const evidencePath = path.join(task.dir, 'evidence.jsonl');
  if (!fs.existsSync(taskPath) || !fs.existsSync(acceptancePath)) return [];
  const taskStatus = readTaskStatus(taskPath);
  const acceptance = fs.readFileSync(acceptancePath, 'utf8');
  const checkedCount = acceptance.match(/-\s+\[[xX]\]/g)?.length ?? 0;
  const evidenceCount = countValidEvidenceRecords(evidencePath);
  if (checkedCount > 0 && (taskStatus !== 'Done' || evidenceCount === 0)) {
    return [
      {
        severity: 'warning',
        code: 'PREMATURE_ACCEPTANCE_CHECKED',
        message: `${task.id} has checked acceptance boxes before Done status or evidence records.`,
        path: toPortablePath(path.relative(projectRoot, acceptancePath))
      }
    ];
  }
  return [];
}

function classifyCapsuleSize(lineCount: number): CapsuleSizeIndicator['size'] {
  if (lineCount < 80) return 'tiny';
  if (lineCount > 700) return 'large';
  return 'standard';
}

function readTaskStatus(taskPath: string): string {
  const content = fs.readFileSync(taskPath, 'utf8');
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
}

function countValidEvidenceRecords(evidencePath: string): number {
  if (!fs.existsSync(evidencePath)) return 0;
  return fs
    .readFileSync(evidencePath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => {
      try {
        const record = JSON.parse(line);
        return (
          record &&
          typeof record === 'object' &&
          record.schemaVersion === 'hadara.evidence.v1' &&
          typeof record.time === 'string' &&
          typeof record.taskId === 'string' &&
          typeof record.summary === 'string' &&
          typeof record.visibility === 'string'
        );
      } catch {
        return false;
      }
    }).length;
}

function countLines(content: string): number {
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
