# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0646 |
| Title | 0.5.0 task-selection status v2 and selected-task cockpit |
| Status | Done |
| Created | 2026-07-18T17:13 |
| Updated | 2026-07-18T17:23 |
## Last Completed

| Item | Evidence |
|---|---|
| `hadara.taskSelection.status.v2` now exposes `selection.precedence`, selected source, source explanation, and primary action id. | ev:T-0646:4091d6b9b1e84fa2b10e67fb, ev:T-0646:f217cd7b34a54271b7467164 |
| `hadara.task.status.v2` now exposes public selected-task cockpit phases plus source phase, terminal, hidden section, close state, plan state, and validation metadata. | ev:T-0646:4091d6b9b1e84fa2b10e67fb |
| Focused schema/status tests, TypeScript build, and built CLI smoke passed. | ev:T-0646:4091d6b9b1e84fa2b10e67fb, ev:T-0646:a882339f0ff0418387c640d9, ev:T-0646:f217cd7b34a54271b7467164 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement 050-C05 public `session start` removal. | The 0.5.0 status ingress, task-selection v2, and selected-task cockpit pieces are now in place; remaining cleanup is removing the legacy session-start surface from docs and routing. | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| T-0646 adds required fields to v2 read-model schemas. | Consumers of `hadara.taskSelection.status.v2` and `hadara.task.status.v2` should validate against updated schemas rather than assuming the older shell shape. | Keep v1 compatibility explicit and use `hadara schema --domain task-selection-status --json` / `hadara schema --domain task-status --json` when updating clients. |
