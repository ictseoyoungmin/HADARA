# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-25T13:02:52.222Z | command-log | Focused Docker build and dashboard validation passed after routing legacy /api/debt to the fast dashboard debt projection; dashboard-static API route test completed in 2535 ms and 19 focused tests passed. | passed | public | evidence.jsonl |
| 2026-06-25T13:03:06.576Z | command-log | Clean-checkout smoke recheck on ext4 source passed npm run check after the dashboard route fix; the preserved workspace full check passed 144 files / 947 tests in 29.59 s. A later /tmp/hadara synthetic clean checkout reached built doctor with npm run check passed, but failed because that dev-copy source omits .hadara/context. | passed | public | evidence.jsonl |
| 2026-06-25T13:05:04.977Z | command-log | Workspace dist was refreshed from Docker build output and built CLI version smoke reported packageVersion 0.3.4-rc.0 with distLooksStale false; git diff --check passed. | passed | public | evidence.jsonl |
| 2026-06-25T13:08:18.590Z | command-log | Task close validation for T-0421 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:e7ed90ada1cf3ae37b16d227bac4c5144a8dd5221f30754861e6e5746e9160f6. | passed | public | evidence.jsonl |
