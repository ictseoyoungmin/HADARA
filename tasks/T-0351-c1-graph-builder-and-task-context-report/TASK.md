# T-0351 C1 Graph Builder and Task Context Report

## Metadata

| Field | Value |
|---|---|
| ID | T-0351 |
| Title | C1 Graph Builder and Task Context Report |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Build an internal C1 context graph report assembler and task-scoped context report. | Combine existing extractors, state projection, graph summary, and task context candidate derivation into schema-valid reports without opening the CLI surface yet. |

## Scope

| In Scope | Reason |
|---|---|
| Context graph report builder API. | C1 needs one deterministic assembler before command/read-surface integration. |
| Task context report derivation. | Worker agents need task-scoped read-first/read-if-needed/do-not-read/evidence/problem guidance from graph data. |
| Default extractor collection wiring. | Ensures implemented extractors are reachable through one internal entry point before CLI integration. |
| Unit tests with schema validation. | Locks report shape and candidate routing behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Public `hadara context graph` CLI command. | Planned for a later C1 integration capsule after the builder contract is stable. |
| Persistent cache manifests. | Cache policy requires separate invalidation and storage-boundary work. |
| C2 worker-agent controller behavior. | This capsule only supplies context reports consumed by later worker orchestration. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | In Progress | Scoped to internal C1 graph builder and task context report before CLI exposure. | TBD |
| 2026-06-18 | Done | Internal graph builder and task context report implemented and validated. | ev:T-0351:8783d5087eed426ca228ce02 |
<!-- hadara:managed:end task-status-history -->
