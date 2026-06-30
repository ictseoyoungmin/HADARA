# T-0428 T-04A2 0.4 Init Scaffold Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0428 |
| Title | T-04A2 0.4 Init Scaffold Model |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Goal

| Goal | Notes |
|---|---|
| Implement the 0.4 `hadara init` scaffold model. | Generated projects should use the accepted basic/standard/governed file sets, scaffold metadata, docs registry, and slot registry without legacy SOP/task-workflow defaults. |

## Scope

| In Scope | Reason |
|---|---|
| Update default init file generation for basic, standard, and governed profiles. | T-04A2 owns the scaffold file set. |
| Generate `.hadara/scaffold.json` and `.hadara/slot-registry.json`. | 0.4 metadata is part of the accepted scaffold model. |
| Update init doctor core checks for 0.4 scaffold files. | Fresh 0.4 projects should validate against the new default surface. |
| Update focused init tests. | The generated file set and doctor expectations change. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Detailed AGENTS/HADARA_WORKFLOW/HADARA_CONTEXT prose polish. | T-04A3 owns agent entry and workflow template content. |
| Docs registration command redesign. | T-04A4 owns register-doc workflow changes. |
| Release, publish, package, or installer work. | Release work is excluded from the 0.4 implementation budget. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-30 | In Progress | T-04A2 implementation started from accepted 0.4 scaffold specs. | `docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md` |
| 2026-06-30 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
