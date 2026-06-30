# T-0427 T-04A1 0.4 Breaking Productization Spec Registration

## Metadata

| Field | Value |
|---|---|
| ID | T-0427 |
| Title | T-04A1 0.4 Breaking Productization Spec Registration |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Goal

| Goal | Notes |
|---|---|
| Register the accepted 0.4.0 productization redesign spec package in HADARA-dev reading surfaces. | T-04A1 maps to actual capsule T-0427; keep the registration generic and do not implement new 0.4 runtime behavior here. |

## Scope

| In Scope | Reason |
|---|---|
| Add canonical 0.4 spec documents to `.hadara/docs-registry.json` and refresh `docs/DOC_REGISTRY.md`. | T-04A1 is the registration capsule. |
| Add compact SOP Required Reading rows for the 0.4 entry point and worker plan. | Agents need conditional routing without default-reading every spec file. |
| Record local Docker rebuild learning in `.hadara/context/MEMORY.md`. | The goal asks to capture useful development know-how. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implementing `hadara docs register` or other proposed 0.4 CLI surfaces. | Scheduled for later 0.4 capsules. |
| Changing generated 0.4 scaffold templates or runtime task schema behavior. | Scheduled for T-04A2 and later. |
| Release readiness, publish, package recycle, or stable release work. | Explicitly outside the 24-capsule implementation budget. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-30 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
