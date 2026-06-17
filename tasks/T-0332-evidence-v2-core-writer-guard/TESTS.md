# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/evidence-semantics.test.ts tests/unit/evidence-lint.test.ts tests/harness/task-capsule.test.ts` | Focus writer guard plus adjacent T-0331 evidence hardening coverage. | Yes | First attempt failed from an incorrect assertion that `EVIDENCE.md` was absent; rerun passed 4 files / 55 tests after assertion correction. | Blocked `ev:T-0332:6e5e2ab641ab466f81927ce7`; resolved by `ev:T-0332:5423461e33ee464ebb680fa5` |
| Docker `npm run check` plus `npm run build` and workspace `dist` refresh | Full repository validation before close. | Yes | Passed: 119 files / 790 tests; build passed; workspace `dist` refreshed. | `ev:T-0332:07062f2241054c4589f99a31` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI mismatch smoke | Yes | Confirm user-facing CLI still reports `EVIDENCE_RESULT_OUTCOME_MISMATCH` after validator reuse. | Passed: command exited 6 with `EVIDENCE_RESULT_OUTCOME_MISMATCH`. | `ev:T-0332:c212c78562c04c6da413ded7` |
