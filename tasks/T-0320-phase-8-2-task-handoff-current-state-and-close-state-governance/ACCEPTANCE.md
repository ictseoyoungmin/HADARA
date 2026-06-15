# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | New handoff scaffold separates TaskStatus and CloseState or documents a compatibility path. | Done | `src/task/task-capsule.ts`; `tests/unit/task-capsule.test.ts`; `command:T-0320:docker-focused` |
| AC-2 | Done-level validation detects stale `pending lifecycle close` handoff wording. | Done | `tests/harness/harness-validate.test.ts`; `command:T-0320:docker-focused` |
| AC-3 | Done-level validation detects `PLAN.md` rows still marked `In Progress` after task status is Done. | Done | `tests/harness/harness-validate.test.ts`; `tests/unit/task-ready.test.ts`; `command:T-0320:docker-focused` |
| AC-4 | Validation issues include path and fixHint. | Done | `src/harness/validate.ts`; focused regression assertions; `command:T-0320:docker-focused` |
| AC-5 | Focused tests or explicit constraints are recorded. | Done | `TESTS.md`; `command:T-0320:docker-focused`; `command:T-0320:docker-full-sync-build` |
| AC-6 | Evidence is attached. | Done | `command:T-0320:docker-focused`; `command:T-0320:docker-full-sync-build`; `command:T-0320:repo-docs-harness-checks` |
| AC-7 | Handoff is updated. | Done | `HANDOFF.md`; shared state docs route next work to Phase 8.3. |
