# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-21T14:49:28Z | test-log | Docker validation copied repo into container filesystem, then ran npm ci and npm run check: 12 test files passed, 47 tests passed. | passed |
| 2026-05-21T14:49:28Z | command-log | Docker CLI smoke ran evidence collect --task T-0015 --json and returned hadara.evidence.collect.v1 with appended evidence record. | passed |
| 2026-05-21T14:49:28Z | command-log | Docker CLI failure smoke ran evidence collect --task T-9999 --json and exited with code 6 plus TASK_NOT_FOUND. | passed |
| 2026-05-21T14:49:28Z | command-log | Docker CLI smoke ran non-JSON evidence collect and preserved legacy updated-path output. | passed |
| 2026-05-21T14:50:58Z | command-log | Docker harness validation for T-0015 returned ok true with no issues. | passed |
