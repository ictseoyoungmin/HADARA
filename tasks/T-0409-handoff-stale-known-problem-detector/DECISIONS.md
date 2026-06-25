# Decisions

| ID | Decision | Reason |
|---|---|---|
| D-1 | Add `handoff stale-problems --json` as a separate read-only command instead of overloading `handoff update`. | Keeps write and advisory surfaces separate. |
| D-2 | Emit advisory candidates only; do not delete or patch rows. | Handoff known problems need human/coordinator review. |
| D-3 | Use conservative stale wording heuristics for task and version matches. | A row mentioning a completed task can still describe a valid residual problem. |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
