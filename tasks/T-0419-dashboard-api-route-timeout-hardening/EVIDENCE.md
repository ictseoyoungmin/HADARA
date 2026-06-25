# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-25T07:51:50.449Z | command-log | Initial focused dashboard-static validation reproduced the dashboard API route timeout: the shared read-model API route test exceeded the 5s per-test budget before the route default path was confirmed fixed. | failed | public | evidence.jsonl |
| 2026-06-25T07:51:58.759Z | command-log | Docker focused dashboard-static validation passed after dashboard API hardening: tests/unit/dashboard-static.test.ts passed 15 tests; the shared read-model API route test completed in 945ms and the file completed in 3.31s. | passed | public | evidence.jsonl |
| 2026-06-25T07:52:18.493Z | command-log | Workspace dist was refreshed from the Docker /tmp/hadara build output after the dashboard API route hardening change. | passed | public | evidence.jsonl |
| 2026-06-25T07:56:29.434Z | command-log | git diff --check passed after dashboard API hardening and task/shared documentation updates. | passed | public | evidence.jsonl |
| 2026-06-25T07:58:09.076Z | command-log | Dashboard API timeout reproduction is resolved by the status/debt separation and core bootstrap default; focused Docker dashboard-static validation passed after the fix. | passed | public | evidence.jsonl |
| 2026-06-25T07:59:47.452Z | command-log | Task close validation for T-0419 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:ab3d6bbd675f8271eecba929dcbc2dcf7817c5524b2f9e1ed0b974088578b34a. | passed | public | evidence.jsonl |
