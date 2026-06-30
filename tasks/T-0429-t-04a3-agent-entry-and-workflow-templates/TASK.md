# T-0429 T-04A3 Agent Entry and Workflow Templates

## Metadata

| Field | Value |
|---|---|
| ID | T-0429 |
| Title | T-04A3 Agent Entry and Workflow Templates |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Goal

| Goal | Notes |
|---|---|
| Generate 0.4 agent entry, context, and workflow templates with non-overlapping responsibilities. | `AGENTS.md` owns Required Reading and safety invariants; `.hadara/context/HADARA_CONTEXT.md` routes reads; `docs/HADARA_WORKFLOW.md` owns lifecycle/context/evidence/document timing guidance. |

## Scope

| In Scope | Reason |
|---|---|
| Update generated `AGENTS.md` to stop acting as a lifecycle command cookbook. | T-04A3 owns agent entry template responsibilities. |
| Update generated `.hadara/context/HADARA_CONTEXT.md` to be a routing anchor only. | Prevent duplicate Required Reading/workflow authority. |
| Update generated `docs/HADARA_WORKFLOW.md` to include required 0.4 workflow sections and guardrails. | The workflow doc owns command usage, document timing, authoring model, and failure modes. |
| Add focused tests that reject duplicate command/Required Reading responsibilities across the three files. | Keep the scaffold productized and stable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Docs registry command redesign. | T-04A4 owns `docs register` and compatibility boundaries. |
| Task Capsule schema changes. | T-04A6 and later own generated capsule files. |
| Release, package, publish, or installer work. | Release work is outside the 24-capsule implementation budget. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-30 | In Progress | T-04A3 implementation started from accepted agent entry/workflow specs. | `docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md` |
| 2026-06-30 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
