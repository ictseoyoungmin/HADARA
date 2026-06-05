# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/lifecycle-next-actions.ts` | Add | Shared helper for Phase 6 lifecycle actor and structured next-action metadata. | Done |
| `src/task/task-finish.ts` | Update | Add actor, nextActions, and primaryNextAction to finish reports. | Done |
| `src/task/task-ready.ts` | Update | Add actor, structured next actions, `finish-first`, `refresh-evidence`, and primary action metadata. | Done |
| `src/task/task-close.ts` | Update | Add actor, structured close actions, and audit-close `close-first` metadata. | Done |
| `src/schemas/task-finish.schema.json` | Update | Require additive actor/nextActions fields. | Done |
| `src/schemas/task-ready.schema.json` | Update | Require additive actor/nextActions fields. | Done |
| `src/schemas/task-close.schema.json` | Update | Require additive actor/nextActions fields. | Done |
| `src/schemas/task-audit-close.schema.json` | Update | Require additive actor/nextActions fields. | Done |
| `tests/unit/task-finish.test.ts` | Update | Assert finish primary action metadata. | Done |
| `tests/unit/task-ready.test.ts` | Update | Assert ready actor and `finish-first` metadata. | Done |
| `tests/unit/task-close.test.ts` | Update | Assert close/audit actor and structured metadata. | Done |
