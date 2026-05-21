# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-21T14:25:54Z | test-log | Docker validation copied repo into container filesystem, then ran npm ci and npm run check: 9 test files passed, 39 tests passed. | passed |
| 2026-05-21T14:25:54Z | command-log | Docker CLI smoke ran node dist/cli/main.js task list --json and returned hadara.task.list.v1 with 12 tasks. | passed |
| 2026-05-21T14:25:54Z | command-log | Docker CLI smoke ran node dist/cli/main.js task show T-0012 --json and returned hadara.task.show.v1 with TASK.md content. | passed |
| 2026-05-21T14:25:54Z | command-log | Docker CLI failure smoke ran task show T-9999 --json and exited with code 6 plus TASK_NOT_FOUND. | passed |
| 2026-05-21T14:25:54Z | command-log | Docker CLI smoke ran human-readable task list and preserved tabular text output. | passed |
| 2026-05-21T14:27:13Z | command-log | Docker harness validation for T-0012 returned ok true with no issues. | passed |
