# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-21T14:41:55Z | test-log | Docker validation copied repo into container filesystem, then ran npm ci and npm run check: 11 test files passed, 44 tests passed. | passed |
| 2026-05-21T14:41:55Z | command-log | Docker CLI smoke ran hermes detect --json and returned hadara.hermes.detect.v1 with context file detection. | passed |
| 2026-05-21T14:41:55Z | command-log | Docker CLI smoke ran hermes export-context --json and returned hadara.hermes.export-context.v1 with project-relative output path. | passed |
| 2026-05-21T14:41:55Z | command-log | Docker CLI smoke ran non-JSON hermes detect and preserved legacy found/missing output. | passed |
| 2026-05-21T14:43:22Z | command-log | Docker harness validation for T-0014 returned ok true with no issues. | passed |
