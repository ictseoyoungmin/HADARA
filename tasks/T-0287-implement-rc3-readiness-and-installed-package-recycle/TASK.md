# T-0287 Implement rc3 readiness and installed-package recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0287 |
| Title | Implement rc3 readiness and installed-package recycle |
| Status | In Progress |
| Created | 2026-06-09 |
| Updated | 2026-06-09 |

## Goal

| Goal | Notes |
|---|---|
| Prepare rc3 source publish candidate and recycle smoke evidence | Update source metadata/docs to `0.2.0-rc.3`, validate package/install/readiness flows, and keep publish mutation out of scope. |

## Scope

| In Scope | Reason |
|---|---|
| rc3 package metadata and release docs | Source checkout must identify `0.2.0-rc.3` as the current publish candidate while preserving `0.2.0-rc.2` as the latest npm-published RC. |
| Package and clean-checkout smoke | Verify local package contents, isolated install, and disposable clean-checkout validation. |
| Fresh init/recycle smoke | Verify basic, standard, governed init and standard-project evidence/proof/CI gate surfaces. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish or registry mutation | Requires a later operator-approved publish capsule. |
| GitHub Release or Docker image publishing | Deferred release targets. |
| Token loading | Release readiness must not read or print token values. |

## Status

In Progress. A checkpoint commit is required before release artifact generation because the artifact builder intentionally refuses dirty worktrees.

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-09 | Draft | Initial task scaffold. | task create |
| 2026-06-09 | In Progress | rc3 metadata/docs and recycle smoke validation are underway; release artifact refresh is blocked until a clean checkpoint commit exists. | T-0287 evidence |
