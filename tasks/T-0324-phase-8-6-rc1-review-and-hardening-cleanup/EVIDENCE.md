# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-15T11:36:53.781Z | command-log | Host focused vitest was unavailable because local node_modules did not expose vitest; Docker focused validation passed 5 files / 44 tests for task capsule discovery, task create, state projection, protocol consistency, and CI gate. | passed | public | evidence.jsonl |
| 2026-06-15T11:37:03.956Z | command-log | Full Docker sync-build passed: npm run build and npm test completed with 119 files / 777 tests, refreshed workspace dist, and version smoke reported distLooksStale:false. | passed | public | evidence.jsonl |
| 2026-06-15T11:37:03.964Z | command-log | Built CLI state/protocol/CI advisory smokes passed: state verify no longer reports T-0073 empty-directory drift; protocol doctor and ci gate only carry expected advisory stale-close state before T-0324 close. | passed | public | evidence.jsonl |
| 2026-06-15T11:37:05.473Z | command-log | git diff --check passed after T-0324 discovery hardening patch. | passed | public | evidence.jsonl |
| 2026-06-15T11:42:51.208Z | command-log | Task close validation for T-0324 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:087c1b83e1cdc46935d9673219cc8cfc451bce730dfe6c14154a98885fa7b6b5. | passed | public | evidence.jsonl |
