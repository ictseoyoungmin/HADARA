# Phase 8.4 - State Consistency Projection

## Status

Planned implementation specification.

## Problem

HADARA has several state-bearing artifacts:

```text
docs/TASK_BOARD.md
tasks/T-*/TASK.md
tasks/T-*/HANDOFF.md
tasks/T-*/evidence.jsonl
docs/PROJECT_STATE.md
docs/AGENT_HANDOFF.md
.hadara/docs-registry.json
docs/RELEASE_READINESS.md
```

Agents need a read-only way to see whether these sources agree, without creating a new authoritative state file.

## Goal

Build a read-only state projection that detects and explains drift between task, docs, evidence, close proof, handoff, and release readiness surfaces.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| New `state.json` source of truth. | Projection must be rebuildable. |
| Automatic repair. | Explain first, repair later. |
| Broad Markdown rewriting. | Too risky without dry-run-first repair specs. |
| Context graph. | Graph is a later projection layer. |
| Release mutation. | Projection only reads release state. |

## Schema

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
    latestRelease?: string;
    stateConsistency: 'consistent' | 'warning' | 'error' | 'unknown';
  };
  sources: StateSource[];
  issues: StateConsistencyIssue[];
}
```

### Source

```ts
export interface StateSource {
  id: string;
  path: string;
  kind:
    | 'task-board'
    | 'project-state'
    | 'agent-handoff'
    | 'task-capsule'
    | 'docs-registry'
    | 'release-readiness'
    | 'evidence';
  hash?: string;
  extracted: Record<string, unknown>;
}
```

### Issue

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
    | 'STATE_DOC_REGISTRY_MISSING'
    | 'STATE_HANDOFF_STALE'
    | 'STATE_HANDOFF_STATUS_DRIFT'
    | 'STATE_PLAN_STATUS_DRIFT';
  message: string;
  paths: string[];
  fixHint?: string;
}
```

## Checks

| Check | Description |
|---|---|
| Latest completed task consistency | Compare Task Board latest Done, Project State latest completed, and Agent Handoff latest completed. |
| Active task consistency | Compare Project State active task, Agent Handoff active/next, and Task Board rows. |
| Capsule existence | Ensure referenced task capsule paths exist. |
| Close proof freshness | Use latest close evidence/audit state for the latest completed task when available. |
| Handoff status drift | Detect stale pending-close wording and mismatched TaskStatus/CloseState. |
| Plan status drift | Detect In Progress plan rows after Done completion. |
| Release state freshness | Compare release readiness text with latest release/recycle evidence where practical. |
| Docs registry availability | Ensure registry exists and required reading is not stale. |

## CLI Surface

Prefer additive integration before command sprawl.

Candidate standalone command:

```bash
hadara state projection --json
```

Candidate additive surfaces:

```bash
hadara status --json
hadara protocol doctor --json
hadara ci gate --mode advisory --json
```

rc1 may implement a standalone internal service and expose it through `status --json` or `protocol doctor` first if that keeps the CLI surface smaller.

## Worker Ergonomics

The projection should answer:

```text
What state disagrees?
Which file owns each conflicting value?
Is this an error or a warning?
Which existing command or manual edit should fix it?
Will this command write anything? No.
```

Every issue must include paths and a practical `fixHint`.

## Tests

Recommended focused tests:

```bash
npm run test:focused -- tests/unit/state-projection.test.ts tests/unit/protocol-consistency.test.ts tests/unit/status-json.test.ts
```

Test fixtures should include:

```text
latest task mismatch
missing capsule path
stale close proof
Done task with HANDOFF pending lifecycle close
Done task with PLAN In Progress
clean current state
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | State projection is read-only. |
| AC-2 | Projection reports sources with paths and extracted values. |
| AC-3 | Latest task mismatch is detected. |
| AC-4 | Missing capsule is detected. |
| AC-5 | Stale close proof is surfaced. |
| AC-6 | Handoff and plan drift are surfaced. |
| AC-7 | Issues include fix hints. |
| AC-8 | Projection is available to at least one existing read-only report or a clearly documented new command. |
