# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-22T00:31:28Z | test-log | Docker validation copied repo into container filesystem, then ran npm ci and npm run check: 13 test files passed, 50 tests passed. | passed |
| 2026-05-22T00:31:28Z | command-log | Docker CLI smoke ran policy preflight-shell npm run check --mode auto --json and returned allowed with willExecute false. | passed |
| 2026-05-22T00:31:28Z | command-log | Docker CLI smoke ran policy preflight-shell npm run check --mode assisted --json and returned requires_approval with willExecute false. | passed |
| 2026-05-22T00:31:28Z | command-log | Docker CLI failure smoke ran policy preflight-shell curl pipe-to-sh --mode auto --json and exited with code 2 plus denied status. | passed |
| 2026-05-22T00:32:45Z | command-log | Docker harness validation for T-0017 returned ok true with no issues. | passed |
