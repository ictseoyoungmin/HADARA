# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-19T06:18:09.125Z | command-log | npm run dev:docker-check passed after C6.3 cache warm implementation and source-manifest git candidate optimization; Docker temp build plus full test suite passed 133 test files and 861 tests. | passed | public | evidence.jsonl |
| 2026-06-19T06:18:17.950Z | command-log | npm run dev:docker-sync-build passed after C6.3 cache warm implementation; Docker temp build plus full test suite passed 133 test files and 861 tests, refreshed /workspace/dist, and built CLI version smoke reported distLooksStale:false. | passed | public | evidence.jsonl |
| 2026-06-19T06:18:29.073Z | command-log | Built CLI cache warm smokes passed: context cache warm --json produced a dry-run planned write, --execute wrote .hadara/local/cache/context/source-manifest.json, context cache status --json reported a fresh hit, and a second --execute skipped the fresh cache. Measured mounted-worktree smoke improved first dry-run from about 23.8s before git candidate optimization to about 10.5s after; fresh checks still take about 10.6s and remain C6.4/C6.5 residual risk. | passed | public | evidence.jsonl |
| 2026-06-19T06:24:25.101Z | command-log | Task close validation for T-0366 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:b56e28e1d334cd327fab1186136256a81b40d36710ff57ca38ac8b6b36dd63e0. | passed | public | evidence.jsonl |
