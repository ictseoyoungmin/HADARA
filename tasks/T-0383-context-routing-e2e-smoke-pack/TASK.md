# T-0383 Context Routing E2E Smoke Pack

## Metadata

| Field | Value |
|---|---|
| ID | T-0383 |
| Title | Context Routing E2E Smoke Pack |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Add a repeatable context-routing E2E smoke pack. | The pack should exercise built CLI JSON behavior through subprocesses without writing context cache during normal smoke runs. |

## Scope

| In Scope | Reason |
|---|---|
| Built CLI smoke script for context-routing surfaces. | Gives operators a focused command outside the full benchmark harness. |
| Fast and full workload profiles. | Mounted workspaces need a bounded default while graph/cache/pack remain explicitly selectable. |
| Unit coverage for script routing and report shape. | Prevents the smoke wrapper from drifting from expected workloads. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Runtime optimization of slow graph/cache/pack commands. | T-0384 and later C6 cleanup own diagnostics/performance fixes. |
| Cache warm execute smoke on the live workspace. | Normal smoke must not write `.hadara/local/cache/context`; execute validation belongs in temp/Docker contexts. |
| New CLI command surface. | This capsule adds a dev script/package script, not a user-facing HADARA CLI command. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | TBD |
| 2026-06-19 | In Progress | Implementing context-routing E2E smoke script and validation. | TBD |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
