# T-0270 Repository Skeleton Cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0270 |
| Title | Repository Skeleton Cleanup |
| Status | Done |
| Created | 2026-06-06 |
| Updated | 2026-06-06 |

## Goal

| Goal | Notes |
|---|---|
| Remove unused root bootstrap launcher files from the repository skeleton. | Keep the npm package, Docker validation, and Hermes/.hadara context surfaces unchanged. |

## Scope

| In Scope | Reason |
|---|---|
| Delete root `START.bat`, `start.sh`, `hadara`, and `hadara.cmd`. | They are early bootstrap/dev convenience launchers and are no longer the documented install or publish path. |
| Record cleanup evidence and update task-local handoff/state docs. | Cleanup should be traceable and bounded before release/publish work resumes. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Removing `.hadara/`, `.hermes.md`, `HERMES.md`, or Hermes example files. | They still document compatibility/context surfaces and need a separate migration decision if removed. |
| Changing package publish behavior, release scripts, or T-0269 evidence. | T-0269 remains a separate approval-gated publish capsule. |
| Removing historical spec references to portable launcher plans. | Those references describe earlier planned packaging surfaces and are not active root-file usage. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-06 | Draft | Initial task scaffold. | `hadara task create "Repository Skeleton Cleanup" --json` |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
