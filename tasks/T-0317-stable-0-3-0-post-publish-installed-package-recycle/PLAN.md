# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and create T-0317 from the handoff recommendation. | Done | Current-state docs, task workflow docs, `docs/TEST_STRATEGY.md`, `docs/ROADMAP.md`, and T-0312 recycle pattern read. |
| 2 | Verify stable registry metadata plus `npx` and temp-prefix installed execution. | Done | Registry/temp-prefix passed; exact `npx` was not clean proof and is recorded in `FINDINGS.md` plus `command:T-0317:npx-exact-check`. |
| 3 | Verify fresh init/docs surfaces for `basic`, `standard`, and `governed` profiles. | Done | `command:T-0317:fresh-init-docs`; governed docs doctor warning recorded in `FINDINGS.md`. |
| 4 | Verify protocol migrate dry-run/execute, task finish preservation, and ready/close/audit mini lifecycle from the installed package. | Done | `command:T-0317:migration-finish-lifecycle`. |
| 5 | Record evidence, update TESTS/ACCEPTANCE/HANDOFF/shared state, then finish/ready/close/audit T-0317. | Done | T-0317 reached `closed-valid`; latest close evidence supersedes the pre-README-cleanup close proof. |
