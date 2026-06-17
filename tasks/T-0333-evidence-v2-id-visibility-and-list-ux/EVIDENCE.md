# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-17T09:34:23.689Z | command-log | Docker focused T-0333 suite passed: evidence-json, evidence-list, task-workflow-docs, command-registry, and init tests passed 5 files / 64 tests. | passed | public | evidence.jsonl |
| 2026-06-17T09:34:24.144Z | command-log | Docker full sync-build passed: npm run check returned 119 files / 791 tests, build passed, workspace dist refreshed, and version smoke reported distLooksStale:false. | passed | public | evidence.jsonl |
| 2026-06-17T09:34:23.689Z | command-log | Host focused validation blocked because host node_modules lacks vitest; Docker focused validation was used instead. | blocked | public | evidence.jsonl |
| 2026-06-17T09:34:24.138Z | command-log | Built CLI evidence list text and JSON smokes passed for T-0330; text output exposed [ev:id] and category/outcome, JSON exposed idSource/idStability/persistedSchemaVersion/category/outcome/tags; git diff --check passed. | passed | public | evidence.jsonl |
| 2026-06-17T09:34:58.705Z | command-log | Corrective evidence note: the focused validation pass supersedes the earlier blocked host-focused record ev:T-0333:1c6c383aa5144b6f8624005a; prior evidence appends were accidentally started in parallel, but all append reports returned ok:true and evidence lint will verify JSONL integrity. | passed | public | evidence.jsonl |
| 2026-06-17T09:41:22.891Z | command-log | Task close validation for T-0333 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:2fe0737f0343f92af1cd1b36275a13c7d349207f29ed5387214a5893e67436a8. | passed | public | evidence.jsonl |
