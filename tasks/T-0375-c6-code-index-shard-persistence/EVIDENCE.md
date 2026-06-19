# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-19T10:41:37.378Z | command-log | Focused Docker temp-workspace validation passed for code-index shard persistence tests: context-cache-store, context-graph-builder, context-graph-cli, and code-index. | passed | public | evidence.jsonl |
| 2026-06-19T10:41:45.520Z | command-log | Docker temp-workspace npm run build and npm run check passed after code-index shard persistence changes; 134 test files and 885 tests passed. | passed | public | evidence.jsonl |
| 2026-06-19T10:41:55.272Z | command-log | Built CLI smoke passed: version --verbose reports distLooksStale=false; context cache warm --json dry-run reports planned codeIndex shard at .hadara/local/cache/context/code-index.json. | passed | public | evidence.jsonl |
| 2026-06-19T10:42:05.373Z | command-log | Host npm run test:focused could not run because vitest was not installed in host node_modules; validation continued in Docker temp workspace per IMPLEMENTATION_SOP. | failed | public | evidence.jsonl |
| 2026-06-19T10:49:24.234Z | command-log | Resolved host-focused-test environment failure: Docker temp-workspace focused tests and full npm run check passed, so the host vitest absence is not a residual implementation blocker. | passed | public | evidence.jsonl |
| 2026-06-19T10:50:24.186Z | command-log | Task close validation for T-0375 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:676c75e8830dfd243724bc5b5edd1da7e3c62861c871e308993b9e9c47632c11. | passed | public | evidence.jsonl |
| 2026-06-19T10:51:03.512Z | command-log | git diff --check passed after T-0375 code-index shard persistence changes. | passed | public | evidence.jsonl |
| 2026-06-19T10:51:51.210Z | command-log | Task close validation for T-0375 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:2f08cb45b24f737f75e3270e53caddc692024ac79b7550e977979102d161888a. | passed | public | evidence.jsonl |
