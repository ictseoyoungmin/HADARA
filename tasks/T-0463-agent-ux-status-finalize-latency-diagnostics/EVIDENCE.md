# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0463:d7ed90ac429d428eb84ce44a | passed | validation | Focused Docker validation passed: task-workbench, task-finalize, and schema-fixtures tests completed 3 files / 23 tests, followed by TypeScript build passing in /tmp/hadara. |
| ev:T-0463:b8afb3afd6544e5d8ce7319f | passed | validation | Built CLI smoke passed: direct task status --task T-0463 --json returned diagnostics with commandPath task.status, durationMs 21391, slow true, threshold 10000, and direct task finalize --task T-0463 --json returned diagnostics with commandPath task.finalize and durationMs 76. |
| ev:T-0463:e51a09de51e649ab9d9f1f45 | passed | validation | Resolved nested child_process smoke residual: direct built CLI task status and task finalize smokes proved diagnostics output, so the EPERM nested-spawn failure is classified as sandbox environment friction rather than a T-0463 implementation failure. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0463:b7ff01f2251846a4af2f7850 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0463:56c9cbeae4a74a93a459842e | failed | Nested child_process smoke failed under this sandbox with spawnSync node EPERM before invoking the HADARA CLI; direct CLI smokes were used as the valid built-CLI proof. | Resolved | ev:T-0463:e51a09de51e649ab9d9f1f45 |
<!-- /hadara:slot -->
