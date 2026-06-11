# T-0296 Phase 7.6 0.3.0 Release Hardening and Installed-Package Recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0296 |
| Title | Phase 7.6 0.3.0 Release Hardening and Installed-Package Recycle |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Complete Phase 7.6 release hardening without publish mutation. | Validate Phase 7.0-7.5 inputs, update README/release notes for implemented 0.3.0 behavior, run package/clean-checkout/installed recycle smokes, and prove release dry-run/publish dry-run readiness without external mutation. |

## Scope

| In Scope | Reason |
|---|---|
| Phase 7.0-7.5 completion audit | Release hardening must stop if required prior phases are incomplete. |
| README Phase 7.6 restructure | 0.3.0 docs must emphasize primary lifecycle, docs governance, managed Markdown safety, and boundaries without dumping the full command inventory up front. |
| Release notes 0.3.0 content | Release notes must describe implemented Phase 7 behavior and boundaries only. |
| Full validation and package/recycle smokes | Acceptance requires build/test/Docker/package/clean-checkout/installed CLI/fresh-init/release dry-runs. |
| Evidence and close workflow | Work must be evidenced and closed through HADARA task lifecycle. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Publish mutation | Requires explicit operator approval and is not implied by this task. |
| GitHub Release, Docker image, PyPI publish | Optional/separate unless explicitly requested. |
| New agent runtime, Rack/enterprise, Dashboard/TUI redesign | Explicit Phase 7.6 non-goals. |
| Historical document deletion/archive execution | Phase 7.5 cleanup stays dry-run/default metadata-only. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-11 | Draft | Phase 7.6 scope prepared from release-hardening spec. | `TASK.md`, `PLAN.md` |
| 2026-06-11 | In Progress | README/version/release docs, Docker baseline, package/clean-checkout smokes, installed recycle, release artifact, release dry-run, and publish dry-run completed. | `EVIDENCE.md` |
<!-- hadara:managed:end task-status-history -->
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
