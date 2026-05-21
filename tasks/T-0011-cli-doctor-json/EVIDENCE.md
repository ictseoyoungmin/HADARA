# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-21T10:16:00Z | test-log | Docker validation copied repo into container filesystem, then ran npm ci and npm run check: 8 test files passed, 36 tests passed. | passed |
| 2026-05-21T10:16:00Z | command-log | Docker CLI smoke ran node dist/cli/main.js doctor --json and returned hadara.doctor.v1 with ok true. | passed |
| 2026-05-21T10:16:00Z | command-log | Docker CLI smoke ran node dist/cli/main.js doctor and preserved human-readable output. | passed |
| 2026-05-21T10:16:00Z | command-log | Docker CLI failure smoke ran doctor --project /tmp/hadara-missing-project --json and exited with code 7 plus missing checks. | passed |
| 2026-05-21T10:17:09Z | command-log | Docker harness validation for T-0011 returned ok true with no issues. | passed |
