# T-0339 Stable 0.3.2 Decision

## Metadata

| Field | Value |
|---|---|
| ID | T-0339 |
| Title | Stable 0.3.2 Decision |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Prepare the stable 0.3.2 decision capsule with release readiness cleanup and HADARA dogfooding findings. | Full stable/rc1/defer decision remains the capsule outcome; this slice first removes stale T-0338-active wording and records medium-scale docker-compose dogfooding observations. |

## Scope

| In Scope | Reason |
|---|---|
| Update `docs/RELEASE_READINESS.md` to state that T-0338 installed-package recycle is complete. | User-requested pre-decision cleanup; keeps release decision inputs accurate. |
| Create a temporary HADARA-managed docker-compose backend/frontend project and use HADARA lifecycle surfaces against it. | Dogfooding `0.3.2-rc.0` before the stable decision gives direct stability and UX observations. |
| Add `FINDINGS.md` with structured stability and usage findings from dogfooding. | Requested artifact for the T-0339 capsule. |
| Record T-0339 capsule context, files, risks, tests, and handoff for the cleanup. | Required before implementation and validation under HADARA protocol. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Publish stable `hadara@0.3.2`. | Release mutation requires a separate approval-gated publish capsule if chosen. |
| Prepare `0.3.2-rc.1`. | Bounded fixes and rc1 readiness require a separate follow-up capsule if chosen. |
| Run package or registry mutation commands. | This cleanup only corrects tracked release readiness wording. |
| Commit or retain the temporary dogfood project in this repository. | Dogfooding project is disposable and findings are recorded in T-0339. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17T11:54:34Z | In Progress | T-0339 capsule opened for stable decision prep and release readiness wording cleanup after T-0338 completion. | T-0338 handoff; user request |
| 2026-06-17 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
