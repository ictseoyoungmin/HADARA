import type {
  ContextGraphIssue,
  ContextGraphNode,
  ContextStateProjectionReport,
  GraphExtractionResult,
  StateConsistencyIssue,
  StateConsistencyIssueCode,
  StateSource
} from './context-graph';

export interface ContextStateProjectionInput {
  generatedAt: string;
  extractionResults: GraphExtractionResult[];
}

interface TaskNodeIndex {
  taskBoardTaskIds: Set<string>;
  taskCapsuleTaskIds: Set<string>;
  taskBoardPaths: Map<string, string>;
  taskCapsulePaths: Map<string, string>;
}

const TASK_ID_PATTERN = /\bT-\d{4}\b/;

export function createContextStateProjectionReport(input: ContextStateProjectionInput): ContextStateProjectionReport {
  const stateSources = input.extractionResults.flatMap((result) => result.stateSources ?? []);
  const nodes = input.extractionResults.flatMap((result) => result.nodes);
  const graphIssues = input.extractionResults.flatMap((result) => result.issues);
  const taskIndex = indexTaskNodes(nodes);
  const latestCompleted = chooseTaskHint(latestCompletedCandidates(stateSources));
  const active = chooseTaskHint(activeTaskCandidates(stateSources));
  const latestClosed = latestClosedTask(stateSources);
  const issues = [
    ...stateSourceConsistencyIssues(stateSources),
    ...taskPresenceIssues(taskIndex),
    ...closeProofIssues(stateSources),
    ...graphIssues.map(graphIssueToStateIssue)
  ].filter((issue): issue is StateConsistencyIssue => Boolean(issue));

  return {
    schemaVersion: 'hadara.stateProjection.v1',
    command: 'state.projection',
    ok: issues.every((issue) => issue.severity !== 'error'),
    generatedAt: input.generatedAt,
    summary: {
      ...(latestCompleted ? { latestCompletedTask: latestCompleted } : {}),
      ...(active ? { activeTask: active } : {}),
      ...(latestClosed ? { latestClosedTask: latestClosed } : {}),
      releaseState: releaseState(stateSources),
      stateConsistency: stateConsistency(issues)
    },
    sources: dedupeStateSources(stateSources),
    issues
  };
}

function stateSourceConsistencyIssues(stateSources: StateSource[]): StateConsistencyIssue[] {
  const issues: StateConsistencyIssue[] = [];
  const latestCandidates = latestCompletedCandidates(stateSources);
  const activeCandidates = activeTaskCandidates(stateSources);
  if (uniqueTaskIds(latestCandidates).length > 1) {
    issues.push(issue(
      'warning',
      'STATE_LATEST_TASK_MISMATCH',
      `Latest completed task differs across state sources: ${formatCandidates(latestCandidates)}.`,
      latestCandidates.map((candidate) => candidate.path),
      'Update PROJECT_STATE, AGENT_HANDOFF, and Task Board latest Done state so they point at the same task.'
    ));
  }
  if (uniqueTaskIds(activeCandidates).length > 1) {
    issues.push(issue(
      'warning',
      'STATE_ACTIVE_TASK_MISMATCH',
      `Active task differs across state sources: ${formatCandidates(activeCandidates)}.`,
      activeCandidates.map((candidate) => candidate.path),
      'Update active task state in PROJECT_STATE, AGENT_HANDOFF, and Task Board, or clear it when no concrete task is active.'
    ));
  }
  return issues;
}

function taskPresenceIssues(taskIndex: TaskNodeIndex): StateConsistencyIssue[] {
  const issues: StateConsistencyIssue[] = [];
  for (const taskId of taskIndex.taskBoardTaskIds) {
    if (taskIndex.taskCapsuleTaskIds.has(taskId)) continue;
    issues.push(issue(
      'warning',
      'STATE_TASK_CAPSULE_MISSING',
      `Task Board references ${taskId}, but no matching Task Capsule node was extracted.`,
      [taskIndex.taskBoardPaths.get(taskId) ?? 'docs/TASK_BOARD.md'],
      `Create the missing ${taskId} capsule or update the Task Board row.`
    ));
  }
  for (const taskId of taskIndex.taskCapsuleTaskIds) {
    if (taskIndex.taskBoardTaskIds.has(taskId)) continue;
    issues.push(issue(
      'warning',
      'STATE_TASK_BOARD_MISSING_ROW',
      `Task Capsule ${taskId} exists, but no matching Task Board row was extracted.`,
      [taskIndex.taskCapsulePaths.get(taskId) ?? `tasks/${taskId}/TASK.md`, 'docs/TASK_BOARD.md'],
      `Add or repair the Task Board row for ${taskId}.`
    ));
  }
  return issues;
}

function closeProofIssues(stateSources: StateSource[]): StateConsistencyIssue[] {
  const latest = chooseTaskHint(latestCompletedCandidates(stateSources));
  const closed = latestClosedTask(stateSources);
  if (!latest || closed === latest) return [];
  return [issue(
    'warning',
    'STATE_CLOSE_PROOF_STALE',
    closed
      ? `Latest close proof is ${closed}, but latest completed task is ${latest}.`
      : `No close proof state source was extracted for latest completed task ${latest}.`,
    evidenceSourcePaths(stateSources, latest),
    `Run task close for ${latest}, or include current evidence extraction before relying on close-proof state.`
  )];
}

function graphIssueToStateIssue(graphIssue: ContextGraphIssue): StateConsistencyIssue | null {
  if (graphIssue.severity === 'info') return null;
  return issue(
    graphIssue.severity,
    'STATE_UNKNOWN',
    graphIssue.message,
    graphIssue.path ? [graphIssue.path] : [],
    graphIssue.fixHint ?? 'Resolve the underlying context graph extraction issue.'
  );
}

interface TaskCandidate {
  source: string;
  path: string;
  taskId: string | null;
}

function latestCompletedCandidates(stateSources: StateSource[]): TaskCandidate[] {
  return [
    candidateFromSource(stateSources, 'task-board', 'latestDoneTask'),
    candidateFromSource(stateSources, 'project-state', 'latestCompletedTask'),
    candidateFromSource(stateSources, 'agent-handoff', 'latestCompletedTask')
  ].filter((candidate): candidate is TaskCandidate => Boolean(candidate?.taskId));
}

function activeTaskCandidates(stateSources: StateSource[]): TaskCandidate[] {
  const taskBoard = stateSources.find((source) => source.kind === 'task-board');
  const activeTasks = Array.isArray(taskBoard?.extracted.activeTasks)
    ? (taskBoard?.extracted.activeTasks as unknown[]).map((value) => normalizeTaskId(String(value))).filter((value): value is string => Boolean(value))
    : [];
  return [
    activeTasks.length === 1 && taskBoard ? { source: taskBoard.kind, path: taskBoard.path, taskId: activeTasks[0] } : null,
    candidateFromSource(stateSources, 'project-state', 'activeTask'),
    candidateFromSource(stateSources, 'agent-handoff', 'activeTask')
  ].filter((candidate): candidate is TaskCandidate => Boolean(candidate?.taskId));
}

function candidateFromSource(stateSources: StateSource[], kind: StateSource['kind'], field: string): TaskCandidate | null {
  const source = stateSources.find((item) => item.kind === kind);
  if (!source) return null;
  const taskId = normalizeTaskId(source.extracted[field]);
  return taskId ? { source: kind, path: source.path, taskId } : null;
}

function chooseTaskHint(candidates: TaskCandidate[]): string | null {
  return candidates[0]?.taskId ?? null;
}

function uniqueTaskIds(candidates: TaskCandidate[]): string[] {
  return Array.from(new Set(candidates.map((candidate) => candidate.taskId).filter((value): value is string => Boolean(value)))).sort();
}

function formatCandidates(candidates: TaskCandidate[]): string {
  return candidates.map((candidate) => `${candidate.source}=${candidate.taskId}`).join(', ');
}

function normalizeTaskId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (/^(none|n\/a|tbd)\b/i.test(value.trim())) return null;
  return value.match(TASK_ID_PATTERN)?.[0] ?? null;
}

function latestClosedTask(stateSources: StateSource[]): string | null {
  return stateSources
    .filter((source) => source.kind === 'evidence' && Number(source.extracted.closeProofs ?? 0) > 0)
    .map((source) => normalizeTaskId(source.extracted.taskId))
    .filter((taskId): taskId is string => Boolean(taskId))
    .sort()
    .at(-1) ?? null;
}

function releaseState(stateSources: StateSource[]): string {
  const source = stateSources.find((item) => item.kind === 'release-readiness');
  if (!source) return 'unknown';
  const checks = Number(source.extracted.checks ?? 0);
  if (checks <= 0) return 'unknown';
  const statusCounts = source.extracted.statusCounts;
  if (isRecord(statusCounts) && Number(statusCounts.current ?? 0) > 0) return 'current';
  if (isRecord(statusCounts) && Number(statusCounts.blocked ?? 0) > 0) return 'blocked';
  return 'documented';
}

function indexTaskNodes(nodes: ContextGraphNode[]): TaskNodeIndex {
  const taskBoardTaskIds = new Set<string>();
  const taskCapsuleTaskIds = new Set<string>();
  const taskBoardPaths = new Map<string, string>();
  const taskCapsulePaths = new Map<string, string>();
  for (const node of nodes) {
    if (node.type !== 'Task') continue;
    const taskId = normalizeTaskId(node.id);
    if (!taskId) continue;
    if (isTaskBoardNode(node)) {
      taskBoardTaskIds.add(taskId);
      taskBoardPaths.set(taskId, node.source.path);
    }
    if (isTaskCapsuleNode(node)) {
      taskCapsuleTaskIds.add(taskId);
      taskCapsulePaths.set(taskId, node.path ?? node.source.path);
    }
  }
  return { taskBoardTaskIds, taskCapsuleTaskIds, taskBoardPaths, taskCapsulePaths };
}

function isTaskBoardNode(node: ContextGraphNode): boolean {
  if (node.kind === 'task-board-row') return true;
  return node.source.extractor === 'extractTaskBoard' || node.source.path === 'docs/TASK_BOARD.md';
}

function isTaskCapsuleNode(node: ContextGraphNode): boolean {
  if (node.kind === 'task-capsule') return true;
  if (node.source.extractor === 'extractTaskCapsules') return true;
  const nodePath = node.path ?? node.source.path;
  return /^tasks\/T-\d{4}-.+\/TASK\.md$/.test(nodePath);
}

function evidenceSourcePaths(stateSources: StateSource[], latestTaskId: string): string[] {
  const paths = stateSources.filter((source) => source.kind === 'evidence').map((source) => source.path);
  return paths.length > 0 ? paths : [`tasks/${latestTaskId}/evidence.jsonl`];
}

function stateConsistency(issues: StateConsistencyIssue[]): 'consistent' | 'warning' | 'error' | 'unknown' {
  if (issues.some((item) => item.severity === 'error')) return 'error';
  if (issues.some((item) => item.severity === 'warning')) return 'warning';
  return 'consistent';
}

function dedupeStateSources(stateSources: StateSource[]): StateSource[] {
  const seen = new Set<string>();
  const result: StateSource[] = [];
  for (const source of stateSources) {
    if (seen.has(source.id)) continue;
    seen.add(source.id);
    result.push(source);
  }
  return result;
}

function issue(
  severity: StateConsistencyIssue['severity'],
  code: StateConsistencyIssueCode,
  message: string,
  paths: string[],
  fixHint: string
): StateConsistencyIssue {
  return {
    severity,
    code,
    message,
    paths: Array.from(new Set(paths)).sort(),
    fixHint
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
