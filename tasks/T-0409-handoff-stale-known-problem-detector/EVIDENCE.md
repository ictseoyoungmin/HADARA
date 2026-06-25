# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-25T04:37:40.667Z | command-log | Attempted npm run dev:docker-sync-build after adding handoff stale-problems; new handoff/schema tests ran, but the full suite failed on existing dashboard/evidence timeout behavior before dist sync completed. | failed | public | evidence.jsonl |
| 2026-06-25T04:37:51.486Z | command-log | Docker /tmp/hadara build passed; focused tests tests/unit/handoff-suggestion.test.ts and tests/unit/schema-fixtures.test.ts passed 9 tests; workspace dist was refreshed; built CLI handoff stale-problems smoke returned ok:true with candidates:0 on the current repo; git diff --check passed. | passed | public | evidence.jsonl |
| 2026-06-25T04:42:34.869Z | command-log | resolves:ev:T-0409:50fc016e8af6435ba6fa7838 Classified the full dev:docker-sync-build failure as a non-blocking pre-existing timeout for T-0409 after Docker build, focused handoff/schema tests, dist refresh, built stale-problems smoke, and git diff check passed. | unknown | public | evidence.jsonl |
| 2026-06-25T04:44:13.349Z | command-log | Task close validation for T-0409 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:593aaadd4ec7e59627d03aab89b850c285ace95043d9d5613654e82ec93319c7. | passed | public | evidence.jsonl |
