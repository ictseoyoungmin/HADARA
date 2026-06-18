# T-0352 Create/start C1 Context Graph CLI and Read Surface

## Metadata

| Field | Value |
|---|---|
| ID | T-0352 |
| Title | Create/start C1 Context Graph CLI and Read Surface |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Expose the C1 context graph builder through a read-only CLI surface. | Implement `hadara context graph --json` and `hadara context graph --task T-XXXX --json` over the T-0351 builder with command registry/docs/tests. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara context graph --json`. | Spec-listed full graph read surface. |
| `hadara context graph --task T-XXXX --json`. | Spec-listed task-scoped graph/task context read surface. |
| Command registry metadata. | New public command must be discoverable and classified read-only. |
| Focused CLI tests and smoke validation. | Public CLI behavior needs runtime dispatch and schema coverage. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Persistent graph cache. | Requires a separate invalidation/storage-boundary capsule. |
| Adding context fields to `task status` or `status`. | Additive existing-surface integration should follow the dedicated command once stable. |
| MCP context graph tool. | MCP/read tool exposure belongs to later C1/C2 integration after CLI contract stabilizes. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | In Progress | Scoped to read-only context graph CLI/read surface and command registry metadata. | TBD |
| 2026-06-18 | Done | Read-only `context graph` CLI/read surface implemented and validated. | ev:T-0352:d70ee6360acf43948d7cf620 |
<!-- hadara:managed:end task-status-history -->
