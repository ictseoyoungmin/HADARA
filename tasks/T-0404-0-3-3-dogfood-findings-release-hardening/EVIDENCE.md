# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-22T09:16:40.168Z | command-log | Host focused validation could not run because host node_modules lacks vitest: npm run test:focused -- tests/unit/context-state-projection.test.ts tests/unit/workbench-next-actions.test.ts exited 127 with 'vitest: not found'. Docker validation is the HADARA-dev baseline for this workspace. | failed | public | evidence.jsonl |
| 2026-06-22T09:16:55.541Z | command-log | T-0404 focused Docker validation and built smokes passed: dev docker-check ran tests/unit/context-state-projection.test.ts and tests/unit/workbench-next-actions.test.ts, npm ci, Docker build, and guarded dist sync; git diff --check passed; built task status on PatternForge T-0022 returned closed-valid with only audit-close next action; built context pack on PatternForge T-0017 no longer reported STATE_TASK_BOARD_MISSING_ROW. | passed | public | evidence.jsonl |
| 2026-06-22T09:22:26.658Z | command-log | Task close validation for T-0404 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:402749e95d87ddd0fec229e84862b4051cc199f812ad25b6b3c16d2adf451aa9. | passed | public | evidence.jsonl |
