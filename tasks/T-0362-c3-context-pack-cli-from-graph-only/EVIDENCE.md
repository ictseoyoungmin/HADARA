# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-18T13:49:53.962Z | command-log | Initial Docker dev check failed because the code-aware context pack CLI test over-asserted selection of an unrelated source file; the test was corrected to assert code-index availability and no unavailable warning. | failed | public | evidence.jsonl |
| 2026-06-18T13:50:04.057Z | command-log | Docker dev check passed after correcting context pack CLI assertions: TypeScript build and full Vitest suite passed with 131 files / 842 tests. | passed | public | evidence.jsonl |
| 2026-06-18T13:54:16.522Z | command-log | Docker sync-build passed with 131 files / 842 tests, refreshed workspace dist, and built version smoke reported distLooksStale:false. | passed | public | evidence.jsonl |
| 2026-06-18T13:54:27.343Z | command-log | Built CLI context pack smokes passed for graph-only and include-code modes. Graph-only returned hadara.contextPack.v1 ok:true with cache.used:false and sourcesRead:990; include-code returned ok:true with codeIndexAvailable:true, cache.used:false, sourcesRead:1307, and observable live-path latency that supports prioritizing C6.1 source manifest/shared discovery next. | passed | public | evidence.jsonl |
| 2026-06-18T13:58:11.804Z | command-log | Task close validation for T-0362 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:7142c80085f0288cbfd391dfaf787c2c276c59a46f6ce98af891f92240b877e6. | passed | public | evidence.jsonl |
