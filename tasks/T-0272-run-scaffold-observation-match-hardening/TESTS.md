# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker temp-copy `npm run test:focused -- tests/unit/run-cli.test.ts tests/unit/agent-loop.test.ts` | Verify focused run scaffold and agent-loop behavior without host dependency state. | Yes | Passed | Evidence `ev:T-0272:ecb8762baf964375a4fba098`; 2 files / 15 tests passed in `/tmp/hadara-t0272-test`. |
| Docker temp-copy build and dist sync | Refresh built CLI output after source changes. | Yes | Passed | `/tmp/hadara-t0272-build` `npm run build` passed and copied `dist/` to `/workspace/dist`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI run scaffold smoke | Yes | Reproduce the installed-package interface with generated files unchanged. | Passed | Evidence `ev:T-0272:38a6c12962a94d0e96f36f2d`; fresh `/tmp/hadara-t0272-smoke` project returned `ok:true`. |
| `git diff --check` | Yes | Catch whitespace churn before close. | Passed | Evidence `ev:T-0272:88506349e0454d0f94613bff`. |
