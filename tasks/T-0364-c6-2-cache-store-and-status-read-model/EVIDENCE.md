# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-18T14:41:52.893Z | command-log | Command completed. | unknown | public | evidence.jsonl |
| 2026-06-18T14:42:17.953Z | command-log | Docker full sync-build passed on rerun: npm run check completed 133 test files and 855 tests, dist refreshed, built CLI version smoke reported distLooksStale false. | passed | public | evidence.jsonl |
| 2026-06-18T14:42:17.954Z | command-log | Docker focused build and C6 cache/schema/CLI tests passed: npm run build plus context-cache-store, context-source-manifest, context-graph-cli, schema-fixtures, schema-runtime, command-registry. | passed | public | evidence.jsonl |
| 2026-06-18T14:42:19.227Z | command-log | Built CLI smoke passed: node dist/cli/main.js context cache status --json returned schemaVersion hadara.context.cacheStatus.v1 with readOnly true and mode miss. | passed | public | evidence.jsonl |
| 2026-06-18T14:50:50.987Z | command-log | Final Docker focused revalidation after shared docs updates passed: npm run build plus 8 focused test files / 56 tests for cache, CLI, schema, registry, and docs stability. | passed | public | evidence.jsonl |
| 2026-06-18T14:52:31.186Z | command-log | Task close validation for T-0364 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:89c07d580ecbe9257d23ea8aac125c828e8b82f8f197abe0983c2c0daabdb3b3. | passed | public | evidence.jsonl |
