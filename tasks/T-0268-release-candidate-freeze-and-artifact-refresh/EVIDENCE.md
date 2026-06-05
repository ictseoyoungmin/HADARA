# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-05T10:47:39.535Z | command-log | Dev Docker sync-dist passed with --before-hash sha256:615b23d0bfb4e794a4b40388e7b65848f4932783a0e6e2624725a5f2f9fee975; focused release/schema tests passed; distSync.requiresBeforeHash true; beforeHashMatched true; outputChanged false; built CLI reports packageVersion 0.2.0-rc.0 and distLooksStale false. | passed | public | evidence.jsonl |
| 2026-06-05T10:47:39.535Z | command-log | Dev Docker validation passed in focused-and-full mode for release/schema/task workflow coverage: release-dry-run, schema-runtime, dev-docker-check, task-complete-flow, task-close, and handoff-suggestion tests; full repository check passed. | passed | public | evidence.jsonl |
| 2026-06-05T10:47:40.180Z | command-log | Documented sync-dist guard nuance: before-hash without the sha256: prefix was rejected with HADARA_DIST_SYNC_BEFORE_HASH_MISMATCH even though the raw digest matched; rerun with the canonical sha256: prefix passed. | passed | public | evidence.jsonl |
