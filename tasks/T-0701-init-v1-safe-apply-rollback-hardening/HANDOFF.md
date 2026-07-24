# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0701 |
| Title | Init v1 Safe Apply Rollback Hardening |
| Status | In Progress |
| Created | 2026-07-25T00:00 |
| Updated | 2026-07-25T00:20 |

## Last Completed

| Item | Evidence |
|---|---|
| Human review of T-0698~T-0700 identified the rollback-overwrite gap; this capsule closes it in `rollbackJournal()`. | This capsule TASK records the reviewed scope. |
| Rollback of a pre-existing file now hashes the current target and only restores `beforeContent` when the current hash matches the transaction's own after-hash; a hash matching before-hash is a no-op; anything else is retained and reported as `INIT_ROLLBACK_EXTERNAL_MODIFICATION` instead of overwritten. Same guard for a newly-created file. | `ev:T-0701:ca6ee4dfdcf3407eaa80bb1c` |
| Fixed `recovery.required` staying `false` when startup recovery (`recoverIncompleteTransaction`) leaves unresolved issues. | Same evidence; covered by the new regression test's `recovery.required: true` assertion. |
| Clarified interactive-TTY vs JSON/CI apply wording in `hadara init --help` and `docs/HADARA_WORKFLOW.md`. | `ev:T-0701:be4c05c13019422799456824` |
| Focused (10/10 + 35/35), full Docker public suite (139/140 files, 1089/1090 tests, 1 pre-existing unrelated failure), HADARA-dev suite (16/16, 127/127), and dist refresh all passed. | `ev:T-0701:ca6ee4dfdcf3407eaa80bb1c`; `ev:T-0701:f06d07e22d0746be92fffc26`; `ev:T-0701:fb960b46738548c897baf37b`; `ev:T-0701:be4c05c13019422799456824` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Implement Init v1 Re-init and Upgrade Ownership. | actionable | yes | This was T-0700's deferred next step and remains the next mapped Init v1 boundary now that rollback safety is hardened; it must consume the hardened rollback/recovery primitives from this capsule. | Both Init v1 specs; T-0698 implementation map; T-0699 model/planner; T-0700 and T-0701 transaction/rollback; architecture/security/test strategy. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `scripts/dev-docker-sync-build.sh`'s check-only copy excludes the whole `.hadara` directory, so `tests/unit/status-current-state-source.test.ts`'s repo-self-reproduction case always fails under `npm run dev:docker-check`, independent of any other change. | Anyone running the standard Docker check will see 1 failing test and may mistake it for a regression; it also silently prevents `npm run test:all`'s `&&` chain from reaching the HADARA-dev suite. | Confirmed pre-existing and unrelated (reproduces on unmodified `git HEAD`); run the HADARA-dev suite (`vitest run --config vitest.dev.config.ts`) separately when this happens. Recorded as RF-3 in this capsule's TASK.md and in `docs/AGENT_HANDOFF.md` Known Problems; not fixed here (out of scope). |
