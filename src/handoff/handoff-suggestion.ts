import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { HadaraActorContext } from '../core/actor-context';
import { findMarkdownRowByCell, parseMarkdownRowsUnderHeading } from '../services/markdown-table';
import { defaultTaskLifecycleActor } from '../task/lifecycle-next-actions';
import { listTaskCapsules } from '../task/task-capsule';

export interface HandoffSuggestionReport {
  schemaVersion: 'hadara.handoff.suggestion.v1';
  command: 'handoff.suggest';
  ok: boolean;
  taskId: string;
  readOnly: true;
  generatedAt: string;
  actor: HadaraActorContext;
  target: {
    path: 'docs/AGENT_HANDOFF.md';
    beforeHash: string;
    writeBoundary: 'shared-doc';
    recommendedActorRole: 'coordinator';
  };
  task: {
    taskId: string;
    title?: string;
    status?: string;
    capsulePath?: string;
  };
  sections: HandoffSuggestionSection[];
  patchPreview?: {
    format: 'unified-diff' | 'section-fragments';
    content: string;
  };
  issues: HandoffSuggestionIssue[];
}

export interface HandoffSuggestionSection {
  id: 'current-state' | 'last-completed' | 'known-problems' | 'next-recommended-step' | 'validation-baseline';
  heading: string;
  sectionTitle?: string;
  action: 'replace-row' | 'append-row' | 'manual-review';
  summary: string;
  targetBeforeHash?: string;
  suggestedReplacementMarkdown?: string;
  suggestedMarkdown?: string;
}

export interface HandoffSuggestionIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

export interface HandoffSuggestionOptions {
  executeRequested?: boolean;
  actor?: HadaraActorContext;
}

interface TaskSnapshot {
  taskId: string;
  title?: string;
  status?: string;
  capsulePath?: string;
  evidenceSummary?: string;
}

export function createHandoffSuggestionReport(projectRoot: string, taskId: string, options: HandoffSuggestionOptions = {}): HandoffSuggestionReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const handoffPath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  const handoffExists = fs.existsSync(handoffPath);
  const handoffContent = handoffExists ? fs.readFileSync(handoffPath, 'utf8') : '';
  const issues: HandoffSuggestionIssue[] = [];
  if (!handoffExists) {
    issues.push({ severity: 'error', code: 'AGENT_HANDOFF_MISSING', message: 'docs/AGENT_HANDOFF.md is missing.', path: 'docs/AGENT_HANDOFF.md' });
  }
  if (options.executeRequested) {
    issues.push({ severity: 'error', code: 'HANDOFF_SUGGEST_EXECUTE_UNSUPPORTED', message: 'handoff suggest is read-only and has no execute mode.' });
  }

  const task = readTaskSnapshot(projectRoot, taskId, issues);
  const targetBeforeHash = hashContent(handoffContent);
  const sections = createSections(task, targetBeforeHash, options.executeRequested);
  return {
    schemaVersion: 'hadara.handoff.suggestion.v1',
    command: 'handoff.suggest',
    ok: !issues.some((issue) => issue.severity === 'error'),
    taskId,
    readOnly: true,
    generatedAt: new Date().toISOString(),
    actor,
    target: {
      path: 'docs/AGENT_HANDOFF.md',
        beforeHash: targetBeforeHash,
      writeBoundary: 'shared-doc',
      recommendedActorRole: 'coordinator'
    },
    task,
    sections,
    patchPreview: {
      format: 'section-fragments',
      content: sections.map(formatSectionFragment).join('\n\n')
    },
    issues
  };
}

export function formatHandoffSuggestionReport(report: HandoffSuggestionReport): string {
  const lines = [`[HADARA] handoff suggest ${report.task.taskId}: ${report.ok ? 'ok' : 'issues'}`];
  lines.push(`target=${report.target.path} beforeHash=${report.target.beforeHash}`);
  for (const section of report.sections) lines.push(`${section.action}\t${section.id}\t${section.summary}`);
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function readTaskSnapshot(projectRoot: string, taskId: string, issues: HandoffSuggestionIssue[]): TaskSnapshot {
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
    return { taskId };
  }
  return {
    taskId,
    title: task.title,
    status: readTaskStatus(task.dir),
    capsulePath: toPortablePath(path.relative(projectRoot, task.dir)),
    evidenceSummary: readLatestEvidenceSummary(task.dir)
  };
}

function createSections(task: TaskSnapshot, targetBeforeHash: string, executeRequested?: boolean): HandoffSuggestionSection[] {
  const displayName = [task.taskId, task.title].filter(Boolean).join(' ');
  const evidence = task.evidenceSummary ?? 'Review task evidence and validation records.';
  const nextTask = executeRequested ? 'Remove --execute and review this suggestion report.' : 'Run `hadara task status --json` and create or select the next capsule.';
  return [
    section({
      id: 'current-state',
      heading: 'Current State',
      action: 'replace-row',
      summary: 'Update latest completed and active/next rows.',
      targetBeforeHash,
      suggestedReplacementMarkdown: [
        `| Latest Completed Task | ${displayName} | ${task.status ?? 'unknown'}; ${evidence} |`,
        `| Active / Next Task | TBD | ${nextTask} |`
      ].join('\n')
    }),
    section({
      id: 'last-completed',
      heading: 'Last 3 Completed Tasks',
      action: 'append-row',
      summary: 'Add the completed task summary near the top of recent completed tasks.',
      targetBeforeHash,
      suggestedReplacementMarkdown: `| ${displayName} | ${task.status ?? 'unknown'}; read-only handoff suggestion prepared. | Evidence: ${evidence} |`
    }),
    section({
      id: 'known-problems',
      heading: 'Current Known Problems',
      action: 'manual-review',
      summary: 'Review whether any task-specific warning should be carried forward.',
      targetBeforeHash,
      suggestedReplacementMarkdown: `| Handoff suggestions are read-only. | Operators must still review and apply shared-doc changes manually. | Apply only after confirming target beforeHash ${targetBeforeHash}. |`
    }),
    section({
      id: 'next-recommended-step',
      heading: 'Next Recommended Step',
      action: 'replace-row',
      summary: 'Point the next step at task discovery rather than applying this report automatically.',
      targetBeforeHash,
      suggestedReplacementMarkdown: `| Select the next task with \`hadara task status --json\`. | Continue project work after ${task.taskId} using the current Task Board and handoff. | Required reading: \`docs/AGENT_HANDOFF.md\`, \`docs/TASK_BOARD.md\`, and \`docs/TASK_WORKFLOW_COMMANDS.md\`. |`
    }),
    section({
      id: 'validation-baseline',
      heading: 'Validation Baseline',
      action: 'append-row',
      summary: 'Carry forward the latest task evidence as a validation baseline candidate.',
      targetBeforeHash,
      suggestedReplacementMarkdown: `| ${displayName} validation | ${evidence} | Confirm exact command output before applying handoff updates. |`
    })
  ];
}

function section(input: Omit<HandoffSuggestionSection, 'sectionTitle' | 'suggestedMarkdown'>): HandoffSuggestionSection {
  return {
    ...input,
    sectionTitle: input.heading,
    suggestedMarkdown: input.suggestedReplacementMarkdown
  };
}

function formatSectionFragment(section: HandoffSuggestionSection): string {
  return [
    `## docs/AGENT_HANDOFF.md :: ${section.sectionTitle ?? section.heading}`,
    `Target beforeHash: ${section.targetBeforeHash ?? 'unknown'}`,
    `Action: ${section.action}`,
    `Summary: ${section.summary}`,
    '',
    'Suggested replacement Markdown:',
    section.suggestedReplacementMarkdown ?? section.suggestedMarkdown ?? ''
  ].join('\n');
}

function readTaskStatus(taskDir: string): string | undefined {
  const taskPath = path.join(taskDir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return undefined;
  const content = fs.readFileSync(taskPath, 'utf8');
  const sectionStatus = content.match(/^## Status\s*\n+([^\n]+)/m)?.[1]?.trim();
  if (sectionStatus) return sectionStatus;
  return findMarkdownRowByCell(parseMarkdownRowsUnderHeading(content, '## Identity'), 0, 'Status')?.[1]?.trim()
    ?? findMarkdownRowByCell(parseMarkdownRowsUnderHeading(content, '## Metadata'), 0, 'Status')?.[1]?.trim();
}

function readLatestEvidenceSummary(taskDir: string): string | undefined {
  const evidencePath = path.join(taskDir, 'evidence.jsonl');
  if (!fs.existsSync(evidencePath)) return undefined;
  const lines = fs.readFileSync(evidencePath, 'utf8').trim().split(/\r?\n/).filter(Boolean);
  for (const line of [...lines].reverse()) {
    try {
      const record = JSON.parse(line) as { summary?: unknown; outcome?: unknown; result?: unknown };
      if (typeof record.summary === 'string') return `${String(record.outcome ?? record.result ?? 'recorded')}: ${record.summary}`;
    } catch {
      continue;
    }
  }
  return undefined;
}

function hashContent(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
