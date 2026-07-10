# Project Context Graph Foundation and State Projection Spec

## Status

Merged final planning specification.

## Goal

Build a deterministic, rebuildable graph projection over existing HADARA artifacts and produce a derived state projection from the same extractors.

This is the C1 foundation for later code links, context packs, slices, and session start.

## Core Rule

```text
Graph is not truth.
State projection is not truth.
Both are rebuildable projections.
```

Canonical truth remains in task capsules, docs, registries, evidence logs, release artifacts, and source files.

## Scope

Graph node families:

```text
Task
Document
ManagedSection
Evidence
Command
ReleaseCheck
Decision
KnownProblem
```

State projection signals:

```text
latestCompletedTask
activeTask
latestClosedTask
releaseState
stateConsistency
stateIssues
```

## Non-Goals

- No code file/symbol graph.
- No vector search.
- No local/remote model.
- No summarization.
- No context pack.
- No session start.
- No file mutation.
- No new authoritative state store such as `.state/state.json`.

## Input Sources

| Source | Use |
|---|---|
| `docs/TASK_BOARD.md` | Task nodes, status, capsule paths. |
| `tasks/T-*/TASK.md` | Task metadata/status. |
| `tasks/T-*/HANDOFF.md` | Task-local handoff/known-problem hints. |
| `tasks/T-*/DECISIONS.md` | Decision nodes. |
| `tasks/T-*/evidence.jsonl` | Evidence nodes and evidence edges. |
| `.hadara/docs-registry.json` | Document nodes, status, readWhen, supersession. |
| command registry | Command nodes, lifecycle stage, write boundary. |
| managed section parser | ManagedSection nodes and section edges. |
| `docs/AGENT_HANDOFF.md` | Project known problems and active/next task hints. |
| `docs/PROJECT_STATE.md` | Project state hints. |
| `docs/RELEASE_READINESS.md` | ReleaseCheck nodes and release state hints. |

## JSON Contract

### `hadara.contextGraph.v1`

```ts
export interface ContextGraphReport {
  schemaVersion: 'hadara.contextGraph.v1';
  command: 'context.graph';
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  sourceHash: string;
  mode: 'full' | 'task';
  taskId?: string;
  nodes: ContextGraphNode[];
  edges: ContextGraphEdge[];
  taskContext?: TaskContextReport;
  stateProjection: StateProjectionReport;
  summary: ContextGraphSummary;
  cache?: ContextCacheMetadata;
  issues: ContextGraphIssue[];
}
```

### Node

```ts
export type ContextGraphNodeType =
  | 'Task'
  | 'Document'
  | 'ManagedSection'
  | 'Evidence'
  | 'Command'
  | 'ReleaseCheck'
  | 'Decision'
  | 'KnownProblem';

export interface ContextGraphNode {
  id: string;
  type: ContextGraphNodeType;
  label: string;
  path?: string;
  status?: string;
  kind?: string;
  owner?: string;
  metadata?: Record<string, unknown>;
  source: {
    path: string;
    line?: number;
    hash?: string;
    extractor: string;
  };
}
```

### Edge

```ts
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

export interface ContextGraphEdge {
  id: string;
  from: string;
  to: string;
  type: ContextGraphEdgeType;
  confidence: 'explicit' | 'derived' | 'heuristic';
  reason: string;
  source: {
    path: string;
    line?: number;
    hash?: string;
    extractor: string;
  };
}
```

### Summary

```ts
export interface ContextGraphSummary {
  nodeCounts: Record<ContextGraphNodeType, number>;
  edgeCounts: Record<ContextGraphEdgeType, number>;
  sourcesRead: number;
  degraded: boolean;
}
```

### Issue

```ts
export interface ContextGraphIssue {
  severity: 'info' | 'warning' | 'error';
  code:
    | 'CONTEXT_GRAPH_SOURCE_MISSING'
    | 'CONTEXT_GRAPH_PARSE_FAILED'
    | 'CONTEXT_GRAPH_DOC_REGISTRY_MISSING'
    | 'CONTEXT_GRAPH_COMMAND_REGISTRY_MISSING'
    | 'CONTEXT_GRAPH_EVIDENCE_READ_FAILED'
    | 'CONTEXT_GRAPH_DEGRADED';
  message: string;
  path?: string;
  fixHint?: string;
}
```

## State Projection

State Projection is part of this C1 foundation.

It is built from the same extractors as the graph and must not become a new source of truth.

### `hadara.stateProjection.v1`

```ts
export interface StateProjectionReport {
  schemaVersion: 'hadara.stateProjection.v1';
  command: 'state.projection';
  ok: boolean;
  generatedAt: string;
  summary: {
    latestCompletedTask?: string;
    activeTask?: string;
    latestClosedTask?: string;
    releaseState?: string;
    stateConsistency: 'consistent' | 'warning' | 'error' | 'unknown';
  };
  sources: StateSource[];
  issues: StateConsistencyIssue[];
}
```

### StateSource

```ts
export interface StateSource {
  id: string;
  path: string;
  kind:
    | 'task-board'
    | 'task-capsule'
    | 'project-state'
    | 'agent-handoff'
    | 'docs-registry'
    | 'release-readiness'
    | 'evidence';
  hash?: string;
  extracted: Record<string, unknown>;
}
```

### StateConsistencyIssue

```ts
export interface StateConsistencyIssue {
  severity: 'info' | 'warning' | 'error';
  code:
    | 'STATE_LATEST_TASK_MISMATCH'
    | 'STATE_ACTIVE_TASK_MISMATCH'
    | 'STATE_TASK_BOARD_MISSING_ROW'
    | 'STATE_TASK_CAPSULE_MISSING'
    | 'STATE_CLOSE_PROOF_STALE'
    | 'STATE_RELEASE_EVIDENCE_STALE'
    | 'STATE_DOC_REQUIRED_READING_DRIFT'
    | 'STATE_UNKNOWN';
  message: string;
  paths: string[];
  fixHint?: string;
}
```

## Deterministic ID Rules

| Entity | ID |
|---|---|
| Task | `task:T-XXXX` |
| Document | `doc:<portable-path>` |
| ManagedSection | `section:<portable-path>#<section-id>` |
| Evidence v2 | persisted `ev:T-XXXX:<id>` |
| Legacy evidence | normalized legacy compatibility id |
| Command | `command:<command-id>` |
| ReleaseCheck | `release-check:<name>` |
| Decision | `decision:<path>#<decision-id>` |
| KnownProblem | `known-problem:<sha256(path + normalized text)>` |
| Edge | `edge:<type>:<sha256(from + to + source + reason)>` |

## Evidence ID Policy

Persisted v2 `ev:` ids with `idStability: durable` may be used for long-lived graph edges and exact references.

Legacy compatibility ids may be shown for inspection, but must not be recommended for durable `resolves:` / `supersedes:` workflows.

Graph reports should expose:

```text
id
idSource
idStability
persistedSchemaVersion
```

for Evidence nodes.

## Extractor Contract

Each extractor returns nodes, edges, and issues.

```ts
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
```

Required extractors:

```text
extractTaskBoard()
extractTaskCapsules()
extractDocsRegistry()
extractCommandRegistry()
extractManagedSections()
extractEvidence()
extractReleaseReadiness()
extractAgentHandoff()
extractDecisions()
```

## Confidence Policy

| Confidence | Meaning |
|---|---|
| `explicit` | Declared by registry, metadata, evidence id/tag, or managed section marker. |
| `derived` | Derived from file path ownership or artifact containment. |
| `heuristic` | Text mention or weak naming signal. |

Rules:

```text
readFirst candidates must come from explicit or derived edges.
heuristic edges may appear in readIfNeeded or diagnostics only.
```

## Task Context Report

The graph should provide task-centered output so agents do not need to read the whole graph.

### `hadara.taskContext.v1`

```ts
export interface TaskContextReport {
  schemaVersion: 'hadara.taskContext.v1';
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
```

### ContextCandidate

```ts
export interface ContextCandidate {
  id: string;
  type: ContextGraphNodeType;
  path?: string;
  reason: string;
  confidence: 'explicit' | 'derived' | 'heuristic';
  sourceHash?: string;
}
```

## CLI Surface

Candidate dedicated read-only commands:

```bash
hadara context graph --json
hadara context graph --task T-XXXX --json
```

Additive fields should also be considered on existing read surfaces:

```bash
hadara task status --task T-XXXX --json
hadara status --json
hadara protocol doctor --json
hadara docs required-reading --json
```

New public commands must be command-registry entries.

Suggested command registry metadata:

```text
family: project-diagnostics or context
scope: project
requiredness: diagnostic
writeBoundary: read-only
actor: agent-worker / agent-reviewer
```

## Read Tier Rules

### readFirst

Allowed:

- active task `TASK.md`;
- active task `CONTEXT.md` if present and current;
- current phase/spec doc if explicitly referenced;
- canonical lifecycle docs needed for current stage;
- directly related command docs;
- directly related evidence records;
- direct known blocker docs.

Not allowed by default:

- historical docs;
- superseded docs;
- archived docs;
- broad release docs for non-release tasks;
- broad dashboard/TUI docs for non-UI tasks;
- heuristic-only candidates unless no better context exists.

### readIfNeeded

Allowed:

- reference docs;
- prior related handoffs;
- related historical docs only when directly referenced;
- command reference docs;
- release docs for release tasks.

### doNotReadByDefault

Include:

- historical docs;
- superseded docs;
- archived docs;
- unrelated release/dashboard/TUI docs.

## Development Plan

1. Define graph/state schemas and fixtures.
2. Implement extractor contract.
3. Implement Task Board and Task Capsule extractors.
4. Implement docs registry and command registry extractors.
5. Implement evidence extractor.
6. Implement managed section extractor.
7. Implement release readiness and handoff extractors.
8. Build graph report.
9. Build state projection report.
10. Build task context report.
11. Add CLI/read surface integration.
12. Add docs and command registry entries.
13. Add focused and full validation.

## Tests

```bash
npm run test:focused -- tests/unit/context-graph.test.ts tests/unit/state-projection.test.ts tests/unit/task-context.test.ts
npm run build
npm test
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| CG-AC1 | `hadara.contextGraph.v1` report exists. |
| CG-AC2 | Graph commands are read-only. |
| CG-AC3 | Task / Document / ManagedSection / Evidence / Command / ReleaseCheck / Decision / KnownProblem nodes are supported. |
| CG-AC4 | Node and edge ids are deterministic. |
| CG-AC5 | Given a task id, related docs/evidence/commands/known problems are returned. |
| CG-AC6 | Historical/superseded/archived docs are not placed in `readFirst` by default. |
| CG-AC7 | Evidence nodes expose id/idSource/idStability/persistedSchemaVersion where available. |
| CG-AC8 | Legacy evidence ids are inspection-only and not recommended as durable references. |
| CG-AC9 | `hadara.stateProjection.v1` report exists. |
| CG-AC10 | Latest/active task mismatches are detected. |
| CG-AC11 | Close proof stale state is surfaced. |
| CG-AC12 | Release evidence stale/missing state is surfaced. |
| CG-AC13 | Graph/cache are rebuildable and non-authoritative. |
| CG-AC14 | No code index, vector search, context pack, or session start is included in this phase. |
