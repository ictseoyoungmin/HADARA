# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker temp-copy `npm run test:focused -- tests/unit/init.test.ts tests/unit/status-json.test.ts tests/unit/tui-read-model.test.ts tests/unit/doctor.test.ts tests/unit/handoff-suggestion.test.ts` | Validate all first-run UX regressions. | Yes | Passed | Evidence `ev:T-0273:ba272d0e35eb459e90d167d4`; 5 files / 42 tests passed in `/tmp/hadara-t0273-test`. |
| Docker temp-copy build and dist sync | Refresh built CLI output after source changes. | Yes | Passed | `/tmp/hadara-t0273-test` `npm run build` passed and copied `dist/` to `/workspace/dist`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI fresh scaffold smoke | Yes | Verify installed-package style interfaces on generated project. | Passed | Evidence `ev:T-0273:599f3c4dcf8040388a41b45f`; `/tmp/hadara-t0273-smoke` verified JSON/phase/path/generic wording. |
| `git diff --check` | Yes | Catch whitespace churn. | Passed | Evidence `ev:T-0273:c297d34f3da14d57bdfebcda`. |
