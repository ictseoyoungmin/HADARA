# T-0358 C2 Context Graph Integration

## Metadata

| Field | Value |
|---|---|
| ID | T-0358 |
| Title | C2 Context Graph Integration |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Merge C2 code index results into the C1 context graph as an additive read-only extension. | Expose source/test/fixture/config/symbol nodes and code relation edges through `hadara context graph --include-code --json` and task-scoped graph output without changing default C1 output. |

## Scope

| In Scope | Reason |
|---|---|
| Add graph node/edge type support for C2 file, symbol, and code relation projections. | Required by `02_Code_Link_Layer_Spec.md` graph integration. |
| Add `--include-code` to `hadara context graph`. | Spec-preferred CLI surface for code-aware graph output. |
| Add focused tests for default graph compatibility and code-aware graph output. | Proves the additive contract and task-scoped integration. |
| Update docs and evidence for the completed C2 graph integration capsule. | Required by HADARA workflow. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Dedicated `hadara code index` or `hadara code explain` commands. | The spec says to prefer additive graph options unless command registry placement is clear. |
| Persistent context cache or performance cache implementation. | C2 graph integration can remain rebuildable/read-only; cache/performance hardening can be a later capsule if needed. |
| Context pack, context slice, or session-start behavior. | Those are C3-C5 phases, not this C2 capsule. |
| Source modification, shell execution, provider calls, evidence generation from graph data, or release mutation. | Context routing commands must stay read-only. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | In Progress | Started C2 context graph integration from current handoff. | `task next` recommended TBD C2 Context Graph Integration. |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
