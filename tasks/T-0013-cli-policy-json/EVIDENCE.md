# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-21T14:33:21Z | test-log | Docker validation copied repo into container filesystem, then ran npm ci and npm run check: 10 test files passed, 42 tests passed. | passed |
| 2026-05-21T14:33:21Z | command-log | Docker CLI smoke ran policy check-shell npm run check --mode assisted --json and returned hadara.policy.check-shell.v1 with ok true. | passed |
| 2026-05-21T14:33:21Z | command-log | Docker CLI failure smoke ran policy check-shell curl pipe-to-sh --mode auto --json and exited with code 2 plus deny decision. | passed |
| 2026-05-21T14:33:21Z | command-log | Docker CLI smoke ran non-JSON policy check-shell and preserved decision-only output. | passed |
| 2026-05-21T14:34:45Z | command-log | Docker harness validation for T-0013 returned ok true with no issues. | passed |
