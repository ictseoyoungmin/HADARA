# T-0356 C2 Command Implementation and Test File Hints

## Metadata

| Field | Value |
|---|---|
| ID | T-0356 |
| Title | C2 Command Implementation and Test File Hints |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add command implementation and command test-file hints to the C2 code index. | Extend command registry metadata and code-index projection so command ids link to implementation files and explicitly registered test files without adding broad test relation heuristics, graph integration, cache writes, or public CLI behavior. |

## Scope

| In Scope | Reason |
|---|---|
| Command registry `implementationFiles` and `testFiles` metadata | Implements CL-AC3 and worker-plan C2 step 4. |
| Code-index command hint extraction | Populates command family metadata on indexed files and emits source-addressed command hint edges. |
| Explicit `IMPLEMENTS_COMMAND` and registry-hinted `TESTS_FILE` edges | Makes command-to-file routing visible while keeping confidence metadata. |
| Focused tests for explicit hints and limited fallback behavior | Keeps this capsule independently verifiable before broader test relation work. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Test import/name/text heuristics | Next C2 capsule. |
| Evidence/doc-derived test links | Later C2 capsules or graph integration. |
| Context graph merge or `--include-code` CLI | Final C2 integration step. |
| Dedicated `hadara code` command | Explicitly deferred by the spec until command placement is clear. |
| Cache writes/performance budget | Later C2/cache capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18T11:18:11.482Z | Done | Command registry implementation/test-file hints and code-index command hint edges are implemented and validated. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
<!-- hadara:managed:end task-status-history -->
