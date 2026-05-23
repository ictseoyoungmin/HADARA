import fs from 'node:fs';
import path from 'node:path';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';

export interface OpsStatusReport {
  schemaVersion: 'hadara.ops.status.v1';
  command: 'ops.status';
  ok: boolean;
  project: {
    branch: string;
    phase: string;
  };
  tasks: {
    counts: Record<string, number>;
    lastCompleted: string[];
    nextRecommended: string | null;
  };
  handoff: {
    currentState: string[];
    knownProblems: string[];
    nextRecommendedStep: string[];
  };
  validation: {
    latestFullCheck: string | null;
    latestDoneLevelValidation: string | null;
  };
  mcp: {
    defaultMode: 'read-only';
    evidenceAttach: {
      enabledByDefault: false;
      requiresFlag: '--enable-evidence-attach';
      requiresApproval: true;
      audited: true;
    };
  };
  issues: Array<{
    severity: 'error' | 'warning';
    code: string;
    message: string;
  }>;
}

export function createOpsStatusReport(projectRoot: string): OpsStatusReport {
  const handoff = readProjectFile(projectRoot, 'docs/AGENT_HANDOFF.md');
  const projectState = readProjectFile(projectRoot, 'docs/PROJECT_STATE.md');
  const tasks = listTaskCapsules(projectRoot);
  const handoffSections = {
    currentState: extractListSection(handoff, '## Current State'),
    knownProblems: extractListSection(handoff, '## Current Known Problems'),
    nextRecommendedStep: extractListSection(handoff, '## Next Recommended Step')
  };

  return {
    schemaVersion: 'hadara.ops.status.v1',
    command: 'ops.status',
    ok: true,
    project: {
      branch: readGitBranch(projectRoot),
      phase: extractProjectPhase(projectState)
    },
    tasks: {
      counts: countTaskStatuses(tasks),
      lastCompleted: extractLastCompletedTaskIds(handoff),
      nextRecommended: handoffSections.nextRecommendedStep[0] ?? null
    },
    handoff: handoffSections,
    validation: {
      latestFullCheck: extractValidationLine(handoff, 'Latest full check'),
      latestDoneLevelValidation: extractValidationLine(handoff, 'Latest done-level validation')
    },
    mcp: {
      defaultMode: 'read-only',
      evidenceAttach: {
        enabledByDefault: false,
        requiresFlag: '--enable-evidence-attach',
        requiresApproval: true,
        audited: true
      }
    },
    issues: []
  };
}

export function formatOpsStatusReport(report: OpsStatusReport): string {
  const counts = Object.entries(report.tasks.counts)
    .map(([status, count]) => `${status}: ${count}`)
    .join(', ');
  return [
    '[HADARA] Operations Status',
    `phase: ${report.project.phase}`,
    `branch: ${report.project.branch}`,
    `tasks: ${counts}`,
    `lastCompleted: ${report.tasks.lastCompleted.join(', ') || 'none'}`,
    `nextRecommended: ${report.tasks.nextRecommended ?? 'none'}`
  ].join('\n');
}

function readProjectFile(projectRoot: string, relativePath: string): string {
  const filePath = path.join(projectRoot, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function readGitBranch(projectRoot: string): string {
  const headPath = path.join(projectRoot, '.git', 'HEAD');
  if (!fs.existsSync(headPath)) return 'unknown';
  const head = fs.readFileSync(headPath, 'utf8').trim();
  const refPrefix = 'ref: refs/heads/';
  if (head.startsWith(refPrefix)) return head.slice(refPrefix.length);
  return head.length > 0 ? 'detached' : 'unknown';
}

function extractProjectPhase(projectState: string): string {
  const section = extractSection(projectState, '## Current Phase');
  const line = section
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find(Boolean);
  if (!line) return 'unknown';
  if (/Phase 0\s*\/\s*Phase 1 boundary/i.test(line)) return 'bootstrap-development';
  return line;
}

function countTaskStatuses(tasks: TaskCapsule[]): Record<string, number> {
  const counts: Record<string, number> = {
    done: 0,
    draft: 0,
    partial: 0,
    superseded: 0
  };
  for (const task of tasks) {
    const normalized = normalizeStatus(readTaskStatus(task));
    counts[normalized] = (counts[normalized] ?? 0) + 1;
  }
  return counts;
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const content = fs.readFileSync(taskPath, 'utf8');
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
}

function normalizeStatus(status: string): string {
  const value = status.trim().toLowerCase();
  if (value === 'done' || value === 'draft' || value === 'partial' || value === 'superseded') return value;
  return value || 'unknown';
}

function extractLastCompletedTaskIds(handoff: string): string[] {
  return extractListSection(handoff, '## Last 3 Completed Tasks')
    .map((line) => line.match(/^(T-\d{4})\b/)?.[1])
    .filter((value): value is string => Boolean(value));
}

function extractValidationLine(handoff: string, label: string): string | null {
  const validation = extractListSection(handoff, '## Validation Baseline');
  const prefix = `${label}:`;
  const line = validation.find((item) => item.startsWith(prefix));
  return line ? line.slice(prefix.length).trim().replace(/\.$/, '') : null;
}

function extractListSection(content: string, heading: string): string[] {
  return extractSection(content, heading)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim())
    .filter(Boolean);
}

function extractSection(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return (nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading).trim();
}
