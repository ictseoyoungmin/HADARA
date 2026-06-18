# T-0357 C2 Test Relation Edges

## Metadata

| Field | Value |
|---|---|
| ID | T-0357 |
| Title | C2 Test Relation Edges |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add C2 test relation edges to the code index. | Emit confidence-scored test relations from test imports, filename matches, command-id mentions, and evidence-referenced test paths without graph integration, public CLI behavior, or cache writes. |

## Scope

| In Scope | Reason |
|---|---|
| Test import relation edges | Implements the explicit test-import signal in the C2 spec. |
| Test filename/source filename derived edges | Implements the derived filename-match signal. |
| Command id mention heuristic edges | Implements the heuristic command mention signal. |
| Evidence-referenced test path validation edges | Links indexed tests to evidence records that explicitly mention them. |
| Focused tests for confidence boundaries | Keeps the slice verifiable before graph integration. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Context graph merge or `--include-code` CLI | Next/final C2 integration capsule. |
| Dedicated `hadara code` command | Deferred by the spec. |
| Cache writes/performance budget | Later C2/cache capsule. |
| Deep AST semantic test discovery | Non-goal for the initial C2 implementation. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18T11:27:56.470Z | Done | Test relation and evidence validation edges are implemented and validated. | `ev:T-0357:6406481495244038961bd0de` |
<!-- hadara:managed:end task-status-history -->
