# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-19T12:32:32.196Z | command-log | Initial built CLI session start smoke timed out after 45s because the MVP called live context pack on the mounted workspace by default. | failed | public | evidence.jsonl |
| 2026-06-19T12:32:48.401Z | command-log | Docker check passed after bounded no-live session-start fix: npm run dev:docker-check completed build plus full test suite with 136 files and 894 tests passing. | passed | public | evidence.jsonl |
| 2026-06-19T12:32:48.400Z | command-log | Docker sync-build passed and refreshed workspace dist; version smoke reported build.distLooksStale:false after 136 files and 894 tests passed. | passed | public | evidence.jsonl |
| 2026-06-19T12:32:49.638Z | command-log | Built CLI session start smoke passed after bounded no-live fix: timeout 10s node dist/cli/main.js session start --task T-0378 --max-read-first 3 --max-items 8 --json returned ok:true in about 1.6s with degraded metadata. | passed | public | evidence.jsonl |
| 2026-06-19T12:33:19.738Z | command-log | Evidence lint passed after validation evidence appends: 4 records, 4 Markdown rows, 0 issues; failed timeout evidence is resolved/superseded by the later built smoke pass. | passed | public | evidence.jsonl |
| 2026-06-19T12:41:06.620Z | command-log | Task close validation for T-0378 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:b82174ba815ae1335f3555a1010333130e3bc4d0e9b9ec47110d0fb898a11cfe. | passed | public | evidence.jsonl |
