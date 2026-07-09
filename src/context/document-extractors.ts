import fs from 'node:fs';
import path from 'node:path';
import type { ContextGraphEdge, ContextGraphIssue, ContextGraphNode, ContextGraphSourceRef, GraphExtractionResult, StateSource } from './context-graph';
import {
  createContextGraphEdgeId,
  createContextGraphSourceRef,
  createDecisionNodeId,
  createDocumentNodeId,
  createEmptyExtractionResult,
  createKnownProblemNodeId,
  createManagedSectionNodeId,
  createTaskNodeId,
  hashContextGraphText,
  normalizeContextGraphPath,
  toProjectRelativeContextPath
} from './extractor-contract';
import { parseManagedSections, type ManagedPatchIssue, type ManagedSection } from '../services/managed-sections';
import { findMarkdownRowByCell, parseMarkdownRowsUnderHeading } from '../services/markdown-table';
import { listTaskCapsules, type TaskCapsule } from '../task/task-capsule';

interface DecisionRecord {
  id: string;
  decision: string;
  status: string;
  rationale?: string;
  evidence?: string;
  line?: number;
}

interface KnownProblemRecord {
  issue: string;
  impact?: string;
  nextStep?: string;
  line?: number;
}

const PROJECT_MANAGED_TARGETS = [
  'docs/TASK_BOARD.md',
  'docs/PROJECT_STATE.md',
  'docs/AGENT_HANDOFF.md',
  'docs/HADARA_WORKFLOW.md',
  'docs/DOC_REGISTRY.md'
];

export function extractManagedSections(projectRoot: string): GraphExtractionResult {
  const targets = listManagedSectionTargets(projectRoot);
  const sources = targets.map((target) => readSource(projectRoot, target));
  const result = createEmptyExtractionResult('extractManagedSections', sources);

  for (const target of targets) {
    const content = readOptionalText(path.join(projectRoot, target));
    if (content == null) continue;
    const sourceHash = hashContextGraphText(content);
    const parsed = parseManagedSections(content, target);
    result.issues.push(...parsed.issues.map((issue) => managedSectionIssue(issue)));
    for (const section of parsed.sections) {
      const source = createContextGraphSourceRef({
        path: target,
        extractor: 'extractManagedSections',
        line: section.startLine,
        hash: sourceHash
      });
      result.nodes.push(managedSectionNode(section, source));
      result.edges.push(edge('BELONGS_TO_DOCUMENT', createManagedSectionNodeId(section.path, section.id), createDocumentNodeId(section.path), source, `${section.id} belongs to ${section.path}.`));
    }
  }

  return result;
}

export function extractProjectState(projectRoot: string): GraphExtractionResult {
  const relativePath = 'docs/PROJECT_STATE.md';
  const content = readOptionalText(path.join(projectRoot, relativePath));
  const result = createEmptyExtractionResult('extractProjectState', [{ path: relativePath, content }]);
  if (content == null) {
    result.issues.push({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_SOURCE_MISSING',
      path: relativePath,
      message: 'docs/PROJECT_STATE.md is missing; project-state hints cannot be extracted.',
      fixHint: 'Restore docs/PROJECT_STATE.md before relying on state projection context routing.'
    });
    return result;
  }

  const sourceHash = hashContextGraphText(content);
  result.stateSources?.push(projectStateSource(relativePath, sourceHash, extractProjectStateHints(content)));
  return result;
}

export function extractDecisions(projectRoot: string): GraphExtractionResult {
  const targets = listDecisionTargets(projectRoot);
  const sources = targets.map((target) => readSource(projectRoot, target.path));
  const result = createEmptyExtractionResult('extractDecisions', sources);

  for (const target of targets) {
    const content = readOptionalText(path.join(projectRoot, target.path));
    if (content == null) continue;
    const sourceHash = hashContextGraphText(content);
    for (const decision of parseDecisionRecords(content)) {
      const source = createContextGraphSourceRef({
        path: target.path,
        extractor: 'extractDecisions',
        line: decision.line,
        hash: sourceHash
      });
      const decisionNodeId = createDecisionNodeId(target.path, decision.id);
      result.nodes.push(decisionNode(target.path, decision, source));
      result.edges.push(edge('BELONGS_TO_DOCUMENT', decisionNodeId, createDocumentNodeId(target.path), source, `${decision.id} belongs to ${target.path}.`));
      result.edges.push(edge('HAS_DECISION', decisionOwnerNodeId(target), decisionNodeId, source, `${decisionOwnerNodeId(target)} has decision ${decision.id}.`));
    }
  }

  return result;
}

export function extractAgentHandoff(projectRoot: string): GraphExtractionResult {
  const relativePath = 'docs/AGENT_HANDOFF.md';
  const content = readOptionalText(path.join(projectRoot, relativePath));
  const result = createEmptyExtractionResult('extractAgentHandoff', [{ path: relativePath, content }]);
  if (content == null) {
    if (!expectsAgentHandoff(projectRoot)) return result;
    result.issues.push({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_SOURCE_MISSING',
      path: relativePath,
      message: 'docs/AGENT_HANDOFF.md is missing; KnownProblem nodes cannot be extracted from current handoff state.',
      fixHint: 'Restore docs/AGENT_HANDOFF.md before relying on known-problem context routing.'
    });
    return result;
  }

  const sourceHash = hashContextGraphText(content);
  const knownProblems = parseKnownProblems(content);
  result.stateSources?.push(agentHandoffStateSource(relativePath, sourceHash, extractAgentHandoffHints(content), knownProblems.length));
  for (const problem of knownProblems) {
    const source = createContextGraphSourceRef({
      path: relativePath,
      extractor: 'extractAgentHandoff',
      line: problem.line,
      hash: sourceHash
    });
    const problemNodeId = createKnownProblemNodeId(relativePath, problem.issue);
    result.nodes.push(knownProblemNode(relativePath, problem, source));
    result.edges.push(edge('HAS_KNOWN_PROBLEM', createDocumentNodeId(relativePath), problemNodeId, source, `docs/AGENT_HANDOFF.md records known problem: ${problem.issue}`));
  }

  return result;
}

function expectsAgentHandoff(projectRoot: string): boolean {
  const scaffoldPath = path.join(projectRoot, '.hadara', 'scaffold.json');
  const content = readOptionalText(scaffoldPath);
  if (content == null) return true;
  try {
    const parsed = JSON.parse(content) as { profile?: unknown };
    if (parsed.profile === 'basic' || parsed.profile === 'standard') return false;
    if (parsed.profile === 'governed') return true;
  } catch {
    return true;
  }
  return true;
}

function projectStateSource(relativePath: string, sourceHash: string, hints: SharedStateHints): StateSource {
  return {
    id: 'state-source:project-state',
    path: normalizeContextGraphPath(relativePath),
    kind: 'project-state',
    hash: sourceHash,
    extracted: hints
  };
}

function agentHandoffStateSource(relativePath: string, sourceHash: string, hints: SharedStateHints, knownProblems: number): StateSource {
  return {
    id: 'state-source:agent-handoff',
    path: normalizeContextGraphPath(relativePath),
    kind: 'agent-handoff',
    hash: sourceHash,
    extracted: {
      ...hints,
      knownProblems
    }
  };
}

type SharedStateHints = Record<string, unknown> & {
  latestCompletedTask: string | null;
  activeTask: string | null;
  latestCompletedRaw: string | null;
  activeRaw: string | null;
};

function extractProjectStateHints(content: string): SharedStateHints {
  const rows = parseMarkdownRowsUnderHeading(content, '## Metadata');
  const latestRaw = findMarkdownRowByCell(rows, 0, 'Latest Completed Task')?.[1] ?? findLineValue(content, /latest completed task is\s+([^\n.]+)/i);
  const activeRaw = findMarkdownRowByCell(rows, 0, 'Active Task')?.[1] ?? null;
  return {
    latestCompletedTask: normalizeTaskHint(latestRaw),
    activeTask: normalizeActiveTaskHint(activeRaw),
    latestCompletedRaw: latestRaw ?? null,
    activeRaw: activeRaw ?? null
  };
}

function extractAgentHandoffHints(content: string): SharedStateHints {
  const rows = parseMarkdownRowsUnderHeading(content, '## Current State');
  const latestRaw = findMarkdownRowByCell(rows, 0, 'Latest Completed Task')?.[1] ?? null;
  const activeRaw = findMarkdownRowByCell(rows, 0, 'Active / Next Task')?.[1] ?? findMarkdownRowByCell(rows, 0, 'Active Task')?.[1] ?? null;
  return {
    latestCompletedTask: normalizeTaskHint(latestRaw),
    activeTask: normalizeActiveTaskHint(activeRaw),
    latestCompletedRaw: latestRaw,
    activeRaw: activeRaw
  };
}

function normalizeTaskHint(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^(none|n\/a|tbd)\b/i.test(value.trim())) return null;
  return value.match(/\bT-\d{4}\b/)?.[0] ?? null;
}

function normalizeActiveTaskHint(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^(none|n\/a|tbd|no active|none selected)\b/i.test(trimmed)) return null;
  return trimmed.match(/^`?(T-\d{4})\b/)?.[1] ?? null;
}

function findLineValue(content: string, pattern: RegExp): string | null {
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function managedSectionNode(section: ManagedSection, source: ContextGraphSourceRef): ContextGraphNode {
  return {
    id: createManagedSectionNodeId(section.path, section.id),
    type: 'ManagedSection',
    label: section.id,
    path: normalizeContextGraphPath(section.path),
    kind: section.metadata.kind,
    owner: section.metadata.owner,
    metadata: {
      mode: section.metadata.mode,
      version: section.metadata.version,
      required: section.metadata.required ?? false,
      closeSourceRole: section.metadata.closeSourceRole ?? null,
      startLine: section.startLine,
      endLine: section.endLine,
      sectionBeforeHash: section.sectionBeforeHash
    },
    source
  };
}

function decisionNode(documentPath: string, decision: DecisionRecord, source: ContextGraphSourceRef): ContextGraphNode {
  return {
    id: createDecisionNodeId(documentPath, decision.id),
    type: 'Decision',
    label: `${decision.id} ${decision.decision}`.trim(),
    path: normalizeContextGraphPath(documentPath),
    status: decision.status,
    kind: 'decision-record',
    metadata: {
      decision: decision.decision,
      rationale: decision.rationale ?? null,
      evidence: decision.evidence ?? null
    },
    source
  };
}

function knownProblemNode(documentPath: string, problem: KnownProblemRecord, source: ContextGraphSourceRef): ContextGraphNode {
  return {
    id: createKnownProblemNodeId(documentPath, problem.issue),
    type: 'KnownProblem',
    label: problem.issue,
    path: normalizeContextGraphPath(documentPath),
    kind: 'current-known-problem',
    metadata: {
      impact: problem.impact ?? null,
      nextStep: problem.nextStep ?? null
    },
    source
  };
}

function parseDecisionRecords(content: string): DecisionRecord[] {
  const rows = parseDecisionTableRows(content);
  if (rows.length > 0) return rows;
  return parseDecisionHeadingRecords(content);
}

function parseDecisionTableRows(content: string): DecisionRecord[] {
  const decisions: DecisionRecord[] = [];
  content.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|') || /^\|\s*:?-+/.test(trimmed)) return;
    const cells = trimmed.slice(1, -1).split('|').map((cell) => cell.trim());
    if (!/^D-\d+/i.test(cells[0] ?? '')) return;
    const hasDateColumn = /^\d{4}-\d{2}-\d{2}$/.test(cells[1] ?? '') || cells.length >= 6;
    decisions.push({
      id: cells[0],
      decision: cells[hasDateColumn ? 2 : 1] ?? '',
      status: cells[hasDateColumn ? 3 : 2] ?? 'recorded',
      rationale: cells[hasDateColumn ? 4 : 3],
      evidence: cells[hasDateColumn ? 5 : 4],
      line: index + 1
    });
  });
  return decisions;
}

function parseDecisionHeadingRecords(content: string): DecisionRecord[] {
  const lines = content.split(/\r?\n/);
  const records: DecisionRecord[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^##\s+(D-\d+):?\s*(.*)$/i);
    if (!match) continue;
    const body: string[] = [];
    for (let next = index + 1; next < lines.length && !/^##\s+/.test(lines[next]); next += 1) {
      if (lines[next].trim()) body.push(lines[next].trim());
    }
    records.push({
      id: match[1],
      decision: match[2]?.trim() || match[1],
      status: 'recorded',
      rationale: body.join('\n') || undefined,
      line: index + 1
    });
  }
  return records;
}

function parseKnownProblems(content: string): KnownProblemRecord[] {
  const rows = parseMarkdownRowsUnderHeading(content, '## Current Known Problems');
  const header = rows.find((row) => row.some((cell) => normalizeHeader(cell) === 'issue'));
  const issueIndex = header ? header.findIndex((cell) => normalizeHeader(cell) === 'issue') : 0;
  const impactIndex = header ? header.findIndex((cell) => normalizeHeader(cell) === 'impact') : 1;
  const nextStepIndex = header ? header.findIndex((cell) => normalizeHeader(cell) === 'nextstep') : 2;
  const stateIndex = header ? header.findIndex((cell) => normalizeHeader(cell) === 'state') : -1;
  return rows
    .filter((row) => row[issueIndex] && normalizeHeader(row[issueIndex]) !== 'issue')
    .filter((row) => stateIndex < 0 || isCurrentKnownProblemState(row[stateIndex]))
    .map((row) => ({
      issue: row[issueIndex],
      impact: impactIndex >= 0 ? row[impactIndex] : undefined,
      nextStep: nextStepIndex >= 0 ? row[nextStepIndex] : undefined,
      line: findLineContaining(content, row[issueIndex])
    }));
}

function normalizeHeader(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isCurrentKnownProblemState(value: string | undefined): boolean {
  return /^(active|current|open|watch)$/i.test((value ?? '').trim());
}

function listManagedSectionTargets(projectRoot: string): string[] {
  const taskTargets = listTaskCapsules(projectRoot).flatMap((task) => [
    toProjectRelativeContextPath(projectRoot, path.join(task.dir, 'TASK.md')),
    toProjectRelativeContextPath(projectRoot, path.join(task.dir, 'HANDOFF.md'))
  ]);
  return uniqueSorted(PROJECT_MANAGED_TARGETS.concat(taskTargets)).filter((target) => fs.existsSync(path.join(projectRoot, target)));
}

function listDecisionTargets(projectRoot: string): Array<{ path: string; task?: TaskCapsule }> {
  const targets: Array<{ path: string; task?: TaskCapsule }> = [];
  if (fs.existsSync(path.join(projectRoot, 'docs/DECISIONS.md'))) targets.push({ path: 'docs/DECISIONS.md' });
  for (const task of listTaskCapsules(projectRoot)) {
    const decisionPath = toProjectRelativeContextPath(projectRoot, path.join(task.dir, 'DECISIONS.md'));
    if (fs.existsSync(path.join(projectRoot, decisionPath))) targets.push({ path: decisionPath, task });
  }
  return targets;
}

function decisionOwnerNodeId(target: { path: string; task?: TaskCapsule }): string {
  return target.task ? createTaskNodeId(target.task.id) : createDocumentNodeId(target.path);
}

function edge(
  type: ContextGraphEdge['type'],
  from: string,
  to: string,
  source: ContextGraphSourceRef,
  reason: string
): ContextGraphEdge {
  return {
    id: createContextGraphEdgeId({ type, from, to, source, reason }),
    from,
    to,
    type,
    confidence: 'explicit',
    reason,
    source
  };
}

function readSource(projectRoot: string, relativePath: string): { path: string; content: string | null } {
  return {
    path: relativePath,
    content: readOptionalText(path.join(projectRoot, relativePath))
  };
}

function readOptionalText(absolutePath: string): string | null {
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : null;
}

function managedSectionIssue(issue: ManagedPatchIssue): ContextGraphIssue {
  return {
    severity: issue.severity === 'error' ? 'warning' : issue.severity,
    code: 'CONTEXT_GRAPH_PARSE_FAILED',
    path: issue.path,
    message: issue.message,
    fixHint: issue.sectionId ? `Repair managed section ${issue.sectionId} in ${issue.path}.` : `Repair managed section markers in ${issue.path}.`
  };
}

function findLineContaining(content: string, needle: string): number | undefined {
  const index = content.split(/\r?\n/).findIndex((line) => line.includes(needle));
  return index >= 0 ? index + 1 : undefined;
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.map(normalizeContextGraphPath))).sort();
}
