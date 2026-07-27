# T-0713 Task Close Atomicity and Evidence Integrity Hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0713 |
| Title | Task Close Atomicity and Evidence Integrity Hardening |
| Status | Done |
| Created | 2026-07-27T23:55 |
| Updated | 2026-07-27T23:57 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix six independently reproducible integrity gaps found in a code review of the task close/evidence/validation/init/Docker lifecycle, without redesigning any of those subsystems. | Each fix reuses existing machinery (virtual-finished-root preflight, resolution-aware evidence analyzer, existing hash-guard pattern) rather than introducing new abstractions. |

## Scope

| Boundary | Items |
|---|---|
| In | (1) Reorder `task close`/`task finalize` so TASK.md/Task Board Done is written only after a virtual post-finish close plan proves clean, closing the gap on the reviewed `--plan-hash` execute path. (2) Make the close-evidence readiness snapshot reuse the resolution-aware evidence analyzer (`resolves:`/`supersedes:` markers) instead of an independent outcome-only check. (3) Make validation-run auto-resolution identity depend on the command argv, not just the check name. (4) Fail closed when the init nested-project descendant scan is truncated by its inspection cap. (5) Preserve trailing columns on a v1 Task Board row instead of dropping them on every finish rewrite. (6) Recheck the dist-sync before-hash immediately before the destructive replace in both the Docker dev-check tool and the plain sync-build script. |
| Out | A full atomic multi-file transaction/journal redesign for task close (the existing lock + recovery-marker model is kept); redesigning evidence.jsonl append-only semantics; changing the six-column v1 Task Board contract itself. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Verify each of the 6 findings against the actual source (independent code reading, not trusting the review text) and reproduce at least the close-atomicity one live. | Done |
| 2 | Implement each fix as the smallest change that reuses existing machinery, with a regression test per fix. | Done |
| 3 | Run full validation and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task close --execute --plan-hash <hash>` on an incomplete task refuses with zero writes and TASK.md status unchanged, instead of writing Done and failing afterward. | Met | `ev:T-0713:281f60216d504530a9742fe9` | User instruction |
| AC-2 | A failed evidence record resolved by a later `resolves:<id>` record no longer appears in `unresolvedEvidenceClassifications`/`latestFailedOrBlockedEvidenceRefs`. | Met | `ev:T-0713:281f60216d504530a9742fe9` | User instruction |
| AC-3 | `validation run --check X` with a different command than a prior failed `--check X` run does not auto-resolve that prior failure. | Met | `ev:T-0713:281f60216d504530a9742fe9` | User instruction |
| AC-4 | Init nested-project scan reports `INIT_NESTED_PROJECT_SCAN_INCOMPLETE` instead of silently proceeding when its inspection cap is hit with directories still queued. | Met | `ev:T-0713:281f60216d504530a9742fe9` | User instruction |
| AC-5 | An operator-added trailing column on a v1 Task Board row survives a finish-triggered row rewrite. | Met | `ev:T-0713:281f60216d504530a9742fe9` | User instruction |
| AC-6 | Both Docker dist-sync paths refuse the destructive replace when workspace dist changed after the reviewed before-hash was captured. | Met | `ev:T-0713:281f60216d504530a9742fe9` | User instruction |
| AC-7 | Full validation passes after all six fixes. | Met | `ev:T-0713:a95861c52b1d4fd2b72c70ca` | Compatibility |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused regressions per fix | Yes | Passed | exit 0 in 8533ms | ev:T-0713:281f60216d504530a9742fe9 |
| Live CLI repro of the close-atomicity fix | Yes | Passed | Fresh incomplete task: task close --dry-run then --execute --plan-hash <hash> returned mode: execute-refused, zero writes, and TASK.md Status stayed Draft. | ev:T-0713:9579d8d40a884e61a7950ec5 |
| Full repository validation | Yes | Passed | exit 0 in 31481ms | ev:T-0713:a95861c52b1d4fd2b72c70ca |
| Diff hygiene | Yes | Passed | exit 0 in 27ms | ev:T-0713:cdb679aeff3d4525ac2dbcfd |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| External code review of task close/evidence/validation/init/Docker lifecycle | decision | active | Verified independently against source before implementing; all 6 claims held up (one nuanced: close-source hash staleness is by-design detection working as intended, not itself a bug, but it did catch a real drift case on T-0711 this session). |
| `createVirtualFinishedProjectRoot` / `createAutoFinalizePreflightBlockers` (existing) | implementation-source | active | Reused rather than reimplemented for the close-atomicity fix; this already protected the `--auto` path, just not the reviewed `--plan-hash` path. |
| `src/evidence/semantics.ts` resolution analyzer (existing) | implementation-source | active | Reused for the close-evidence snapshot instead of writing a second resolution algorithm. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-finalize.ts` | `executeFinalizePlan` now runs the existing virtual-finished-root close preflight before writing finish, refusing with zero writes (mode `execute-refused`) if the post-finish close plan would block. Protects the reviewed `--plan-hash` execute path the same way `--auto` was already protected. |
| `src/task/task-close.ts` | `createCloseEvidenceSnapshot` now reuses `findUnresolvedFailedEvidence`/`findUnexplainedBlockedEvidence` from `src/evidence/semantics.ts` instead of its own outcome-only check, so `resolves:`/`supersedes:` markers are honored. |
| `src/services/evidence-lint.ts` | Exported `readTaskDocs` and added `readValidPersistedEvidenceRecords` so evidence lint and task close share one evidence-parsing/validity source of truth. |
| `src/services/validation-run.ts` | `validationCheckKey` now hashes argv alongside the check name; `isValidationAttemptForCheck`'s summary-text fallback now also requires matching command text, so a reused check name with a different command cannot auto-resolve or be resolved by an unrelated attempt. |
| `src/init/safety.ts` | `findDescendantProject` reports whether its 10000-directory inspection cap was hit with the queue still non-empty; `validateInitPaths` now raises `INIT_NESTED_PROJECT_SCAN_INCOMPLETE` in that case instead of treating a truncated scan as "no nested project." |
| `src/task/task-board.ts` | `formatTaskBoardRow`'s v1 branch now preserves `existingCells.slice(6)` instead of discarding any column beyond the frozen six, matching the legacy branch's existing preservation behavior. |
| `tools/dev-docker-check.ts`, `scripts/dev-docker-sync-build.sh` | Both dist-sync paths recheck the workspace dist hash immediately before the destructive `rm -rf`+copy, not only at the start of the run, refusing if it changed during the intervening install/build/test steps. |
| T-0711 (prior capsule) | Re-closed with fresh close proof after this review found it `closed-stale`: a blocked-then-resolved evidence record appended after its original close proof had made the recorded close-source hash stale. Not part of this capsule's scope; recorded here because it was fixed in the same session as a live demonstration of finding #1's underlying mechanism. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | The close-atomicity fix still has a narrow residual race window between the virtual preflight and the real finish/close-evidence writes (both inside the same lock, but not a single atomic filesystem transaction). A full journal-before-write close transaction (mirroring Init v1 apply's pattern) would close this fully but is materially larger scope. | Open | task-close-transaction.ts |
| RF-2 | Follow-up | `scripts/dev-docker-sync-build.sh`'s new guard assumes the host path and the in-container `HADARA_WORKSPACE` path resolve to the same bind-mounted files, matching the script's existing assumption elsewhere; not independently re-verified beyond reading the existing tar/cp commands that already rely on this. | Open | scripts/dev-docker-sync-build.sh |

## Close Summary

Fixed six independently verified integrity gaps in task close atomicity, evidence resolution reuse, validation attempt identity, init nested-project scan fail-open behavior, Task Board column preservation, and Docker dist-sync TOCTOU, each with a regression test; full validation passes 142 public files/1111 tests and 16 HADARA-dev files/133 tests.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-27 | Draft | Initial task scaffold. |
| 2026-07-27 | Done | Implemented and tested all 6 fixes from the code review; re-closed T-0711 which the review's mechanism found to be `closed-stale`; full validation passed. |
