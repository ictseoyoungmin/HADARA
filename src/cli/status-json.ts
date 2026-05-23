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
    counts: {
      done: number;
      draft: number;
      partial: number;
      superseded: number;
      inProgress: number;
      unknown: number;
    };
    rawStatusCounts: Record<string, number>;
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
  const sources = {
    projectState: readProjectFile(projectRoot, 'docs/PROJECT_STATE.md'),
    handoff: readProjectFile(projectRoot, 'docs/AGENT_HANDOFF.md'),
    taskBoard: readProjectFile(projectRoot, 'docs/TASK_BOARD.md'),
    developmentSlices: readProjectFile(projectRoot, 'docs/DEVELOPMENT_SLICES.md'),
    validationHistory: readProjectFile(projectRoot, 'docs/VALIDATION_HISTORY.md')
  };
  const tasks = listTaskCapsules(projectRoot);
  const taskCounts = countTaskStatuses(tasks);
  const handoffSections = {
    currentState: extractListSection(sources.handoff.content, '## Current State'),
    knownProblems: extractListSection(sources.handoff.content, '## Current Known Problems'),
    nextRecommendedStep: extractListSection(sources.handoff.content, '## Next Recommended Step')
  };
  const validation = {
    latestFullCheck:
      extractValidationLine(sources.handoff.content, 'Latest full check') ?? extractValidationHistoryLine(sources.validationHistory.content, 'Docker check'),
    latestDoneLevelValidation:
      extractValidationLine(sources.handoff.content, 'Latest done-level validation') ??
      extractValidationHistoryLine(sources.validationHistory.content, 'harness validate')
  };
  const issues = collectIssues(sources, validation);

  return {
    schemaVersion: 'hadara.ops.status.v1',
    command: 'ops.status',
    ok: true,
    project: {
      branch: readGitBranch(projectRoot),
      phase: extractProjectPhase(sources.projectState.content)
    },
    tasks: {
      counts: taskCounts.counts,
      rawStatusCounts: taskCounts.rawStatusCounts,
      lastCompleted: extractLastCompletedTaskIds(sources.handoff.content),
      nextRecommended: handoffSections.nextRecommendedStep[0] ?? null
    },
    handoff: handoffSections,
    validation,
    mcp: {
      defaultMode: 'read-only',
      evidenceAttach: {
        enabledByDefault: false,
        requiresFlag: '--enable-evidence-attach',
        requiresApproval: true,
        audited: true
      }
    },
    issues
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

interface ProjectFileRead {
  path: string;
  exists: boolean;
  content: string;
}

function readProjectFile(projectRoot: string, relativePath: string): ProjectFileRead {
  const filePath = path.join(projectRoot, relativePath);
  const exists = fs.existsSync(filePath);
  return {
    path: relativePath,
    exists,
    content: exists ? fs.readFileSync(filePath, 'utf8') : ''
  };
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
  const explicit = line.match(/^Phase:\s*(.+)$/i);
  if (explicit) return explicit[1].trim();
  if (/Phase 0\s*\/\s*Phase 1 boundary/i.test(line)) return 'bootstrap-development';
  return line;
}

function countTaskStatuses(tasks: TaskCapsule[]): {
  counts: OpsStatusReport['tasks']['counts'];
  rawStatusCounts: Record<string, number>;
} {
  const counts: OpsStatusReport['tasks']['counts'] = {
    done: 0,
    draft: 0,
    partial: 0,
    superseded: 0,
    inProgress: 0,
    unknown: 0
  };
  const rawStatusCounts: Record<string, number> = {};
  for (const task of tasks) {
    const rawStatus = normalizeRawStatus(readTaskStatus(task));
    const aggregate = aggregateStatus(rawStatus);
    counts[aggregate] += 1;
    rawStatusCounts[rawStatus] = (rawStatusCounts[rawStatus] ?? 0) + 1;
  }
  return { counts, rawStatusCounts };
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const content = fs.readFileSync(taskPath, 'utf8');
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
}

function normalizeRawStatus(status: string): string {
  const value = status.trim().toLowerCase().replace(/[\s_-]+(.)/g, (_match, letter: string) => letter.toUpperCase());
  return value || 'unknown';
}

function aggregateStatus(status: string): keyof OpsStatusReport['tasks']['counts'] {
  if (status === 'done') return 'done';
  if (status === 'draft') return 'draft';
  if (status === 'partial') return 'partial';
  if (status === 'superseded') return 'superseded';
  if (status === 'inProgress' || status === 'active' || status === 'doing') return 'inProgress';
  return 'unknown';
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

function extractValidationHistoryLine(validationHistory: string, pattern: string): string | null {
  const lines = validationHistory
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s+/, ''))
    .filter((line) => line.includes(pattern));
  return lines.at(-1)?.replace(/\.$/, '') ?? null;
}

function collectIssues(
  sources: {
    projectState: ProjectFileRead;
    handoff: ProjectFileRead;
    taskBoard: ProjectFileRead;
    developmentSlices: ProjectFileRead;
    validationHistory: ProjectFileRead;
  },
  validation: OpsStatusReport['validation']
): OpsStatusReport['issues'] {
  const issues: OpsStatusReport['issues'] = [];
  if (!sources.projectState.exists) issues.push(warning('PROJECT_STATE_MISSING', 'docs/PROJECT_STATE.md is missing.'));
  if (!sources.handoff.exists) issues.push(warning('AGENT_HANDOFF_MISSING', 'docs/AGENT_HANDOFF.md is missing.'));
  if (!sources.taskBoard.exists) issues.push(warning('TASK_BOARD_MISSING', 'docs/TASK_BOARD.md is missing.'));
  if (!sources.developmentSlices.exists) issues.push(warning('DEVELOPMENT_SLICES_MISSING', 'docs/DEVELOPMENT_SLICES.md is missing.'));
  if (!validation.latestFullCheck && !validation.latestDoneLevelValidation) {
    issues.push(warning('VALIDATION_BASELINE_MISSING', 'No latest validation baseline was found in handoff or validation history.'));
  }
  return issues;
}

function warning(code: string, message: string): OpsStatusReport['issues'][number] {
  return {
    severity: 'warning',
    code,
    message
  };
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
