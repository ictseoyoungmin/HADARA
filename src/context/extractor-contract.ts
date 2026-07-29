import crypto from 'node:crypto';
import path from 'node:path';
import type {
  ContextGraphEdge,
  ContextGraphEdgeType,
  ContextGraphIssue,
  ContextGraphNode,
  ContextGraphNodeType,
  ContextGraphSourceRef,
  ContextGraphSummary,
  GraphExtractionResult,
  StateSource
} from './context-graph';
import { CONTEXT_GRAPH_EDGE_TYPES, CONTEXT_GRAPH_NODE_TYPES } from './context-graph';

export type ContextGraphExtractorName =
  | 'extractTaskBoard'
  | 'extractTaskCapsules'
  | 'extractDocsRegistry'
  | 'extractCommandRegistry'
  | 'extractManagedSections'
  | 'extractEvidence'
  | 'extractReleaseReadiness'
  | 'extractDecisions';

export interface ContextGraphExtractionContext {
  projectRoot: string;
  taskId?: string;
  generatedAt: string;
}

export interface ContextGraphExtractor {
  name: ContextGraphExtractorName;
  extract(context: ContextGraphExtractionContext): GraphExtractionResult;
}

export interface ContextGraphSourceInput {
  path: string;
  content?: string | null;
  hash?: string;
}

export function normalizeContextGraphPath(inputPath: string): string {
  const normalized = inputPath.replace(/\\/g, '/').replace(/^\.\//, '');
  return normalized.split('/').filter((part) => part.length > 0).join('/');
}

export function toProjectRelativeContextPath(projectRoot: string, absoluteOrRelativePath: string): string {
  const resolvedRoot = path.resolve(projectRoot);
  const resolvedPath = path.isAbsolute(absoluteOrRelativePath)
    ? path.resolve(absoluteOrRelativePath)
    : path.resolve(resolvedRoot, absoluteOrRelativePath);
  const relative = path.relative(resolvedRoot, resolvedPath);
  return normalizeContextGraphPath(relative || '.');
}

export function hashContextGraphText(value: string): string {
  return `sha256:${crypto.createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

export function hashContextGraphJson(value: unknown): string {
  return hashContextGraphText(stableStringify(value));
}

export function hashContextGraphSources(sources: ContextGraphSourceInput[]): string {
  return hashContextGraphJson(sources.map((source) => ({
    path: normalizeContextGraphPath(source.path),
    hash: source.hash ?? (source.content == null ? null : hashContextGraphText(source.content))
  })).sort((a, b) => a.path.localeCompare(b.path)));
}

export function createContextGraphSourceRef(input: {
  path: string;
  extractor: ContextGraphExtractorName | string;
  line?: number;
  content?: string | null;
  hash?: string;
}): ContextGraphSourceRef {
  return {
    path: normalizeContextGraphPath(input.path),
    ...(input.line === undefined ? {} : { line: input.line }),
    ...(input.hash || input.content != null ? { hash: input.hash ?? hashContextGraphText(input.content ?? '') } : {}),
    extractor: input.extractor
  };
}

export function createTaskNodeId(taskId: string): string {
  return `task:${taskId}`;
}

export function createDocumentNodeId(documentPath: string): string {
  return `doc:${normalizeContextGraphPath(documentPath)}`;
}

export function createManagedSectionNodeId(documentPath: string, sectionId: string): string {
  return `section:${normalizeContextGraphPath(documentPath)}#${sectionId}`;
}

export function createCommandNodeId(commandId: string): string {
  return `command:${commandId}`;
}

export function createEvidenceNodeId(evidenceId: string): string {
  return evidenceId;
}

export function createReleaseCheckNodeId(name: string): string {
  return `release-check:${normalizeIdPart(name)}`;
}

export function createDecisionNodeId(documentPath: string, decisionId: string): string {
  return `decision:${normalizeContextGraphPath(documentPath)}#${decisionId}`;
}

export function createKnownProblemNodeId(documentPath: string, text: string): string {
  return `known-problem:${sha256Hex(`${normalizeContextGraphPath(documentPath)}\n${normalizeWhitespace(text)}`)}`;
}

export function createContextGraphEdgeId(input: {
  type: ContextGraphEdgeType;
  from: string;
  to: string;
  source: ContextGraphSourceRef;
  reason: string;
}): string {
  return `edge:${input.type}:${sha256Hex(stableStringify({
    from: input.from,
    to: input.to,
    source: {
      path: normalizeContextGraphPath(input.source.path),
      line: input.source.line ?? null,
      extractor: input.source.extractor
    },
    reason: normalizeWhitespace(input.reason)
  }))}`;
}

export function createEmptyExtractionResult(
  extractor: ContextGraphExtractorName,
  sources: ContextGraphSourceInput[] = []
): GraphExtractionResult {
  return {
    source: {
      extractor,
      paths: sources.map((source) => normalizeContextGraphPath(source.path)).sort(),
      sourceHash: hashContextGraphSources(sources)
    },
    nodes: [],
    edges: [],
    stateSources: [],
    issues: []
  };
}

export function mergeGraphExtractionResults(results: GraphExtractionResult[]): GraphExtractionResult {
  const sourceInputs = results.flatMap((result) =>
    result.source.paths.map((sourcePath) => ({ path: sourcePath, hash: result.source.sourceHash }))
  );
  return {
    source: {
      extractor: 'mergeGraphExtractionResults',
      paths: Array.from(new Set(results.flatMap((result) => result.source.paths))).sort(),
      sourceHash: hashContextGraphSources(sourceInputs)
    },
    nodes: dedupeById(results.flatMap((result) => result.nodes)),
    edges: dedupeById(results.flatMap((result) => result.edges)),
    stateSources: dedupeStateSources(results.flatMap((result) => result.stateSources ?? [])),
    issues: results.flatMap((result) => result.issues)
  };
}

export function summarizeContextGraphExtraction(nodes: ContextGraphNode[], edges: ContextGraphEdge[], issues: ContextGraphIssue[]): ContextGraphSummary {
  return {
    nodeCounts: countByVocabulary(CONTEXT_GRAPH_NODE_TYPES, nodes.map((node) => node.type)),
    edgeCounts: countByVocabulary(CONTEXT_GRAPH_EDGE_TYPES, edges.map((edge) => edge.type)),
    sourcesRead: new Set(nodes.map((node) => node.source.path).concat(edges.map((edge) => edge.source.path))).size,
    degraded: issues.some((issue) => issue.severity === 'warning' || issue.severity === 'error')
  };
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const deduped: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    deduped.push(item);
  }
  return deduped;
}

function dedupeStateSources(items: StateSource[]): StateSource[] {
  return dedupeById(items);
}

function countByVocabulary<T extends string>(vocabulary: T[], values: T[]): Record<T, number> {
  const counts = Object.fromEntries(vocabulary.map((value) => [value, 0])) as Record<T, number>;
  for (const value of values) counts[value] += 1;
  return counts;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(',')}}`;
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeIdPart(value: string): string {
  return normalizeWhitespace(value).toLowerCase().replace(/[^a-z0-9_.-]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
}

function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}
