# T-0423 Package Recycle Helper Residual Fix

## Metadata

| Field | Value |
|---|---|
| ID | T-0423 |
| Title | Package Recycle Helper Residual Fix |
| Status | Done |
| Created | 2026-06-27 |
| Updated | 2026-06-27 |

## Goal

| Goal | Notes |
|---|---|
| Make `hadara package recycle --execute` default to a fast installed-agent UX smoke and stop installed helper subprocesses from writing smoke tasks into the source workspace. | Treat the T-0422 `context graph --json` helper failure as a stable-blocker candidate; fix the helper before stable 0.3.4 readiness. |

## Scope

| In Scope | Reason |
|---|---|
| Remove broad `context graph --json` from the default package recycle profile. | Default recycle should prove installed agent UX without 73-180s broad graph failures. |
| Add an explicit opt-in for broad context graph recycle coverage. | Operators can still run full graph diagnostics when intentionally requested. |
| Ensure installed subprocesses resolve project root from the disposable project, not the source workspace. | Prevent stray T-0423/T-0424 style smoke capsules in HADARA-dev. |
| Add focused tests for default fast path and optional graph path. | Prevent regression before stable readiness. |
| Refresh built `dist` after CLI source changes. | Workspace CLI must match source before installed helper smokes are treated as current. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Stable `0.3.4` readiness, version bump, publish, or stable installed-package recycle. | Belongs to later T-0424/T-0425/T-0426-style release capsules after this residual is fixed. |
| Changing context graph implementation. | The stable-blocking issue is helper default profile and workspace leakage, not graph internals. |
| Publishing a replacement RC. | This capsule fixes source/helper behavior only. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-27 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-27 | In Progress | Started package recycle helper residual fix after T-0422 review. | T-0423 PLAN |
| 2026-06-27 | Done | Package recycle helper default profile narrowed, graph made opt-in, source workspace leakage fixed, and installed `hadara@next` recycle passed. | T-0423 evidence |
<!-- hadara:managed:end task-status-history -->
