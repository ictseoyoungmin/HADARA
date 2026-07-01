# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0459:e70d6bc192f446d7ba8b0a95 | passed | validation | Focused Docker validation passed: init.test, session-start.test, harness-validate.test completed 3 files / 50 tests, followed by TypeScript build passing in /tmp/hadara. |
| ev:T-0459:d64e7340878e4e57ac628a3d | passed | validation | Built CLI smokes passed after refreshing workspace dist: init --help printed read-only help, fresh governed init created 15 files and init doctor returned ok:true, session start no-task and task-scoped guidance now recommend task status, and task status T-0459 remained author-task. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0459:823f873643c141be9d7753b9 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0459:469f12fd91d04455b1587491 | failed | Docker dev:docker-sync-build built successfully but full Vitest failed on pre-existing broad fixture drift outside this capsule; focused affected tests were rerun separately. | Resolved | ev:T-0459:e70d6bc192f446d7ba8b0a95 |
<!-- /hadara:slot -->
