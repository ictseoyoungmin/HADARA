# T-0511 0.4.1 rc0 publish env preparation boundary fix

## Identity

| Field | Value |
|---|---|
| ID | T-0511 |
| Title | 0.4.1 rc0 publish env preparation boundary fix |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Keep publish preparation from running the manual publish helper by default. | `prepare-publish-env.sh` may prepare a clean clone and run non-mutating sanity gates, but `manual-publish-rc.sh --execute` must remain the operator-owned end-to-end validation and publish boundary. |

## Scope

| Boundary | Items |
|---|---|
| In | Change `scripts/release/prepare-publish-env.sh` so helper dry-run is opt-in only; update tests and script guidance. |
| Out | Changing npm publish behavior, release artifact generation, GitHub release commands, or the manual helper execution flow. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm current prepare script automatically invokes the manual helper dry-run when npm auth exists. | Done |
| 2 | Make helper dry-run explicit opt-in and keep publish mutation under `manual-publish-rc.sh --execute`. | Done |
| 3 | Add regression coverage and validate script syntax/build. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `bash scripts/release/prepare-publish-env.sh T-0509` no longer invokes `manual-publish-rc.sh` by default, regardless of npm login state. | Done | `ev:T-0511:38e1c8a3228b49b7b8d50905` | `scripts/release/prepare-publish-env.sh` |
| AC-2 | Helper dry-run remains available only through an explicit opt-in option. | Done | `ev:T-0511:05bc85c32e2a4e52b8b3d09a` | `scripts/release/prepare-publish-env.sh` |
| AC-3 | Regression tests and release-script syntax checks cover the boundary. | Done | `ev:T-0511:77ba1d73ad6840138ffe9056`, `ev:T-0511:38e1c8a3228b49b7b8d50905`, `ev:T-0511:4494d2cd339e4e4bb362165c` | `tests/unit/manual-publish-script.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| prepare script syntax | Yes | Passed | ev:T-0511:77ba1d73ad6840138ffe9056 |
| prepare help text | Yes | Passed | ev:T-0511:05bc85c32e2a4e52b8b3d09a |
| focused release script tests | Yes | Passed | ev:T-0511:38e1c8a3228b49b7b8d50905 |
| build | Yes | Passed | ev:T-0511:4494d2cd339e4e4bb362165c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User report | reference | active | `prepare-publish-env.sh T-0509` did too much by running manual helper dry-run; `manual-publish-rc.sh T-0509 --execute` must keep that role. |
| `scripts/release/manual-publish-rc.sh` | reference | active | Operator-owned end-to-end validation and publish boundary. |

## Changes

| Area | Summary |
|---|---|
| Release helper | `prepare-publish-env.sh` now reports helper dry-run as skipped by default, keeps `--skip-dry-run` as compatibility no-op, and only runs `manual-publish-rc.sh <TASK>` dry-run when `--run-helper-dry-run` is explicit. |
| Tests | Added regression coverage that rejects the old npm-login auto dry-run behavior and verifies the explicit opt-in boundary. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | If prepare keeps doing end-to-end validation, operators may trust the wrong phase and confuse dry-run evidence with publish execution. | Closed | T-0511 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Reproduced prepare/manual helper responsibility overlap and started boundary fix. |
| 2026-07-07 | Done | Default prepare flow now skips manual helper dry-run; validation passed. |
