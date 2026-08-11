# T-0774 Run public RC4 close-execute and idempotent lifecycle acceptance.

## Identity

| Field | Value |
|---|---|
| ID | T-0774 |
| Title | Run public RC4 close-execute and idempotent lifecycle acceptance. |
| Status | Done |
| Created | 2026-08-11T20:13 |
| Updated | 2026-08-11T20:17 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prove the published hadara@next RC4 package completes a real task close transaction and idempotent retry in a disposable consumer. | This is the stable-candidate acceptance gate; it performs no publication or source mutation. |

## Scope

| Boundary | Items |
|---|---|
| In | Public hadara@next 0.5.0-rc.4 install, Init v1 standard project, substantive validation/evidence, reviewed close execute, audit, retry, fresh status, and doctor. |
| Out | npm/GitHub/Docker mutation, source changes, release artifact generation, stable promotion, and persistent consumer state. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the public RC4 lifecycle acceptance contract. | Done |
| 2 | Execute the lifecycle against a disposable consumer. | Done |
| 3 | Record evidence and complete proof-last close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Public hadara@next installs as 0.5.0-rc.4 and Init v1 applies successfully. | Met | ev:T-0774:1ac06adbcd91434bbc63d5bc | npm registry; installed doctor |
| AC-2 | Substantive validation/evidence is recorded in the installed consumer. | Met | ev:T-0774:f09a4cef1acf4c2685b0ac8c | validation run |
| AC-3 | Reviewed close execute reaches closed-valid. | Met | ev:T-0774:f09a4cef1acf4c2685b0ac8c | task close |
| AC-4 | Same-close retry is closed-valid with zero writes and no new close proof. | Met | ev:T-0774:f09a4cef1acf4c2685b0ac8c | task close retry |
| AC-5 | Fresh task status is idle with zero stale continuation recommendations and doctor passes. | Met | ev:T-0774:f09a4cef1acf4c2685b0ac8c | task status; doctor |
| AC-6 | No publication, source, Docker, or persistent consumer mutation occurs. | Met | ev:T-0774:1ac06adbcd91434bbc63d5bc | mutation boundary |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Public registry install and Init v1 apply | Yes | Passed | Installed package reported 0.5.0-rc.4; Init v1 plan/apply passed. | ev:T-0774:1ac06adbcd91434bbc63d5bc |
| Substantive validation and evidence | Yes | Passed | Installed consumer validation command passed and evidence was appended. | ev:T-0774:f09a4cef1acf4c2685b0ac8c |
| Reviewed close execute | Yes | Passed | Close execute returned closed-valid and terminal=true. | ev:T-0774:f09a4cef1acf4c2685b0ac8c |
| Idempotent close retry | Yes | Passed | Retry returned closed-valid with executedWrites=0 and closeProofAppended=false. | ev:T-0774:f09a4cef1acf4c2685b0ac8c |
| Fresh status and doctor | Yes | Passed | Fresh status was idle with zero recommendations; doctor ok=true. | ev:T-0774:f09a4cef1acf4c2685b0ac8c |
| Evidence lint and task close | Yes | Passed | Evidence lint passed; proof-last close is the terminal capsule step. | ev:T-0774:1ac06adbcd91434bbc63d5bc; docs/TASK_WORKFLOW_COMMANDS.md |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Public hadara@next 0.5.0-rc.4 | reference | active | Published package under test; registry and installed doctor reported RC4. |
| docs/RELEASE_READINESS.md | constraint | active | Stable gate requires real public close-execute acceptance before promotion. |
| T-0773 current-state reconciliation | constraint | active | RC4 is published; this capsule supplies the remaining lifecycle acceptance. |

## Changes

| Area | Summary |
|---|---|
| Public consumer lifecycle | Installed RC4, applied Init v1, created T-0001, recorded substantive validation, closed, retried, audited, and checked fresh status. |
| Mutation boundary | All writes stayed in the disposable consumer; no release/source mutation occurred. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Stable promotion decision remains operator/reviewer work after this acceptance. | Deferred | docs/RELEASE_READINESS.md |

## Close Summary

Published RC4 completed the stable-candidate public lifecycle acceptance: reviewed close reached closed-valid, same-close retry was zero-write, fresh status was idle with no stale continuation, and doctor passed.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Started public RC4 close-execute acceptance in a disposable consumer. |
| 2026-08-11 | Done | Public lifecycle, close proof, idempotent retry, fresh status, and doctor passed. |
