import type { MarkdownTableRow } from '../services/markdown-table';

export interface WorkUnitFact {
  kind: 'task';
  id: string;
  title: string;
}

export interface IssueFact {
  severity: 'watch' | 'active' | 'blocked';
  code: string;
  message: string;
}

export interface ReferenceFact {
  path: string;
  required: boolean;
}

export interface ContextSourceFact {
  sourceId: string;
  path: string;
  authority: string;
  lifecycle: string;
}

export interface WorkCandidateFact {
  id: string;
  title: string;
  status: string;
  capsule: string | null;
}

export type TransformerName =
  | 'task-to-work-unit'
  | 'known-problems-to-issues'
  | 'markdown-input-list-to-references'
  | 'registry-entry-to-context-source'
  | 'task-board-row-to-work-candidate';

export function taskToWorkUnit(ref: { id: string; title: string }): WorkUnitFact {
  return { kind: 'task', id: ref.id, title: ref.title };
}

export function knownProblemsToIssues(problems: Array<{ summary: string; state: 'watch' | 'active' | 'blocked'; guidance: string }>): IssueFact[] {
  return problems.map((problem) => ({ severity: problem.state, code: 'KNOWN_PROBLEM', message: `${problem.summary} ${problem.guidance}`.trim() }));
}

const REQUIRED_LABEL_PATTERN = /^(required|yes|true)$/i;

export function markdownInputListToReferences(
  rows: MarkdownTableRow[],
  options: { pathColumn?: number; requiredColumn?: number } = {}
): ReferenceFact[] {
  const pathColumn = options.pathColumn ?? 0;
  const requiredColumn = options.requiredColumn ?? 1;
  return rows
    .filter((row) => Boolean(row[pathColumn]) && row[pathColumn] !== 'TBD')
    .map((row) => ({ path: row[pathColumn], required: REQUIRED_LABEL_PATTERN.test(row[requiredColumn] ?? '') }));
}

export function registryEntryToContextSource(entry: { path: string; status: string; authority?: string }): ContextSourceFact {
  return {
    sourceId: entry.path,
    path: entry.path,
    authority: entry.authority ?? 'reference-only',
    lifecycle: entry.status
  };
}

export function taskBoardRowToWorkCandidate(row: { taskId: string; title: string; status: string; capsule?: string | null }): WorkCandidateFact {
  return { id: row.taskId, title: row.title, status: row.status, capsule: row.capsule ?? null };
}
