# T-0328 0.3.1-rc.1 Post-Publish Installed-Package Recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0328 |
| Title | 0.3.1-rc.1 Post-Publish Installed-Package Recycle |
| Status | Draft |
| Created | 2026-06-16 |
| Updated | 2026-06-16 |

## Goal

| Goal | Notes |
|---|---|
| Validate the published `hadara@0.3.1-rc.1` package from consumer install paths after T-0327 publish. | Prove registry visibility, installed CLI behavior, fresh init/docs surfaces, migration, task finish preservation, and mini lifecycle behavior from the published package. |

## Scope

| In Scope | Reason |
|---|---|
| Verify npm registry metadata and exact version. | Confirm package visibility after publish. |
| Run npx and temp-prefix installed-bin smokes. | Validate consumer execution paths while treating npx cache/DNS ambiguity honestly. |
| Run fresh init basic/standard/governed docs/list/doctor/required-reading/explain smokes. | Confirm generated project surfaces from the published package. |
| Run protocol migrate dry-run/execute on disposable legacy fixture. | Confirm 0.3 migration path still preserves evidence. |
| Run task finish preservation and ready/close/audit-close mini lifecycle smokes. | Confirm lifecycle behavior from the installed package. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish. | Completed in T-0327 before this capsule starts. |
| Source/package version bump or release artifact preparation. | Completed in T-0326. |
| Docker image, PyPI/TestPyPI publish, installer execution, MCP release/package execution, or token persistence. | Out of scope for consumer recycle. |

## Status

Draft

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-16 | Draft | Recycle capsule pre-created for handoff after T-0327 publishes `0.3.1-rc.1`. | T-0326 |
<!-- hadara:managed:end task-status-history -->
