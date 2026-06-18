# T-0345 Context Graph Task Extractors

## Metadata

| Field | Value |
|---|---|
| ID | T-0345 |
| Title | Context Graph Task Extractors |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Implement the first source-specific C1 extractors for Task Board and Task Capsule task state. | Builds on T-0344 extractor contract before docs/evidence/command extractors. |

## Scope

| In Scope | Reason |
|---|---|
| Add `extractTaskBoard()` for Task nodes and task-board `StateSource` data from `docs/TASK_BOARD.md`. | Starts source extraction from the canonical task queue. |
| Add `extractTaskCapsules()` for Task nodes and task-capsule `StateSource` data from `tasks/T-*/TASK.md` and `HANDOFF.md`. | Adds task-local metadata/state extraction without deep graph building. |
| Add focused tests for task-board extraction, task-capsule extraction, and missing-source degradation. | Verifies deterministic read-only extraction behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implement docs registry, command registry, evidence, managed section, decision, known problem, release readiness, or handoff-wide extractors. | Later C1 capsules. |
| Build a full graph report or task context report. | Later after enough extractors exist. |
| Add public CLI/read surfaces. | Later graph builder and command registry capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | In Progress | Started Task Board and Task Capsule extractor capsule. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
