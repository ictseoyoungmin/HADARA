# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C1 context-routing specs. | Done | Read HADARA context, PROJECT_STATE, AGENT_HANDOFF, TASK_BOARD, C1 spec, worker plan, and docs/RELEASE_READINESS.md. |
| 2 | Document T-0349 scope and file plan. | Done | TASK.md, CONTEXT.md, FILES.md updated before implementation. |
| 3 | Implement release readiness extractor and focused tests. | Done | `src/context/release-extractors.ts`; `tests/unit/context-graph-release-extractors.test.ts`. |
| 4 | Run focused Docker tests, full Docker check, build, dist refresh, and diff check. | Done | `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |
| 5 | Record evidence and update capsule/shared close-source docs. | Done | `ev:T-0349:95e6ccd6f23244d7b4f5f85e`; close-source docs updated. |
| 6 | Finish, ready, close, audit-close, and commit T-0349. | Pending | TBD |
