# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `hadara task finish/ready/close/audit-close` for T-0207 through T-0214 | Verify Phase 5.6 tasks are done and auditable. | Yes | Passed for all eight capsules. | `evidence.jsonl` |
| `hadara task status --task T-0215 --json` | Verify T-0215 workbench state before close. | Yes | To be covered by ready/close/audit workflow. | `evidence.jsonl` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker validation | No | This capsule is docs/status sync; Phase 5.6 validation evidence already exists. | Not rerun. | T-0214 evidence records full Docker and visual/a11y gate. |
| Security smoke | No | No security boundary changes in T-0215. | Not Run | N/A |
