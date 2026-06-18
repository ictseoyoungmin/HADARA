export const CONTEXT_GRAPH_SCHEMA_ID = 'hadara.contextGraph.v1' as const;
export const TASK_CONTEXT_SCHEMA_ID = 'hadara.taskContext.v1' as const;

export type ContextGraphCommand = 'context.graph';
export type TaskContextSchemaVersion = typeof TASK_CONTEXT_SCHEMA_ID;
export type ContextGraphSchemaVersion = typeof CONTEXT_GRAPH_SCHEMA_ID;

export type ContextGraphMode = 'full' | 'task';
export type ContextConfidence = 'explicit' | 'derived' | 'heuristic';

export type ContextGraphNodeType =
  | 'Task'
  | 'Document'
  | 'ManagedSection'
  | 'Evidence'
  | 'Command'
  | 'ReleaseCheck'
  | 'Decision'
  | 'KnownProblem';

export type ContextGraphEdgeType =
  | 'HAS_EVIDENCE'
  | 'CLOSES_WITH'
  | 'REFERENCES_DOC'
  | 'REQUIRED_FOR'
  | 'SUPERSEDES'
  | 'DESCRIBES_COMMAND'
  | 'BELONGS_TO_DOCUMENT'
  | 'CHECKS_COMMAND'
  | 'AFFECTS_SURFACE'
  | 'DEPENDS_ON_EVIDENCE'
  | 'HAS_DECISION'
  | 'HAS_KNOWN_PROBLEM';

export type ContextGraphIssueCode =
  | 'CONTEXT_GRAPH_SOURCE_MISSING'
  | 'CONTEXT_GRAPH_PARSE_FAILED'
  | 'CONTEXT_GRAPH_DOC_REGISTRY_MISSING'
  | 'CONTEXT_GRAPH_COMMAND_REGISTRY_MISSING'
  | 'CONTEXT_GRAPH_EVIDENCE_READ_FAILED'
  | 'CONTEXT_GRAPH_DEGRADED';

export type StateSourceKind =
  | 'task-board'
  | 'task-capsule'
  | 'project-state'
  | 'agent-handoff'
  | 'docs-registry'
  | 'release-readiness'
  | 'evidence';

export type StateConsistencyIssueCode =
  | 'STATE_LATEST_TASK_MISMATCH'
  | 'STATE_ACTIVE_TASK_MISMATCH'
  | 'STATE_TASK_BOARD_MISSING_ROW'
  | 'STATE_TASK_CAPSULE_MISSING'
  | 'STATE_CLOSE_PROOF_STALE'
  | 'STATE_RELEASE_EVIDENCE_STALE'
  | 'STATE_DOC_REQUIRED_READING_DRIFT'
  | 'STATE_UNKNOWN';

export interface ContextGraphSourceRef {
  path: string;
  line?: number;
  hash?: string;
  extractor: string;
}

export interface ContextGraphNode {
  id: string;
  type: ContextGraphNodeType;
  label: string;
  path?: string;
  status?: string;
  kind?: string;
  owner?: string;
  metadata?: Record<string, unknown>;
  source: ContextGraphSourceRef;
}

export interface ContextGraphEdge {
  id: string;
  from: string;
  to: string;
  type: ContextGraphEdgeType;
  confidence: ContextConfidence;
  reason: string;
  source: ContextGraphSourceRef;
}

export interface ContextGraphSummary {
  nodeCounts: Record<ContextGraphNodeType, number>;
  edgeCounts: Record<ContextGraphEdgeType, number>;
  sourcesRead: number;
  degraded: boolean;
}

export interface ContextGraphIssue {
  severity: 'info' | 'warning' | 'error';
  code: ContextGraphIssueCode;
  message: string;
  path?: string;
  fixHint?: string;
}

export interface ContextCandidate {
  id: string;
  type: ContextGraphNodeType;
  path?: string;
  reason: string;
  confidence: ContextConfidence;
  sourceHash?: string;
}

export interface StateSource {
  id: string;
  path: string;
  kind: StateSourceKind;
  hash?: string;
  extracted: Record<string, unknown>;
}

export interface StateConsistencyIssue {
  severity: 'info' | 'warning' | 'error';
  code: StateConsistencyIssueCode;
  message: string;
  paths: string[];
  fixHint?: string;
}

export interface ContextStateProjectionSummary {
  latestCompletedTask?: string;
  activeTask?: string;
  latestClosedTask?: string;
  releaseState?: string;
  stateConsistency: 'consistent' | 'warning' | 'error' | 'unknown';
}

export interface ContextStateProjectionReport {
  schemaVersion: 'hadara.stateProjection.v1';
  command: 'state.projection';
  ok: boolean;
  generatedAt: string;
  summary: ContextStateProjectionSummary;
  sources: StateSource[];
  issues: StateConsistencyIssue[];
}

export interface TaskContextReport {
  schemaVersion: TaskContextSchemaVersion;
  taskId: string;
  task?: ContextGraphNode;
  readFirst: ContextCandidate[];
  readIfNeeded: ContextCandidate[];
  doNotReadByDefault: ContextCandidate[];
  relatedEvidence: ContextCandidate[];
  relatedCommands: ContextCandidate[];
  knownProblems: ContextCandidate[];
  validationSuggestions: string[];
  stateIssues: StateConsistencyIssue[];
  issues: ContextGraphIssue[];
}

export interface ContextCacheMetadata {
  used: boolean;
  hit: boolean;
  manifestHash?: string;
  createdAt?: string;
  cachePath?: string;
}

export interface ContextGraphReport {
  schemaVersion: ContextGraphSchemaVersion;
  command: ContextGraphCommand;
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  sourceHash: string;
  mode: ContextGraphMode;
  taskId?: string;
  nodes: ContextGraphNode[];
  edges: ContextGraphEdge[];
  taskContext?: TaskContextReport;
  stateProjection: ContextStateProjectionReport;
  summary: ContextGraphSummary;
  cache?: ContextCacheMetadata;
  issues: ContextGraphIssue[];
}

export interface GraphExtractionResult {
  source: {
    extractor: string;
    paths: string[];
    sourceHash: string;
  };
  nodes: ContextGraphNode[];
  edges: ContextGraphEdge[];
  stateSources?: StateSource[];
  issues: ContextGraphIssue[];
}

export const CONTEXT_GRAPH_NODE_TYPES: ContextGraphNodeType[] = [
  'Task',
  'Document',
  'ManagedSection',
  'Evidence',
  'Command',
  'ReleaseCheck',
  'Decision',
  'KnownProblem'
];

export const CONTEXT_GRAPH_EDGE_TYPES: ContextGraphEdgeType[] = [
  'HAS_EVIDENCE',
  'CLOSES_WITH',
  'REFERENCES_DOC',
  'REQUIRED_FOR',
  'SUPERSEDES',
  'DESCRIBES_COMMAND',
  'BELONGS_TO_DOCUMENT',
  'CHECKS_COMMAND',
  'AFFECTS_SURFACE',
  'DEPENDS_ON_EVIDENCE',
  'HAS_DECISION',
  'HAS_KNOWN_PROBLEM'
];

export const CONTEXT_CONFIDENCE_LEVELS: ContextConfidence[] = ['explicit', 'derived', 'heuristic'];
