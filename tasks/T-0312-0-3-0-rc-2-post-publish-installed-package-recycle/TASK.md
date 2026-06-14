# T-0312 0.3.0-rc.2 Post-Publish Installed-Package Recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0312 |
| Title | 0.3.0-rc.2 Post-Publish Installed-Package Recycle |
| Status | Done |
| Created | 2026-06-14 |
| Updated | 2026-06-14 |

## Goal

| Goal | Notes |
|---|---|
| Verify the published `hadara@0.3.0-rc.2` package from a consumer perspective and clean up obvious post-publish docs drift. | Confirm registry metadata, npx/temp-prefix execution, fresh init docs surfaces, protocol migration execute, and task finish row preservation after npm publish. |

## Scope

| In Scope | Reason |
|---|---|
| Published-package recycle for `hadara@0.3.0-rc.2`. | Post-publish validation must use the registry package, not the workspace build. |
| README and release readiness drift discovered during review. | Package-facing docs should agree with the published rc.2 state. |
| Findings for remaining non-blocking follow-up work. | Registry artifact dogfooding and docs patch atomic hardening need explicit carry-forward notes. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New npm publish, version bump, or GitHub Release draft. | T-0310 already handled rc.2 publish; this capsule validates the published package. |
| Broad `docs/PROJECT_STATE.md` restructuring. | Useful cleanup, but not required for post-publish package confidence. |
| Implementing `docs patch --execute` atomic write hardening. | Important stable-0.3 follow-up, but separate from validating the published rc.2 package. |
| Running broad self-migration writes on HADARA-dev. | The dry-run plans multiple project-wide writes; this capsule records the registry artifact gap instead of widening execution scope. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-14 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
