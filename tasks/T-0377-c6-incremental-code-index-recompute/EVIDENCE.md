# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-19T11:53:08.549Z | command-log | Initial Docker check failed before import fix; context-cache-store focused test could not import codeIndexFileSummaryCachePath and release-dry-run timed out. | failed | public | evidence.jsonl |
| 2026-06-19T11:53:23.248Z | command-log | Focused Docker validation passed after fix: npm ci, npm run build, and npm run test:focused -- tests/unit/code-index.test.ts tests/unit/context-cache-store.test.ts (26 tests). | passed | public | evidence.jsonl |
| 2026-06-19T11:53:32.016Z | command-log | Docker sync-build passed: npm run dev:docker-sync-build completed build, full test suite (135 files, 891 tests), dist sync, and version smoke. | passed | public | evidence.jsonl |
| 2026-06-19T11:53:42.073Z | command-log | Built CLI context cache warm execute smoke passed; codeIndex warm wrote per-file summary stats (326 read, 326 recomputed on cold local cache) and final code-index shard. | passed | public | evidence.jsonl |
| 2026-06-19T11:53:52.931Z | command-log | Built CLI context graph --include-code smoke passed for task T-0377 with ok:true after warm cache refresh. | passed | public | evidence.jsonl |
| 2026-06-19T11:57:45.459Z | command-log | git diff --check passed after T-0377 code, tests, capsule docs, and shared docs updates. | passed | public | evidence.jsonl |
| 2026-06-19T11:59:06.118Z | command-log | Final git diff --check passed after finish-state and close-source document updates. | passed | public | evidence.jsonl |
| 2026-06-19T11:59:50.513Z | command-log | Resolved initial failed Docker check: import fix applied, focused Docker validation passed, and full Docker sync-build passed afterward. | passed | public | evidence.jsonl |
| 2026-06-19T12:00:40.058Z | command-log | Task close validation for T-0377 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:d0a7ead1e65ffc1a290390c4d0f47db1cb808d300743a9d363de06420c1fa2c9. | passed | public | evidence.jsonl |
