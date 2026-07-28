# T-0730 Docker Sync Dist Guard Path Fix

## Identity

| Field | Value |
|---|---|
| ID | T-0730 |
| Title | Docker Sync Dist Guard Path Fix |
| Status | Done |
| Created | 2026-07-28T21:16 |
| Updated | 2026-07-28T21:25 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix the false-positive dist overwrite guard in `npm run dev:docker-sync-build`. | The guard must compare the workspace `dist/cli/main.js` from the same container-visible path namespace before and after the Docker build. |

## Scope

| Boundary | Items |
|---|---|
| In | `scripts/dev-docker-sync-build.sh` before/after dist hash guard path handling and focused validation by running the reported command. |
| Out | Release artifact flow redesign, Docker image changes, package dependency changes, and unrelated close transaction work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `npm run dev:docker-sync-build` no longer fails with `workspace dist/cli/main.js changed after this run started` when no concurrent host dist edit occurs. | Done | `ev:T-0730:0e43106a7bc8446da2150759`; user should rerun in terminal because Codex Docker execution hung at `npm ci`. | User report |
| AC-2 | The overwrite guard still compares before/after `dist/cli/main.js` state before replacing workspace `dist`. | Done | `ev:T-0730:0e43106a7bc8446da2150759` | `scripts/dev-docker-sync-build.sh` |
| AC-3 | CI archive-boundary failure is fixed by committing the current rc2 specs line. | Done | `ev:T-0730:e466965e93d04a6b95061cf5` | User CI report |
| AC-4 | Validation evidence is recorded. | Done | `ev:T-0730:a5e453b0c85b4d00861bc38e`; `ev:T-0730:05c5e686f58c48d0882f4b19` | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Shell syntax | Yes | Passed | `bash -n scripts/dev-docker-sync-build.sh`. | `ev:T-0730:0e43106a7bc8446da2150759` |
| Archive boundary regression | Yes | Passed | `npm test -- --run tests/unit/archive-boundary.test.ts`; 3 tests passed. | `ev:T-0730:e466965e93d04a6b95061cf5` |
| Full check | Yes | Passed | `npm run check`; public 136 passed / 1 skipped, 1080 tests passed / 8 skipped; HADARA-dev 16 passed, 134 passed / 1 skipped. | `ev:T-0730:a5e453b0c85b4d00861bc38e` |
| Docker sync build | No | Blocked | Codex tool execution hung in container `npm ci`; spawned processes were cleaned up. | `ev:T-0730:712ad3468f5f48919f87826f`; resolved by `ev:T-0730:05c5e686f58c48d0882f4b19` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User terminal output | reference | active | Repeated false positive after successful container `npm ci` and build. |
| User CI output | reference | active | `archive-boundary.test.ts` saw no `docs/specs/0.5.0-rc2` entry. |
| scripts/dev-docker-sync-build.sh | implementation-source | active | Host/container workspace path guard. |
| .gitignore | implementation-source | active | Needed rc2 specs unignore exception. |
| docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md | implementation-source | active | Existing current spec file now made trackable. |

## Changes

| Area | Summary |
|---|---|
| Docker sync build script | Moved the dist before-hash capture into the container script so before/after comparison uses the same `$HADARA_WORKSPACE` path namespace. |
| CI archive boundary | Added `.gitignore` exceptions for `docs/specs/0.5.0-rc2/**` so the existing current spec line is visible in CI checkout. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | If true concurrent `dist` edits are observed during sync, keep rerun guidance as-is. | Open | `scripts/dev-docker-sync-build.sh` |

## Close Summary

Fixed the reported false-positive Docker sync dist guard by keeping the before/after hash comparison inside the same container-visible workspace path namespace. Also fixed the reported CI archive-boundary failure by unignoring the current `docs/specs/0.5.0-rc2` spec line.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | Done | Fixed Docker sync dist guard path handling, unignored rc2 specs for CI, and recorded validation. |
