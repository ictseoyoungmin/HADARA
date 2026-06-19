# T-0380 C6 Performance Regression Fixtures

## Metadata

| Field | Value |
|---|---|
| ID | T-0380 |
| Title | C6 Performance Regression Fixtures |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Add an advisory regression fixture to the context-routing performance baseline script. | The existing T-0373 script measures mounted/ext4 behavior but cannot compare a run against expected budgets or include default Session Start workloads. |

## Scope

| In Scope | Reason |
|---|---|
| Add session-start workloads to the benchmark script. | T-0379 made Session Start the main consumer path; it needs to appear in future performance checks. |
| Add threshold comparison support. | Local operators need a repeatable advisory signal for regressions without turning variable mounted timings into a default CI gate. |
| Register a threshold fixture and update docs. | The budgets should be visible as project docs and intentionally non-canonical truth. |
| Add focused tests around script behavior. | Keep the change bounded and reproducible without running expensive mounted/ext4 measurements in unit tests. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New runtime cache implementation. | This task only adds a regression fixture around existing behavior. |
| Stable CI SLA. | Mounted filesystem performance is environment-dependent; thresholds are advisory unless explicitly gated. |
| Re-running the full mounted/ext4 benchmark. | T-0373 already recorded the baseline; this task changes harness behavior. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | task create |
| 2026-06-19 | In Progress | Started performance regression fixture work. | T-0380 |
| 2026-06-19 | Done | Added advisory context-routing performance regression thresholds, Session Start workloads, and validation coverage. | ev:T-0380:4bf9cfb9548c411b9a94cc20 |
<!-- hadara:managed:end task-status-history -->
