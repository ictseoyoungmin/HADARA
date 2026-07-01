# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0470:00190a9390e54a3db393d461 | passed | validation | Focused Docker validation passed after task-scoped lookup and close-plan reuse changes: 8 files / 89 tests for close, close-source, close-repair-plan, finalize, lifecycle, complete-flow, harness validate, and task workbench; targeted protocol task-scoped smoke passed 1 test with 19 skipped. |
| ev:T-0470:f5fc721056374e47b4a4ea43 | passed | validation | Docker TypeScript build passed after performance changes and workspace dist was refreshed from /tmp/hadara/dist. |
| ev:T-0470:b0beb3b22fea47f1b51b7c78 | passed | validation | Built CLI mounted-workspace smokes passed after dist refresh. T-0469 audit-close completed in about 8.5s versus pre-change about 15.6s; T-0469 full status completed in diagnostics.durationMs 12009 versus pre-change 20749; T-0469 finalize stopped on expected source-doc drift from this capsule in diagnostics.durationMs 1118; git diff --check passed. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0470:bad2fdcc08584ce1a1d5e112 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0470:f3e6a00d1403443381b66ebd | failed | Initial broad focused suite including protocol-consistency.test.ts failed on stale protocol fixture assumptions for removed legacy task files FILES.md/ACCEPTANCE.md; implementation-specific close/finalize paths were checked separately. | Resolved | ev:T-0470:00190a9390e54a3db393d461 |
<!-- /hadara:slot -->
