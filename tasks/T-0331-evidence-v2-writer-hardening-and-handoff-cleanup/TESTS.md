# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/evidence-semantics.test.ts tests/unit/evidence-lint.test.ts tests/harness/task-capsule.test.ts` | Focus result/outcome, resolution semantics, lint, and task capsule discovery-adjacent coverage. | Yes | Passed: 4 files / 53 tests. | `ev:T-0331:5bd88716f7b6474c8ecddf6e` |
| Docker `npm run check` plus `npm run build` and workspace `dist` refresh | Full repository validation and built CLI refresh. | Yes | First full check attempt hit a release-dry-run timeout; standalone release-dry-run passed; full rerun passed 119 files / 788 tests, build passed, and `dist` refreshed. | Blocked attempt `ev:T-0331:359ba46a07334c439ee4a5d7`; resolved by `ev:T-0331:dd02bcba405c498d99331dd8` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI mismatch smoke for `--result failed --outcome passed`. | Yes | Confirms user-facing JSON failure code. | Passed: command exited 6 with `EVIDENCE_RESULT_OUTCOME_MISMATCH`. | `ev:T-0331:60b1b72df6a94af2b4746457` |
| Security smoke | No | No secrets, permissions, or execution boundary expansion; command remains non-executing evidence append. | Not Run | TBD |
