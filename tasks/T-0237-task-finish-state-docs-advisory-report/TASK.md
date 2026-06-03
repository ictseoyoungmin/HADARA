# T-0237 Task Finish State Docs Advisory Report

## Metadata

| Field | Value |
|---|---|
| ID | T-0237 |
| Title | Task Finish State Docs Advisory Report |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Make `task finish` advisories actionable without expanding its write boundary. | Add structured state-doc freshness diagnostics so operators can see which broad docs need manual updates after bounded finish sync. |

## Scope

| In Scope | Reason |
|---|---|
| Add structured `stateDocs` diagnostics to `hadara.task.finish.v1`. | Keep the existing advisory-only boundary but make stale/missing docs machine-readable. |
| Check `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md`. | These are the three docs already reported as advisory-only by finish. |
| Preserve dry-run/execute write boundary. | `task finish --execute` must still write only `TASK.md` and `docs/TASK_BOARD.md`. |
| Update focused tests and docs. | Add regression coverage for missing/stale/current state docs. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic broad prose rewrites. | This capsule only reports state-doc freshness; write automation must remain future dry-run-first work. |
| Close/audit evidence semantics. | Close fixed-point behavior is outside this small finish-report slice. |
| Dashboard/TUI UI work. | UI work remains paused unless an operator blocker appears. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-03 | In Progress | Scope fixed to structured task finish state-doc advisories. | Task capsule update |
| 2026-06-03 | Done | Structured state-doc advisories, validation, evidence, and handoff updates are complete. | T-0237 evidence |
