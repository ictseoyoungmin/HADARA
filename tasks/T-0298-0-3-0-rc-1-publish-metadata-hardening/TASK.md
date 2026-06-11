# T-0298 0.3.0-rc.1 publish metadata hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0298 |
| Title | 0.3.0-rc.1 publish metadata hardening |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.3.0-rc.1` and harden the manual publish flow so npm tarball metadata includes the intended discovery fields before any operator publish. | Fix the T-0297 rc.0 metadata gap where the global `hadara` command produced a minimal package.json in the published tarball. |

## Scope

| In Scope | Reason |
|---|---|
| Bump package/readme/readiness references from `0.3.0-rc.0` to `0.3.0-rc.1`. | rc.0 is already immutable on npm and metadata cannot be corrected in-place. |
| Prefer the current repository built CLI in `scripts/release/manual-publish-rc.sh`. | Prevent stale globally installed `hadara` from generating release artifacts. |
| Validate generated tarball `package/package.json` metadata before publish dry-run or execute. | Block recurrence of missing description/keywords/repository metadata. |
| Add focused regression tests for the manual publish script. | Make the helper behavior reviewable without publishing. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Real npm publish, GitHub Release creation, tag push, Docker image build, or registry mutation. | Publish remains operator-only after local evidence is green. |
| Changing npm registry metadata for already published `0.3.0-rc.0`. | npm package versions are immutable. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | Created by `task create`. |
| 2026-06-11 | In Progress | Started rc.1 publish metadata hardening. | Required docs reviewed; implementation started. |
<!-- hadara:managed:end task-status-history -->
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
