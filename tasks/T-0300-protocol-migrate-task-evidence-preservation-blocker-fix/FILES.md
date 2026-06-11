# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/protocol-migration.ts` | Modified | Make task evidence migration create-if-missing and skip existing evidence. | Done |
| `tests/unit/protocol-migration.test.ts` | Modified | Add regression proving existing evidence content survives dry-run and execute. | Done |
| `src/task/task-finish.ts` | Modified | Insert Done Status History rows inside the managed table before the end marker. | Done |
| `tests/unit/task-finish.test.ts` | Modified | Assert finish-generated Done rows stay inside the managed table. | Done |
| `tasks/T-0299-0-3-0-rc-1-protocol-migration-for-0-3-adoption/TASK.md` | Modified | Repair malformed Done Status History row. | Done |
| `tasks/T-0300-protocol-migrate-task-evidence-preservation-blocker-fix/TASK.md` | Modified | Repair malformed Done Status History row. | Done |
| `tasks/T-0299-0-3-0-rc-1-protocol-migration-for-0-3-adoption/HANDOFF.md` | Modified | Correct stale task-local handoff after T-0299 close. | Done |
| `tasks/T-0299-0-3-0-rc-1-protocol-migration-for-0-3-adoption/EVIDENCE.md` | Updated by command | Re-close T-0299 after close-source handoff edit. | Done |
| `tasks/T-0300-protocol-migrate-task-evidence-preservation-blocker-fix/*` | Modified | Record scope, validation, evidence, and handoff for this blocker fix. | In Progress |
