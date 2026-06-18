# T-0361 C3 Context Pack Schema and Ranking

## Metadata

| Field | Value |
|---|---|
| ID | T-0361 |
| Title | C3 Context Pack Schema and Ranking |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add the C3 context pack schema/types and deterministic ranking service. | This mirrors the C1-C2 pattern: establish contract and internal read model first, then add public CLI in a later capsule. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.contextPack.v1` TypeScript model and JSON schema fixture. | C3 needs a stable report contract before CLI exposure. |
| Internal context pack builder over the existing C1/C2 context graph report. | Ranking should reuse graph/code-index outputs and avoid independent broad scans, preserving the C6 speed path. |
| Deterministic ranking for `readFirst`, `readIfNeeded`, `doNotReadByDefault`, validation hints, write boundaries, known problems, and source summary. | First C3 capsule is schema and ranking. |
| Focused unit/schema coverage. | C1-C2 established focused contract tests per capsule. |
| Docs/state updates. | User requested docs reflection and HADARA close workflow requires state docs. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Public `hadara context pack --json` CLI command. | Worker plan lists "Context pack from graph only" and CLI/docs examples as later C3 capsules. |
| C4 actual line slicing. | C4 starts after C3 ranking; this capsule emits only slice candidate-shaped data if useful. |
| Persistent C6 cache implementation. | C3 must be cache-compatible but not implement cache/source manifest yet. |
| Session start command. | C5 is a later consumer of context pack. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
