# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0442:0442975b9ace4166a801f5a6 | passed | validation | Context Pack read-map integration focused Docker validation passed: build plus tests/unit/context-pack.test.ts, tests/unit/docs-registry.test.ts, and tests/unit/session-start.test.ts; 3 files / 24 tests. |
| ev:T-0442:fb4472fd84544f7ea682ade0 | passed | validation | Built CLI context-pack smoke passed for T-0442: context pack --task T-0442 --json reported docsReadMapAvailable true, readFirst 7, readIfNeeded 23, docsReadMapDoNot 74, included the active 0.4 context routing spec, and did not include tmp unregistered specs in default read buckets. |
| ev:T-0442:135871c73abb418da735fd6b | passed | validation | git diff --check passed after T-0442 context-pack read-map integration and shared-state updates. |
| ev:T-0442:be6fa0e0674249eb807d6454 | passed | validation | AC-5 cleanup check passed: rg found no AC-5 Pending, pending rerun, TBD, or Not Run placeholders in T-0442 TASK.md/HANDOFF.md after final validation updates. |
| ev:T-0442:197586bb12964b7db5fbd769 | passed | validation | Done-level harness and evidence lint passed after final T-0442 capsule cleanup. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0442:0bbc91bbb0f74005a83347e5 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0442:0e3a277c413840c3b3aea5bd | failed | Initial built CLI context-pack smoke failed because read-map active specs were sorted behind current-state docs and fell outside the default readFirst budget. | Unresolved | evidence.jsonl |
| ev:T-0442:515f3765fff74381946c8526 | failed | Done-level harness initially failed because AC-5 was still Pending after validation evidence had been recorded. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
