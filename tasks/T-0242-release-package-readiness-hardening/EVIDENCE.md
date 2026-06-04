# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-04T04:57:41.831Z | command-log | Release dry-run readiness hardening passed Docker validation: dev:docker-check and dev:docker-sync-build each passed 92 test files / 611 tests, and workspace dist was refreshed with distLooksStale:false. | passed | public | evidence.jsonl |
| 2026-06-04T04:57:51.785Z | command-log | Built CLI release dry-run smoke returned the new readiness and diagnostics fields: exit 6 for stale release artifact evidence, next action refresh-release-artifact-evidence, and slowStageWarnings identified strict-release-gate at about 12.5s of a 13.8s run. | passed | public | evidence.jsonl |
| 2026-06-04T04:59:11.835Z | command-log | Task close validation for T-0242 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:8402c77e4d07341ed9ca1c2577ef43d0704a947df4527c4d919e26fd61c86e6c. | passed | public | evidence.jsonl |
| 2026-06-04T05:02:16.201Z | command-log | Final schema compatibility adjustment kept readiness/diagnostics additive in the v1 schema; Docker dev:docker-check and final dev:docker-sync-build both passed 92 test files / 611 tests, with distLooksStale:false. | passed | public | evidence.jsonl |
| 2026-06-04T05:02:44.198Z | command-log | Task close validation for T-0242 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:8402c77e4d07341ed9ca1c2577ef43d0704a947df4527c4d919e26fd61c86e6c. | passed | public | evidence.jsonl |
