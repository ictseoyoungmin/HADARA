# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-03T05:24:31.171Z | command-log | Focused Docker tests passed: dashboard-refresh, dashboard-task-projection, dashboard-static, and dashboard-refresh-measurement-script (4 files / 23 tests). Host focused run was unavailable because host vitest was not installed, so Docker baseline was used. | passed | public | evidence.jsonl |
| 2026-06-03T05:24:43.608Z | command-log | Docker full validation passed: npm run dev:docker-sync-build ran build, 91 test files / 592 tests, refreshed /workspace/dist, and built CLI version smoke returned ok true with distLooksStale false. | passed | public | evidence.jsonl |
| 2026-06-03T05:24:54.586Z | command-log | Built measurement smoke passed: node scripts/dashboard-refresh-responsiveness.mjs --project /workspace --samples 8 --compare-tmp --json returned ok true; workspace core p50/p95 during refresh 49.6/62.0 ms, task-signals processed increased, task-signals stage 3780 ms slow warning; tmp-ext4 core p50/p95 0.5/1.6 ms and task-signals 147 ms. | passed | public | evidence.jsonl |
| 2026-06-03T05:27:18.340Z | command-log | git diff --check passed after T-0226 implementation and documentation updates. | passed | public | evidence.jsonl |
| 2026-06-03T05:29:12.456Z | command-log | Task close validation for T-0226 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:eabdf907ab36999309ed42df237756be3d25404671629c99b14bd373e56183ce. | passed | public | evidence.jsonl |
| 2026-06-03T05:30:42.737Z | command-log | Task close validation for T-0226 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:dce09b5033f223c0acd4faeb2873f7457988eef45d46cb5ac4263e5a0fe9d109. | passed | public | evidence.jsonl |
