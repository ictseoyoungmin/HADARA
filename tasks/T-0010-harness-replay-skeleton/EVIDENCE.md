# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-21T10:04:05Z | test-log | Docker validation copied repo into container filesystem, then ran npm ci and npm run check: 7 test files passed, 34 tests passed. | passed |
| 2026-05-21T10:04:05Z | command-log | Docker CLI smoke ran node dist/cli/main.js harness replay tests/fixtures/replay/basic-success.jsonl --json and returned ok true. | passed |
| 2026-05-21T10:04:05Z | command-log | Docker CLI failure smoke ran node dist/cli/main.js harness replay missing.jsonl --json and exited with code 6 plus SCENARIO_NOT_FOUND. | passed |
| 2026-05-21T10:05:56Z | command-log | Docker harness validation for T-0010 returned ok true with no issues. | passed |
