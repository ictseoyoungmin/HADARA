# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0441:619636a6d5a34be2a42bf1d9 | passed | validation | Session Start read-map integration focused Docker validation passed: build plus tests/unit/session-start.test.ts, tests/unit/docs-registry.test.ts, and tests/harness/harness-validate.test.ts; 3 files / 44 tests. |
| ev:T-0441:22402ccb85324b76a2d2bc79 | passed | validation | Built CLI session start smoke passed for T-0441: session start --task T-0441 --json returned docsReadMap taskId T-0441, readFirstCount 15, driftWarningCount 74, sourceDocumentDriftCount 0, and docs-read-map guidance. |
| ev:T-0441:3abf3c957375418e9626a68c | passed | validation | git diff --check passed after Session Start read-map integration and shared-state doc updates. |
| ev:T-0441:7411636008204dfa8fa6a5d6 | passed | validation | Capsule placeholder cleanup check passed: rg found no TBD or invalid Initial Failed rerun text in T-0441 TASK.md/HANDOFF.md. |
| ev:T-0441:3356794fd240478ca59880fb | passed | validation | Done-level harness and evidence lint passed after capsule doc cleanup for T-0441. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0441:5a5cce0aba6c4996b3b9b5a1 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0441:d54bf74c81844d338bc0abe2 | failed | Done-level harness initially failed on unresolved AC-5 and task-local HANDOFF placeholders before final capsule doc cleanup. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
