# T-0517 0.4.1 stable publish helper package smoke timeout

## Identity

| Field | Value |
|---|---|
| ID | T-0517 |
| Title | 0.4.1 stable publish helper package smoke timeout |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prevent stable publish helper package-smoke timeout at the default 120s limit. | `manual-publish-rc.sh` should pass an explicit 300s timeout to `hadara smoke package --execute`, with an environment override for slower environments. |

## Scope

| Boundary | Items |
|---|---|
| In | `scripts/release/manual-publish-rc.sh` package-smoke timeout default and operator-facing help output. |
| Out | Changing package-smoke test coverage, reducing release smoke checks, npm publish, GitHub Release publication, or editing T-0516 operator evidence. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add a 300s default timeout for the release helper package-smoke step. | Done |
| 2 | Document the `PACKAGE_SMOKE_TIMEOUT` override in helper usage/output. | Done |
| 3 | Validate shell syntax/help and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `manual-publish-rc.sh` invokes `hadara smoke package --execute` with `--timeout "${PACKAGE_SMOKE_TIMEOUT}"`. | Done | ev:T-0517:37f7154855e14156aed06c4c | `scripts/release/manual-publish-rc.sh` |
| AC-2 | Default `PACKAGE_SMOKE_TIMEOUT` is 300 seconds and is visible to operators. | Done | ev:T-0517:ea5ed0e4f19c447f9ae3e0c2 | `scripts/release/manual-publish-rc.sh --help` |
| AC-3 | Validation evidence is recorded without touching T-0516 operator evidence. | Done | ev:T-0517:9f92cecc551b4ca3a46fdc0d | T-0517 evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `bash -n scripts/release/manual-publish-rc.sh` | Yes | Passed | ev:T-0517:9f92cecc551b4ca3a46fdc0d |
| `bash scripts/release/manual-publish-rc.sh --help` | Yes | Passed | ev:T-0517:ea5ed0e4f19c447f9ae3e0c2 |
| `rg PACKAGE_SMOKE_TIMEOUT and --timeout in scripts/release/manual-publish-rc.sh` | Yes | Passed | ev:T-0517:37f7154855e14156aed06c4c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0516-0-4-1-stable-release-readiness-and-publish-preparation/HANDOFF.md` | reference | active | Stable publish helper owns clean-clone release evidence before npm publish. |
| `scripts/release/manual-publish-rc.sh` | reference | active | Approval-gated manual publish helper. |

## Changes

| Area | Summary |
|---|---|
| Release Helper | Added `PACKAGE_SMOKE_TIMEOUT` default 300 and pass-through to `smoke package --execute`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Re-run stable publish prep from a fresh clone after this helper fix is committed. | Open | `scripts/release/prepare-publish-env.sh T-0516` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Package-smoke helper timeout raised to 300s; validation pending. |
| 2026-07-08 | Done | Helper timeout change validated; publish retry should start from a fresh clone. |
