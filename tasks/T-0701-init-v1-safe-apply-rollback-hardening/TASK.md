# T-0701 Init v1 Safe Apply Rollback Hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0701 |
| Title | Init v1 Safe Apply Rollback Hardening |
| Status | Done |
| Created | 2026-07-25T00:00 |
| Updated | 2026-07-25T00:25 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the T-0700 reviewer-identified rollback safety gap so a failed apply never overwrites a pre-existing file that another actor changed after the transaction started, and clarify apply-mode wording gaps the same review raised. | Human review of T-0698~T-0700 (2026-07-24) identified this as the most important remaining problem in the safe-apply transaction and asked for it to be closed as a small hotfix capsule before Init v1 Re-init and Upgrade Ownership. |

## Scope

| Boundary | Items |
|---|---|
| In | Rollback of a pre-existing (`beforeExists: true`) journal entry now compares the current file hash against both the recorded after-hash and before-hash before acting: restores `beforeContent` only when the current hash still matches the transaction's own after-hash, treats a current hash matching the before-hash as an already-restored no-op, and otherwise retains the current file and reports a manual-recovery issue instead of overwriting it. Same treatment for a newly-created file whose current content no longer matches its recorded after-hash. Fixes `recovery.required` staying `false` when startup recovery (`recoverIncompleteTransaction`) leaves unresolved issues. Regression test for the externally-modified-during-failure case. Clarifies interactive-TTY vs JSON/CI apply-mode wording in `hadara init --help` and `docs/HADARA_WORKFLOW.md`. |
| Out | Re-init/upgrade ownership, preset-change semantics, managed-doc upgrade tracking, legacy migration, `--prune` (still Init v1 Re-init and Upgrade Ownership); fsync/parent-directory-fsync crash durability; new public schemas; any change to already-accurate "atomic rename" wording in `docs/ARCHITECTURE.md`. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm the exact rollback gap in `src/init/transaction.ts` and decide the three-way hash comparison contract. | Done |
| 2 | Implement the fix and add a focused regression test for external modification during rollback. | Done |
| 3 | Clarify TTY vs JSON/CI apply wording in CLI help and workflow docs. | Done |
| 4 | Refresh `dist`, run focused and full validation, update capsule/shared docs, close proof-last. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Rollback of a pre-existing file restores `beforeContent` only when the current file still matches the transaction's own after-hash. | Met | `ev:T-0701:ca6ee4dfdcf3407eaa80bb1c` | Human review item 4 |
| AC-2 | Rollback of a pre-existing file that was externally modified after the failed action (current hash differs from both after-hash and before-hash) is retained as-is, is not overwritten, and is reported as a manual-recovery issue. | Met | `ev:T-0701:ca6ee4dfdcf3407eaa80bb1c` | Human review item 4 |
| AC-3 | Rollback of a pre-existing file already matching `beforeContent` (idempotent retry) is a safe no-op. | Met | `ev:T-0701:ca6ee4dfdcf3407eaa80bb1c` | Human review item 4 |
| AC-4 | `hadara init --help` and `docs/HADARA_WORKFLOW.md` state plainly that plain interactive TTY `hadara init` prompts and can apply in the same process, while JSON/non-interactive/CI stays two-step dry-run-then-execute. | Met | `ev:T-0701:be4c05c13019422799456824` | Human review item 6 |
| AC-5 | Focused and full Docker validation pass and `dist` is current. | Met | `ev:T-0701:ca6ee4dfdcf3407eaa80bb1c`; `ev:T-0701:f06d07e22d0746be92fffc26`; `ev:T-0701:fb960b46738548c897baf37b`; `ev:T-0701:be4c05c13019422799456824` | User instruction |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Init v1 apply transaction focused tests (10/10, incl. new rollback regression) plus init.test.ts (35/35) | Yes | Passed | ev:T-0701:ca6ee4dfdcf3407eaa80bb1c |
| Clean Docker ext4 `npm run check` (build, typecheck:tools, public suite) — 1 failure is `status-current-state-source.test.ts`'s repo-self-reproduction case, confirmed pre-existing/unrelated (see RF-3) | Yes | Failed | ev:T-0701:f06d07e22d0746be92fffc26 |
| HADARA-dev suite (16 files / 127 tests) | Yes | Passed | ev:T-0701:fb960b46738548c897baf37b |
| Dist refresh/parity (`dev:docker-sync-build`) | Yes | Passed | ev:T-0701:be4c05c13019422799456824 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Human review of T-0698~T-0700 (2026-07-24/25) | decision | active | Identifies the rollback overwrite gap (item 4) as the top-priority follow-up and the TTY wording gap (item 6) as a documentation fix; confirms current "atomic rename" wording (item 5) is already accurate and needs no change. |
| `tasks/T-0700-init-v1-safe-apply-transaction/TASK.md` | reference | active | Closed-valid prerequisite transaction this capsule hardens. |
| `src/init/transaction.ts` | implementation | active | `rollbackJournal()` is the function being hardened. |
| `docs/SECURITY_MODEL.md` | constraint | active | Non-destructive and external-state-preservation requirements. |
| `docs/TEST_STRATEGY.md` | constraint | active | Docker and failure-path validation. |

## Changes

| Area | Summary |
|---|---|
| Rollback safety | `rollbackJournal()` now hashes the current file for `beforeExists` entries and only restores when the current hash still matches the transaction's own after-hash; a current hash matching before-hash is a no-op; any other current hash is retained and reported as `INIT_ROLLBACK_EXTERNAL_MODIFICATION` instead of being overwritten. |
| Tests | Added a focused regression covering a pre-existing file changed by another actor after a mutation and before rollback. |
| Docs | Clarified interactive-TTY vs JSON/CI apply wording in `hadara init --help` and `docs/HADARA_WORKFLOW.md`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Re-init/upgrade ownership and migration remain the next capsule and must consume the same hardened rollback. | Deferred | Init v1 Re-init and Upgrade Ownership |
| RF-2 | Risk | `atomicWrite()` uses temp-file + same-directory rename only; no `fsync`/parent-directory `fsync`, so it is recoverable/journaled/atomic-rename, not crash-durable. | Accepted | Out of scope per human review item 5; wording already accurate in `docs/ARCHITECTURE.md`. |
| RF-3 | Risk | `scripts/dev-docker-sync-build.sh`'s `copy_full_workspace()` excludes the entire `.hadara` directory (including the git-tracked `.hadara/state/current.json`), which makes `tests/unit/status-current-state-source.test.ts`'s repo-self-reproduction case ("reproduces this repository's own current release and activeTask facts") fail every time `npm run dev:docker-check` runs, independent of any other change. Verified reproducible on unmodified `git HEAD` sources by copying `.hadara/state/current.json` into the check copy, which makes the test pass. | Open | Out of scope for this capsule (unrelated to rollback hardening); recorded here and in `docs/AGENT_HANDOFF.md` Known Problems for whichever capsule next touches the Docker check script or that test. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-25 | Draft | Initial task scaffold. |
| 2026-07-25 | In Progress | Authored scope from human review of T-0698~T-0700; hardened `rollbackJournal()` three-way hash check, fixed `recovery.required` flag for startup-recovery issues, added regression test, clarified TTY/JSON apply wording, and recorded focused/full Docker/dist evidence with one pre-existing unrelated failure documented. |
| 2026-07-25 | Done | Closed the reviewed rollback-overwrite gap; focused (10/10 transaction, 35/35 init), HADARA-dev (127/127), and Docker build/typecheck all passed; the 1 unrelated pre-existing `status-current-state-source.test.ts` failure was verified reproducible on unmodified `git HEAD` and recorded as RF-3. |
