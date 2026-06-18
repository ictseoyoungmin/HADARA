import type {
  ContextCacheMetadata,
  ContextCandidate,
  ContextGraphEdge,
  ContextGraphIssue,
  ContextGraphMode,
  ContextGraphNode,
  ContextGraphReport,
  ContextStateProjectionReport,
  GraphExtractionResult,
  StateConsistencyIssue,
  TaskContextReport
} from './context-graph';
import {
  createTaskNodeId,
  mergeGraphExtractionResults,
  summarizeContextGraphExtraction
} from './extractor-contract';
import {
  extractAgentHandoff,
  extractDecisions,
  extractManagedSections,
  extractProjectState
} from './document-extractors';
import { extractEvidence } from './evidence-extractors';
import { extractCommandRegistry, extractDocsRegistry } from './registry-extractors';
import { extractReleaseReadiness } from './release-extractors';
import { createContextStateProjectionReport } from './state-projection';
import { extractTaskBoard, extractTaskCapsules } from './task-extractors';
import { extractCodeIndexGraph } from './code-graph-extractor';

export interface BuildContextGraphReportInput {
  projectRoot: string;
  generatedAt?: string;
  mode?: ContextGraphMode;
  taskId?: string;
  extractionResults?: GraphExtractionResult[];
  cache?: ContextCacheMetadata;
  includeCode?: boolean;
}

export interface CreateTaskContextReportInput {
  taskId: string;
  nodes: ContextGraphNode[];
  edges: ContextGraphEdge[];
  stateProjection: ContextStateProjectionReport;
  issues: ContextGraphIssue[];
}

export function collectContextGraphExtractions(projectRoot: string, options: { includeCode?: boolean; generatedAt?: string } = {}): GraphExtractionResult[] {
  const results = [
    extractTaskCapsules(projectRoot),
    extractTaskBoard(projectRoot),
    extractDocsRegistry(projectRoot),
    extractCommandRegistry(projectRoot),
    extractManagedSections(projectRoot),
    extractProjectState(projectRoot),
    extractDecisions(projectRoot),
    extractAgentHandoff(projectRoot),
    extractEvidence(projectRoot),
    extractReleaseReadiness(projectRoot)
  ];
  if (options.includeCode) results.push(extractCodeIndexGraph(projectRoot, options.generatedAt));
  return results;
}

export function buildContextGraphReport(input: BuildContextGraphReportInput): ContextGraphReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const extractionResults = input.extractionResults ?? collectContextGraphExtractions(input.projectRoot, {
    includeCode: input.includeCode,
    generatedAt
  });
  const merged = mergeGraphExtractionResults(extractionResults);
  const stateProjection = createContextStateProjectionReport({ generatedAt, extractionResults });
  const mode = input.mode ?? (input.taskId ? 'task' : 'full');
  const taskContext = input.taskId
    ? createTaskContextReport({
      taskId: input.taskId,
      nodes: merged.nodes,
      edges: merged.edges,
      stateProjection,
      issues: merged.issues
    })
    : undefined;

  return {
    schemaVersion: 'hadara.contextGraph.v1',
    command: 'context.graph',
    ok: merged.issues.every((issue) => issue.severity !== 'error') && stateProjection.ok,
    generatedAt,
    projectRoot: input.projectRoot,
    sourceHash: merged.source.sourceHash,
    mode,
    ...(input.taskId ? { taskId: input.taskId } : {}),
    nodes: merged.nodes,
    edges: merged.edges,
    ...(taskContext ? { taskContext } : {}),
    stateProjection,
    summary: summarizeContextGraphExtraction(merged.nodes, merged.edges, merged.issues),
    cache: input.cache ?? { used: false, hit: false },
    issues: merged.issues
  };
}

export function createTaskContextReport(input: CreateTaskContextReportInput): TaskContextReport {
  const task = findTaskNode(input.nodes, input.taskId);
  const connectedNodes = connectedNodeIds(input.edges, createTaskNodeId(input.taskId));
  const readFirst = task ? [candidate(task, 'Active task capsule is the first read for task-scoped context routing.', 'explicit')] : [];

  return {
    schemaVersion: 'hadara.taskContext.v1',
    taskId: input.taskId,
    ...(task ? { task } : {}),
    readFirst,
    readIfNeeded: readIfNeededCandidates(input.nodes, input.edges, connectedNodes),
    doNotReadByDefault: doNotReadByDefaultCandidates(input.nodes),
    relatedEvidence: relatedEvidenceCandidates(input.nodes, input.edges, input.taskId),
    relatedCommands: relatedCommandCandidates(input.nodes, input.edges, connectedNodes),
    knownProblems: knownProblemCandidates(input.nodes),
    validationSuggestions: validationSuggestions(input.taskId),
    stateIssues: taskStateIssues(input.stateProjection.issues, input.taskId),
    issues: input.issues
  };
}

function findTaskNode(nodes: ContextGraphNode[], taskId: string): ContextGraphNode | undefined {
  const nodeId = createTaskNodeId(taskId);
  const matches = nodes.filter((node) => node.id === nodeId && node.type === 'Task');
  return matches.find((node) => node.kind === 'task-capsule') ?? matches[0];
}

function readIfNeededCandidates(
  nodes: ContextGraphNode[],
  edges: ContextGraphEdge[],
  connectedIds: Set<string>
): ContextCandidate[] {
  const candidates = new Map<string, ContextCandidate>();
  for (const node of nodes) {
    if (node.type !== 'Document') continue;
    if (metadataBoolean(node, 'requiredReading')) {
      candidates.set(node.id, candidate(node, 'Document registry marks this document as required reading.', 'explicit'));
      continue;
    }
    if (connectedIds.has(node.id)) {
      candidates.set(node.id, candidate(node, 'Document is directly connected to the task graph.', 'derived'));
    }
  }
  for (const edge of edges) {
    if (!connectedIds.has(edge.from) && !connectedIds.has(edge.to)) continue;
    const from = nodes.find((node) => node.id === edge.from);
    const to = nodes.find((node) => node.id === edge.to);
    for (const node of [from, to]) {
      if (node?.type !== 'Document' || candidates.has(node.id)) continue;
      candidates.set(node.id, candidate(node, edge.reason, edge.confidence));
    }
  }
  return sortCandidates(Array.from(candidates.values()));
}

function doNotReadByDefaultCandidates(nodes: ContextGraphNode[]): ContextCandidate[] {
  return sortCandidates(nodes
    .filter((node) => node.type === 'Document')
    .filter((node) => {
      const status = String(node.status ?? '').toLowerCase();
      const kind = String(node.kind ?? '').toLowerCase();
      const readWhen = Array.isArray(node.metadata?.readWhen) ? node.metadata.readWhen.map(String) : [];
      return status === 'archived'
        || status === 'superseded'
        || kind.includes('historical')
        || readWhen.includes('historical')
        || metadataBoolean(node, 'requiredReading') === false && kind.includes('archive');
    })
    .map((node) => candidate(node, 'Historical, archived, or superseded document is excluded from default task routing.', 'derived')));
}

function relatedEvidenceCandidates(nodes: ContextGraphNode[], edges: ContextGraphEdge[], taskId: string): ContextCandidate[] {
  const taskNodeId = createTaskNodeId(taskId);
  const evidenceIds = new Set(edges
    .filter((edge) => edge.from === taskNodeId && (edge.type === 'HAS_EVIDENCE' || edge.type === 'CLOSES_WITH'))
    .map((edge) => edge.to));
  return sortCandidates(nodes
    .filter((node) => node.type === 'Evidence' && evidenceIds.has(node.id))
    .map((node) => candidate(node, 'Evidence is directly linked to this task.', 'explicit')));
}

function relatedCommandCandidates(
  nodes: ContextGraphNode[],
  edges: ContextGraphEdge[],
  connectedIds: Set<string>
): ContextCandidate[] {
  const commandIds = new Set<string>();
  for (const edge of edges) {
    if (edge.type !== 'DESCRIBES_COMMAND' && edge.type !== 'CHECKS_COMMAND') continue;
    if (connectedIds.has(edge.from)) commandIds.add(edge.to);
    if (connectedIds.has(edge.to)) commandIds.add(edge.from);
  }
  return sortCandidates(nodes
    .filter((node) => node.type === 'Command' && commandIds.has(node.id))
    .map((node) => candidate(node, 'Command is connected through task-relevant documentation or release checks.', 'derived')));
}

function knownProblemCandidates(nodes: ContextGraphNode[]): ContextCandidate[] {
  return sortCandidates(nodes
    .filter((node) => node.type === 'KnownProblem')
    .map((node) => candidate(node, 'Current handoff records this known problem.', 'explicit')));
}

function taskStateIssues(issues: StateConsistencyIssue[], taskId: string): StateConsistencyIssue[] {
  const relevant = issues.filter((issue) =>
    issue.message.includes(taskId) || issue.paths.some((path) => path.includes(taskId))
  );
  if (relevant.length > 0) return relevant;
  return issues.filter((issue) =>
    issue.code === 'STATE_ACTIVE_TASK_MISMATCH' || issue.code === 'STATE_TASK_CAPSULE_MISSING'
  );
}

function connectedNodeIds(edges: ContextGraphEdge[], taskNodeId: string): Set<string> {
  const ids = new Set<string>([taskNodeId]);
  for (const edge of edges) {
    if (edge.from === taskNodeId) ids.add(edge.to);
    if (edge.to === taskNodeId) ids.add(edge.from);
  }
  return ids;
}

function candidate(
  node: ContextGraphNode,
  reason: string,
  confidence: ContextCandidate['confidence']
): ContextCandidate {
  return {
    id: node.id,
    type: node.type,
    ...(node.path ? { path: node.path } : {}),
    reason,
    confidence,
    ...(node.source.hash ? { sourceHash: node.source.hash } : {})
  };
}

function metadataBoolean(node: ContextGraphNode, key: string): boolean | undefined {
  const value = node.metadata?.[key];
  return typeof value === 'boolean' ? value : undefined;
}

function validationSuggestions(taskId: string): string[] {
  return [
    'npm run test:focused -- tests/unit/context-graph-builder.test.ts',
    `node dist/cli/main.js task ready --task ${taskId} --level done --json`
  ];
}

function sortCandidates(candidates: ContextCandidate[]): ContextCandidate[] {
  return candidates.sort((a, b) => a.id.localeCompare(b.id));
}
