# T-0305 Task Board Row Preservation in task finish

## Metadata

| Field | Value |
|---|---|
| ID | T-0305 |
| Title | Task Board Row Preservation in task finish |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Preserve human-authored Task Board cells during `task finish`. | `task finish --execute` updates command-owned row cells without erasing `Notes` or extra cells. |

## Scope

| In Scope | Reason |
|---|---|
| `src/task/task-finish.ts` Task Board row update behavior. | Core bug fix for T-0305. |
| Focused `task finish` and workflow-doc regressions. | Prove preservation and generated docs policy. |
| Workflow command documentation and generated init workflow docs. | Make ownership boundaries discoverable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Task Board schema redesign or historical migration. | T-0305 is a bounded preservation fix. |
| Broad Markdown parser rewrite. | Escaped/inline-code pipe support is local to the `task finish` row path. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
