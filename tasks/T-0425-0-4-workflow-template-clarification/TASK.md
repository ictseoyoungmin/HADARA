# T-0425 0.4 Workflow Template Clarification

## Metadata

| Field | Value |
|---|---|
| ID | T-0425 |
| Title | 0.4 Workflow Template Clarification |
| Status | Done |
| Created | 2026-06-29 |
| Updated | 2026-06-29 |

## Goal

| Goal | Notes |
|---|---|
| Refine the 0.4 AGENTS/HADARA_WORKFLOW template design after operator review. | Preserve compact Required Reading and safety guidance in `AGENTS.md`, while moving lifecycle command order and document-writing timing into `HADARA_WORKFLOW.md`. |

## Scope

| In Scope | Reason |
|---|---|
| Restore a compact Required Reading table in the 0.4 `AGENTS.md` template. | `AGENTS.md` is the entry contract agents read first; hiding the table only in workflow is too indirect. |
| Expand `HADARA_WORKFLOW.md` with project start, task lifecycle order, Task Capsule document timing, and useful CLI surfaces by work phase. | Agents need practical command order and writing timing guidance in one workflow document. |
| Remove the standalone Release Boundary section from the 0.4 workflow template and spec wording. | The operator judged that section unnecessary in `HADARA_WORKFLOW.md`. |
| Align nearby 0.4 spec/test-plan wording with the clarified split. | Keep implementation capsules from inheriting contradictory instructions. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implementing 0.4 CLI behavior or changing generated init output. | This is a spec/template clarification only. |
| Registering 0.4 specs in Required Reading or docs registry. | T-04A1 remains the registration capsule after operator acceptance. |
| Changing release, publish, package, or installer command behavior. | The request is about workflow documentation placement. |
| Editing the already closed T-0424 capsule. | T-0425 owns the follow-up changes. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-29 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-29 | In Progress | Started 0.4 workflow template clarification from operator review. | T-0425 plan |
| 2026-06-29 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
