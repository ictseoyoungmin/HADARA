# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-task-projection.ts` | Added | Incremental task projection index with file signals, changed/reused ids, and redacted local store writes. | Done |
| `src/services/dashboard-refresh.ts` | Updated | Refresh task projection before core projection during background refresh. | Done |
| `src/services/dashboard-core.ts` | Updated | Prefer task projection summaries when available; Task Board remains fallback. | Done |
| `tests/unit/dashboard-task-projection.test.ts` | Added | Focused coverage for unchanged reuse, changed-task reread, and redacted storage. | Done |
| `tests/unit/dashboard-refresh.test.ts` | Updated | Account for task projection participation in refresh completeness. | Done |
| `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | Updated | Document T-0220 task projection index. | Done |
| `docs/TEST_STRATEGY.md` | Updated | Add incremental task projection validation expectations. | Done |
| `tasks/T-0220-incremental-task-projection/*` | Updated | Record plan/context/acceptance/files/tests/risks/decisions/handoff for capsule closure. | In Progress |
