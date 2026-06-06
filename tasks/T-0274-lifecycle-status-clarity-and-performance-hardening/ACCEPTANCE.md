# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Single-task lifecycle/evidence commands use direct task lookup instead of reading unrelated task capsule docs. | Complete | `tests/unit/task-finish.test.ts` direct lookup regression passed. |
| AC-2 | `task status` distinguishes current readiness from valid close proof without removing stable fields. | Complete | `tests/unit/task-workbench.test.ts` schema and readiness assertions passed. |
| AC-3 | `dev docker-check --json` failed-step diagnostics expose step id and exit code while omitting raw logs. | Complete | `tests/unit/dev-docker-check.test.ts` passed; built CLI smoke showed `temp-workspace exitCode=1` under sandboxed subprocess Docker. |
| AC-4 | Dashboard task-detail projection remains compatible with `hadara.task.workbench.v1`. | Complete | `npm run build` passed and `tests/unit/dashboard-static.test.ts` passed standalone. |
| AC-5 | Evidence and handoff are updated. | Complete | EVIDENCE.md, evidence.jsonl, and HANDOFF.md updated. |
