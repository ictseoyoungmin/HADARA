# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Compose `task close --json` dry-run and `task audit-close --json` instead of adding an independent close-proof parser. | Accepted | Keeps repair classification aligned with existing source/report hash and close-evidence semantics. | `ev:T-0394:f0875b6093844de1ac01053e` |
| D-2 | Return exact `nextActions` and one `primaryNextAction`, but keep the command read-only. | Accepted | Agents get actionable repair guidance without hidden lifecycle writes. | `ev:T-0394:a32fcb73ccde4179a56cc267` |
| D-3 | Use a new additive schema id, `hadara.task.closeRepairPlan.v1`. | Accepted | Consumers can distinguish repair diagnostics from the general lifecycle report. | `ev:T-0394:8c47406cc61a4314bde168b0` |
