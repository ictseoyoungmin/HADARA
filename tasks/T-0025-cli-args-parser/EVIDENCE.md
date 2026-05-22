# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-22T11:31:24+09:00 | diff-summary | Added strict CLI args helpers, replaced bootstrap CLI option reads, kept maxSteps on bounded integer parsing, and added unit regressions for missing values and flag-like values. | passed |
| 2026-05-22T11:31:24+09:00 | command-log | Docker read-only mount validation `npm ci && npm run check` passed: 19 test files passed, 84 tests passed. | passed |
| 2026-05-22T11:31:24+09:00 | command-log | Built CLI JSON smoke `node dist/cli/main.js run --script --json --json` returned a stable `agent.loop` JSON issue for `--script value must not look like a flag`. | passed |
| 2026-05-22T11:32:40+09:00 | command-log | Docker built CLI validation `node dist/cli/main.js harness validate --task T-0025 --json` returned `ok: true` with 11 checked files and no issues. | passed |
