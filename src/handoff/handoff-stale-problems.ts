import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { findMarkdownRowByCell, parseMarkdownRowsUnderHeading } from '../services/markdown-table';
import { listTaskCapsules } from '../task/task-capsule';

export interface HandoffStaleProblemsReport {
  schemaVersion: 'hadara.handoff.staleProblems.v1';
  command: 'handoff.stale-problems';
  ok: boolean;
  readOnly: true;
  generatedAt: string;
  target: {
    path: 'docs/AGENT_HANDOFF.md';
    beforeHash: string;
    writeBoundary: 'read-only';
  };
  summary: {
    knownProblemRows: number;
    candidates: number;
  };
  candidates: HandoffStaleProblemCandidate[];
  issues: HandoffStaleProblemIssue[];
}

export interface HandoffStaleProblemCandidate {
  id: string;
  rowIndex: number;
  cells: string[];
  rowText: string;
  confidence: 'medium' | 'high';
  reason: string;
  matchedSources: Array<{
    path: string;
    summary: string;
  }>;
  suggestedAction: string;
}

export interface HandoffStaleProblemIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

interface CompletedTaskSnapshot {
  taskId: string;
  title: string;
  status: string;
  capsulePath: string;
}

const RELEASE_SOURCE_PATHS = ['docs/RELEASE_READINESS.md', 'docs/RELEASE_NOTES.md', 'docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md'];
const TASK_STALE_REVIEW_LANGUAGE = /\b(not yet|needs closeout|needs publish|needs recycle|blocked|todo|awaiting|unresolved)\b|still needs (closeout|publish|recycle)/i;
const RELEASE_STALE_REVIEW_LANGUAGE = /\b(pending|not yet|needs publish|needs recycle|blocked|todo|awaiting|unresolved)\b|publish\/recycle still pending|still needs (publish|recycle)/i;

export function createHandoffStaleProblemsReport(projectRoot: string): HandoffStaleProblemsReport {
  const handoffPath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  const handoffExists = fs.existsSync(handoffPath);
  const handoffContent = handoffExists ? fs.readFileSync(handoffPath, 'utf8') : '';
  const issues: HandoffStaleProblemIssue[] = [];
  if (!handoffExists) {
    issues.push({ severity: 'error', code: 'AGENT_HANDOFF_MISSING', message: 'docs/AGENT_HANDOFF.md is missing.', path: 'docs/AGENT_HANDOFF.md' });
  }

  const rows = handoffExists ? knownProblemRows(handoffContent) : [];
  const completedTasks = readCompletedTasks(projectRoot);
  const releaseSources = readReleaseSources(projectRoot);
  const candidates = rows.flatMap((cells, index) => analyzeKnownProblemRow(cells, index + 1, completedTasks, releaseSources));

  return {
    schemaVersion: 'hadara.handoff.staleProblems.v1',
    command: 'handoff.stale-problems',
    ok: !issues.some((issue) => issue.severity === 'error'),
    readOnly: true,
    generatedAt: new Date().toISOString(),
    target: {
      path: 'docs/AGENT_HANDOFF.md',
      beforeHash: hashContent(handoffContent),
      writeBoundary: 'read-only'
    },
    summary: {
      knownProblemRows: rows.length,
      candidates: candidates.length
    },
    candidates,
    issues
  };
}

export function formatHandoffStaleProblemsReport(report: HandoffStaleProblemsReport): string {
  const lines = [`[HADARA] handoff stale-problems: ${report.ok ? 'ok' : 'issues'} candidates=${report.summary.candidates}`];
  lines.push(`target=${report.target.path} beforeHash=${report.target.beforeHash}`);
  for (const candidate of report.candidates) {
    lines.push(`${candidate.confidence}\trow ${candidate.rowIndex}\t${candidate.reason}`);
    lines.push(`  action: ${candidate.suggestedAction}`);
  }
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function analyzeKnownProblemRow(
  cells: string[],
  rowIndex: number,
  completedTasks: CompletedTaskSnapshot[],
  releaseSources: Array<{ path: string; content: string }>
): HandoffStaleProblemCandidate[] {
  const rowText = cells.join(' · ');
  const normalized = rowText.toLowerCase();
  const candidates: HandoffStaleProblemCandidate[] = [];

  for (const taskId of unique([...rowText.matchAll(/\bT-\d{4}\b/g)].map((match) => match[0]))) {
    const task = completedTasks.find((candidate) => candidate.taskId === taskId);
    if (!task) continue;
    if (!TASK_STALE_REVIEW_LANGUAGE.test(rowText)) continue;
    candidates.push({
      id: `known-problem-${rowIndex}-${taskId.toLowerCase()}`,
      rowIndex,
      cells,
      rowText,
      confidence: 'high',
      reason: `Known-problem row mentions ${taskId}, but that task capsule is marked ${task.status}.`,
      matchedSources: [{ path: task.capsulePath, summary: `${task.taskId} ${task.title} is ${task.status}.` }],
      suggestedAction: `Review this row and remove or rewrite it if ${taskId} resolved the problem.`
    });
  }

  for (const version of unique([...rowText.matchAll(/\b\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?\b/g)].map((match) => match[0]))) {
    const sourceMatches = releaseSources
      .filter((source) => {
        const sourceText = source.content.toLowerCase();
        return source.content.includes(version) && /(published|verified|recycled|installed-package|npm view|dist-tag|latest)/i.test(source.content) && /published|verified|recycled|installed-package|npm view|dist-tag|latest/.test(sourceText);
      })
      .map((source) => ({ path: source.path, summary: `${version} appears in release/publish/recycle state text.` }));
    if (sourceMatches.length === 0) continue;
    if (!RELEASE_STALE_REVIEW_LANGUAGE.test(normalized)) continue;
    candidates.push({
      id: `known-problem-${rowIndex}-version-${version.replace(/[^0-9a-z.-]/gi, '-')}`,
      rowIndex,
      cells,
      rowText,
      confidence: 'high',
      reason: `Known-problem row mentions ${version}, and release state docs contain publish/recycle completion signals for that version.`,
      matchedSources: sourceMatches,
      suggestedAction: `Review this row and remove or rewrite it if ${version} publish/recycle work is complete.`
    });
  }

  return dedupeCandidates(candidates);
}

function readCompletedTasks(projectRoot: string): CompletedTaskSnapshot[] {
  return listTaskCapsules(projectRoot)
    .map((task) => ({
      taskId: task.id,
      title: task.title,
      status: readTaskStatus(task.dir) ?? 'unknown',
      capsulePath: toPortablePath(path.relative(projectRoot, task.dir))
    }))
    .filter((task) => task.status === 'Done');
}

function knownProblemRows(handoffContent: string): string[][] {
  return parseMarkdownRowsUnderHeading(handoffContent, '## Current Known Problems').filter((row) => {
    const normalized = row.map((cell) => cell.toLowerCase());
    return normalized.join('|') !== 'issue|impact|next step';
  });
}

function readTaskStatus(taskDir: string): string | null {
  const taskPath = path.join(taskDir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return null;
  const content = fs.readFileSync(taskPath, 'utf8');
  const sectionStatus = content.match(/^## Status\s*\n+([^\n]+)/m)?.[1]?.trim();
  if (sectionStatus) return sectionStatus;
  return findMarkdownRowByCell(parseMarkdownRowsUnderHeading(content, '## Identity'), 0, 'Status')?.[1]?.trim()
    ?? findMarkdownRowByCell(parseMarkdownRowsUnderHeading(content, '## Metadata'), 0, 'Status')?.[1]?.trim()
    ?? null;
}

function readReleaseSources(projectRoot: string): Array<{ path: string; content: string }> {
  return RELEASE_SOURCE_PATHS.map((relativePath) => {
    const absolutePath = path.join(projectRoot, relativePath);
    return { path: relativePath, content: fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '' };
  });
}

function dedupeCandidates(candidates: HandoffStaleProblemCandidate[]): HandoffStaleProblemCandidate[] {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    const key = `${candidate.rowIndex}:${candidate.reason}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function hashContent(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
