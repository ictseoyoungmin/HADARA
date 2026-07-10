# T-0570 0.4.3 stable release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0570 |
| Title | 0.4.3 stable release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare the stable `hadara@0.4.3` publish path without performing deployment mutation. | Refresh release notes/readiness/helper guidance and provide a GitHub Release note so the operator can publish from a clean ext4 clone. |

## Scope

| Boundary | Items |
|---|---|
| In | 0.4.3 release notes, release readiness status, helper examples, GitHub Release note artifact, npm unpublished check, validation evidence. |
| Out | npm publish, GitHub Release creation/publication, token loading, Docker/PyPI publish, installer execution, post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the stable publish-preparation contract and mutation boundary. | Done |
| 2 | Refresh release notes, readiness docs, helper examples, and GitHub Release note. | Done |
| 3 | Validate the prepared source state and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Release notes and readiness docs describe the 0.4.3 source line through T-0569 and the T-0570 operator publish boundary. | Done | `ev:T-0570:d90a468d16094acca7740b00` | `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| AC-2 | Release helper usage no longer points at stale T-0545/0.4.2 examples for the current stable path. | Done | `ev:T-0570:d90a468d16094acca7740b00` | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |
| AC-3 | A stable GitHub Release note artifact exists for `v0.4.3`. | Done | `ev:T-0570:d90a468d16094acca7740b00` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Exact npm version availability is checked before publish and validation evidence is recorded. | Done | `ev:T-0570:d90a468d16094acca7740b00` | `npm view hadara@0.4.3 version`, validation evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@0.4.3 version` | Yes | Passed | Expected pre-publish E404 observed; `ev:T-0570:d90a468d16094acca7740b00` |
| Focused release helper/docs tests | Yes | Passed | Docker focused tests passed 13 tests; host attempt hit known `spawnSync bash EPERM`; `ev:T-0570:d90a468d16094acca7740b00` |
| TypeScript build / Docker dist refresh | Yes | Passed | Host `npm run build` passed; Docker sync-build passed 153 files / 1058 tests and refreshed dist; `ev:T-0570:d90a468d16094acca7740b00` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0565 source readiness | reference | active | Non-deployment 0.4.3 package/readiness evidence. |
| T-0566 through T-0569 | reference | active | Post-readiness current-state/session/fresh-init dogfood fixes that must be reflected before stable publish. |
| `scripts/release/manual-publish-rc.sh` | constraint | active | Owns npm publish only when the operator passes `--execute`. |

## Changes

| Area | Summary |
|---|---|
| Release docs | Updated 0.4.3 notes/readiness with T-0566 through T-0569 and T-0570 publish boundary. |
| Release helpers | Updated stale 0.4.2/T-0545 examples to the current 0.4.3/T-0570 path and generic GitHub publish command. |
| Release artifact | Added `GITHUB_RELEASE_NOTE.md` for stable `v0.4.3`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After npm/GitHub publication, run installed-package recycle against `hadara@latest` expected `0.4.3`. | Open | Future Task Capsule |
| RF-2 | Risk | Host test launcher can return `spawnSync bash EPERM`; Docker focused tests passed and remain the authoritative validation path for this capsule. | Closed | `ev:T-0570:d90a468d16094acca7740b00` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Started stable 0.4.3 publish-preparation docs and helper cleanup. |
| 2026-07-10 | Done | Prepared 0.4.3 stable release docs/helper notes and validated the operator publish path remains separate. |
