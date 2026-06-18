# Context Pack and Session Start Spec

## Status

Merged final planning specification.

## Goal

Provide an agent-facing read plan that reduces repeated broad project reading.

The intended primary agent UX is:

```bash
hadara context pack --task T-XXXX --json
```

However, Context Pack should be promoted as the primary agent UX only after Project Context Graph and Code Link Layer are available. Before that, graph/taskContext reports may ship as diagnostic read models.

Session Start is a later consumer:

```bash
hadara session start --json
```

## Dependencies

Best after:

```text
Project Context Graph Foundation + State Projection
Code Link Layer
```

Can ship in reduced form with Project Context Graph only, but must clearly report degraded/source availability.

## Non-Goals

- No project writes.
- No validation execution.
- No evidence append.
- No document patching.
- No source code modification.
- No release mutation.
- No hidden background work.
- No summarization.
- No local/remote model.

## Context Pack JSON Contract

### `hadara.contextPack.v1`

```ts
export interface ContextPackReport {
  schemaVersion: 'hadara.contextPack.v1';
  command: 'context.pack';
  ok: boolean;
  generatedAt: string;
  taskId?: string;
  projectRoot: string;
  budget: ContextBudget;
  readFirst: ContextPackItem[];
  readIfNeeded: ContextPackItem[];
  doNotReadByDefault: ContextPackItem[];
  validateWith: ValidationSuggestion[];
  writeBoundaries: WriteBoundaryHint[];
  sliceCandidates: SliceCandidate[];
  knownProblems: ContextPackItem[];
  stateProjection: StateProjectionSummary;
  sourceSummary: ContextPackSourceSummary;
  issues: ContextPackIssue[];
}
```

### Budget

```ts
export interface ContextBudget {
  targetTokens?: number;
  maxItems?: number;
  maxReadFirstItems: number;
  mode: 'minimal' | 'bounded' | 'expanded';
}
```

Default:

```json
{
  "maxReadFirstItems": 7,
  "mode": "bounded"
}
```

### ContextPackItem

```ts
export interface ContextPackItem {
  id: string;
  type:
    | 'Task'
    | 'Document'
    | 'ManagedSection'
    | 'Evidence'
    | 'Command'
    | 'SourceFile'
    | 'TestFile'
    | 'Symbol'
    | 'ReleaseCheck'
    | 'KnownProblem';
  path?: string;
  lineStart?: number;
  lineEnd?: number;
  title?: string;
  reason: string;
  confidence: 'explicit' | 'derived' | 'heuristic';
  sourceHash?: string;
  estimatedTokens?: number;
  required: boolean;
}
```

### ValidationSuggestion

```ts
export interface ValidationSuggestion {
  command: string;
  reason: string;
  requiredForClose: boolean;
  source: 'task-tests' | 'command-registry' | 'evidence-history' | 'release-readiness' | 'heuristic';
}
```

### WriteBoundaryHint

```ts
export interface WriteBoundaryHint {
  path: string;
  boundary:
    | 'read-only'
    | 'agent-freeform'
    | 'managed-section'
    | 'append-only'
    | 'dry-run-first'
    | 'release-mutation';
  reason: string;
}
```

### SliceCandidate

```ts
export interface SliceCandidate {
  id: string;
  path: string;
  strategy:
    | 'explicit-range'
    | 'symbol-neighborhood'
    | 'keyword-window'
    | 'tail-window'
    | 'diff-hunk'
    | 'managed-section';
  reason: string;
  suggestedCommand: string;
}
```

### SourceSummary

```ts
export interface ContextPackSourceSummary {
  graphAvailable: boolean;
  codeIndexAvailable: boolean;
  stateProjectionAvailable: boolean;
  docsRegistryAvailable: boolean;
  commandRegistryAvailable: boolean;
  degraded: boolean;
}
```

### Issue

```ts
export interface ContextPackIssue {
  severity: 'info' | 'warning' | 'error';
  code:
    | 'CONTEXT_PACK_TASK_NOT_FOUND'
    | 'CONTEXT_PACK_GRAPH_UNAVAILABLE'
    | 'CONTEXT_PACK_CODE_INDEX_UNAVAILABLE'
    | 'CONTEXT_PACK_STATE_PROJECTION_UNAVAILABLE'
    | 'CONTEXT_PACK_BUDGET_TRUNCATED'
    | 'CONTEXT_PACK_DEGRADED';
  message: string;
  path?: string;
  fixHint?: string;
}
```

## Ranking Rules

### readFirst

Hard cap default: 7 items.

Allowed:

- active task `TASK.md`;
- active task `CONTEXT.md` if present and current;
- current phase/spec doc if task references it;
- canonical lifecycle docs needed for current stage;
- explicitly related command docs;
- explicitly related source/test files after Code Link Layer;
- direct known blocker doc.

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
- related historical docs only when directly referenced;
- relevant release docs for release tasks;
- previous related handoff;
- likely tests or code edges with `derived` or `heuristic` confidence.

### doNotReadByDefault

Must include:

- historical docs;
- superseded docs;
- archived docs;
- unrelated release docs;
- unrelated Dashboard/TUI docs;
- broad planning docs not linked to current task.

## Budget Modes

| Mode | Meaning |
|---|---|
| `minimal` | active task + essential required reading only. |
| `bounded` | default; task + related docs/evidence/commands + high-confidence code. |
| `expanded` | includes tests, related history, and additional diagnostics. |

## State Projection Integration

Context Pack must include State Projection summary.

If state consistency is `error`, Context Pack should surface the state issue prominently and may include diagnostic commands in `validateWith`.

Example:

```json
{
  "stateProjection": {
    "stateConsistency": "warning",
    "issues": [
      {
        "code": "STATE_LATEST_TASK_MISMATCH",
        "paths": ["docs/PROJECT_STATE.md", "docs/TASK_BOARD.md"]
      }
    ]
  }
}
```

## Session Start

Session Start is a higher-level consumer of Context Pack.

### `hadara.sessionStart.v1`

```ts
export interface SessionStartReport {
  schemaVersion: 'hadara.sessionStart.v1';
  command: 'session.start';
  ok: boolean;
  generatedAt: string;
  currentState: {
    activeTask?: string;
    latestCompletedTask?: string;
    recommendedNextTask?: string;
    releaseState?: string;
  };
  contextPack: ContextPackReport;
  lifecycle: {
    primaryNextCommands: string[];
    diagnosticCommands: string[];
  };
  knownProblems: ContextPackItem[];
  issues: ContextPackIssue[];
}
```

Session Start must not scan independently. It composes:

```text
context pack
state projection
proof/evidence status
handoff
command registry
docs registry
```

## CLI Surface

Candidate:

```bash
hadara context pack --task T-XXXX --json
hadara context pack --task T-XXXX --budget 8000 --json
hadara session start --json
```

Additive fields may be added earlier to:

```bash
hadara task status --task T-XXXX --json
```

## Development Plan

1. Implement Context Pack schema.
2. Build pack from taskContext graph only.
3. Integrate State Projection.
4. Add readFirst/readIfNeeded/doNotReadByDefault ranking.
5. Add validation suggestions.
6. Add write boundary hints.
7. Add sliceCandidates.
8. Add code-aware pack after Code Link Layer.
9. Add Session Start as consumer after pack stabilizes.
10. Add docs and tests.

## Tests

```bash
npm run test:focused -- tests/unit/context-pack.test.ts tests/unit/session-start.test.ts
npm run build
npm test
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| CP-AC1 | Context Pack returns readFirst/readIfNeeded/doNotReadByDefault. |
| CP-AC2 | Every selected item includes reason and confidence. |
| CP-AC3 | Historical/superseded/archived docs are excluded from readFirst by default. |
| CP-AC4 | State Projection summary is included. |
| CP-AC5 | State errors surface prominently. |
| CP-AC6 | Validation suggestions are task-relevant. |
| CP-AC7 | Write boundary hints are present. |
| CP-AC8 | Slice candidates are produced where useful. |
| CP-AC9 | Session Start, if implemented, consumes Context Pack and does not scan independently. |
| CP-AC10 | Output is read-only. |
