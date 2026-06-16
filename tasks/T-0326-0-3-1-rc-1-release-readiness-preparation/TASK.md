# T-0326 0.3.1-rc.1 Release Readiness Preparation

## Metadata

| Field | Value |
|---|---|
| ID | T-0326 |
| Title | 0.3.1-rc.1 Release Readiness Preparation |
| Status | Done |
| Created | 2026-06-16 |
| Updated | 2026-06-16 |

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.3.1-rc.1` release readiness without registry mutation. | Bump source/package metadata, refresh release-facing docs and evidence, and leave the approval-gated publish path ready for T-0327. |

## Scope

| In Scope | Reason |
|---|---|
| Bump package metadata from `0.3.0` to `0.3.1-rc.1`. | The Phase 8 status governance line needs a release-candidate source package. |
| Align package lock and generated `dist` metadata. | Release artifact/package smoke must reflect the same package version. |
| Update README release status with release-note links. | npm package page users should see current stable, rc candidate, and release-note routing without the overlong historical table. |
| Add `docs/RELEASE_NOTES.md` entry for `0.3.1-rc.1`. | Operators and package users need a compact summary of Phase 8 behavior and boundaries. |
| Update `docs/RELEASE_READINESS.md` and release helper guidance. | T-0327 should be runnable by an authenticated operator without stale T-0316 examples. |
| Refresh release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and full Docker validation evidence. | These are the readiness gates requested for this capsule. |
| Update shared state docs and Task Capsule evidence/handoff. | HADARA state must remain coherent before close. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Actual `npm publish`, GitHub Release creation, Docker image build/push, PyPI/TestPyPI publish, installer execution, MCP release/package execution, or token loading. | These remain explicit operator-approved mutation paths; npm publish belongs to T-0327. |
| Post-publish installed-package recycle. | Consumer verification belongs to T-0328 after `0.3.1-rc.1` is visible on npm. |
| Broad historical documentation cleanup outside release status wording. | This capsule only changes release-facing current-state docs required for rc1 readiness. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-16 | Draft | Initial task scaffold. | `node dist/cli/main.js task create "0.3.1-rc.1 Release Readiness Preparation" --json` |
| 2026-06-16 | In Progress | Release-readiness scope and validation plan defined. | T-0326 capsule docs |
| 2026-06-16 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
