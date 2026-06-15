# T-0317 Stable 0.3.0 Post-Publish Installed-Package Recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0317 |
| Title | Stable 0.3.0 Post-Publish Installed-Package Recycle |
| Status | Done |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Verify stable `hadara@0.3.0` as a published consumer package. | Confirm registry visibility, npx/temp-prefix execution, fresh init/docs surfaces, protocol migration, task finish preservation, and a mini ready/close/audit lifecycle from installed package paths. |

## Scope

| In Scope | Reason |
|---|---|
| Published package registry and execution checks. | Stable publish is complete, but consumer recycle is still pending. |
| Fresh init checks for `basic`, `standard`, and `governed` profiles. | Stable users should receive coherent first-run project docs across supported profiles. |
| Installed-package docs and lifecycle command smokes. | Package-facing command surfaces should work outside the source checkout. |
| Protocol migration dry-run/execute on a disposable legacy fixture. | Existing projects are the critical adoption path for 0.3.0. |
| Task finish preservation and ready/close/audit mini lifecycle smokes. | Consumer lifecycle behavior must match the source-readiness baseline. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish, dist-tag mutation, GitHub Release creation, Docker image publish, or token loading. | T-0317 validates the already-published package; it must not mutate registries or release channels. |
| Source-code changes or local source full validation. | T-0315 remains the stable source/readiness validation baseline; T-0317 complements it with published package validation. |
| Broad self-migration of HADARA-dev. | Disposable fixtures are enough for installed-package recycle. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-15 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-15 | In Progress | Started stable 0.3.0 consumer recycle from handoff recommendation. | PLAN.md |
| 2026-06-15 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
