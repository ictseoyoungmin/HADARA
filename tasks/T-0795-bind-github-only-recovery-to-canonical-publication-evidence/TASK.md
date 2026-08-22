# T-0795 Bind GitHub-only recovery to canonical publication evidence

## Identity

| Field | Value |
|---|---|
| ID | T-0795 |
| Title | Bind GitHub-only recovery to canonical publication evidence |
| Status | Done |
| Created | 2026-08-22T21:13 |
| Updated | 2026-08-22T21:15 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make GitHub-only recovery trust canonical byte-bound npm publication evidence and verify the release tag target before GitHub mutation. | This capsule reconstructs the lifecycle record for commit `bc76b7db` without performing an external npm/GitHub release. |

## Scope

| Boundary | Items |
|---|---|
| In | Canonical npm evidence lookup and byte binding, convenience-report tamper detection, retained asset verification, GitHub-publication idempotency guard, and source-commit/tag alignment. |
| Out | New npm/GitHub publication, fresh RC6 artifact generation, release-note changes, post-publish recycle, and unrelated helper behavior. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reconstruct the capsule contract from commit `bc76b7db` and the release recovery handoff. | Done |
| 2 | Record the canonical evidence verifier, tag-target guard, and regression coverage delivered by `bc76b7db`. | Done |
| 3 | Run focused recovery validation and record durable evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `--github-only` resolves exactly one public passed npm publication evidence record, verifies its bound report bytes and retained assets, and rejects a tampered convenience report. | Met | `ev:T-0795:3b25716af4104ee7b3dcbdcc` | `scripts/release/verify-recovery-evidence.mjs`; `scripts/release/manual-publish-rc.sh` |
| AC-2 | Recovery refuses an existing GitHub evidence record and refuses local/remote release tags that do not resolve to the retained artifact source commit. | Met | `ev:T-0795:3b25716af4104ee7b3dcbdcc` | `scripts/release/manual-publish-rc.sh`; `tests/unit/manual-publish-script.test.ts` |
| AC-3 | Focused regression validation is recorded for the commit-backed behavior, with no external release mutation performed by this capsule. | Met | `ev:T-0795:3b25716af4104ee7b3dcbdcc`; `ev:T-0795:1fb9c2cc375446b9b5a487e7` | `tests/unit/manual-publish-script.test.ts`; task evidence |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Canonical recovery regression | Yes | Passed | exit 0 in 14737ms | ev:T-0795:3b25716af4104ee7b3dcbdcc |
| Source hygiene | Yes | Passed | `manual-publish-rc.sh` passes `bash -n` and `git diff --check` passes. | ev:T-0795:1fb9c2cc375446b9b5a487e7 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `bc76b7db` | implementation-source | active | Existing commit being reconstructed into a Task Capsule. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Canonical GitHub-only recovery flow and release-tag verification. |
| `scripts/release/verify-recovery-evidence.mjs` | implementation-source | active | Canonical evidence lookup, byte binding, lineage, and retained asset verifier. |
| `tests/unit/manual-publish-script.test.ts` | reference | active | Focused fixture coverage for the recovery contract. |
| `docs/RELEASE_READINESS.md`; `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Release recovery ordering and evidence/lifecycle rules. |

## Changes

| Area | Summary |
|---|---|
| Canonical recovery evidence | Added `verify-recovery-evidence.mjs` and routed `--github-only` through a unique public passed npm evidence record with exact artifact byte bindings. |
| Publication safety | Added GitHub evidence absence checks, retained asset/report consistency checks, and source-commit-aligned local/remote release-tag verification. |
| Regression coverage | Extended the manual publish fixture for tampered convenience reports, retained-byte mismatches, wrong tag targets, and canonical recovery success without republishing npm. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Prepare a fresh RC6 artifact from current source in a separate release capsule; do not reuse retained bytes. | Open | T-0794 HANDOFF; `docs/RELEASE_READINESS.md` |
| RF-2 | Risk | This capsule is a retroactive lifecycle record for an already landed commit. | Mitigated | Commit `bc76b7db`; this capsule adds the missing task contract, evidence, and close proof. |

## Close Summary

Reconstructed the missing T-0795 Task Capsule for commit `bc76b7db`. The capsule records canonical npm evidence binding, retained-byte and lineage checks, GitHub recovery idempotency, release-tag target verification, and focused regression evidence. No external release mutation or fresh RC6 generation was performed.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-22 | Draft | Initial task scaffold. |
| 2026-08-22 | Draft | Reconstructed the task contract from `bc76b7db` and documented its canonical recovery verifier and regression scope. |
| 2026-08-22 | Done | Focused recovery and source-hygiene validation passed; capsule is ready for proof-last close. |
