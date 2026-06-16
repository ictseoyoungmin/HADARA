# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Confirms T-0326 readiness and next publish boundary. | Pending |
| docs/AGENT_HANDOFF.md | Current operator handoff for publish. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and release write serialization. | Pending |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit loop. | Pending |
| docs/RELEASE_READINESS.md | Release target, evidence, and publish boundary. | Pending |
| scripts/release/manual-publish-rc.sh | Approval-gated npm publish helper. | Pending |
| scripts/release/prepare-publish-env.sh | Optional clean publish clone helper. | Pending |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0326 has already prepared and validated `0.3.1-rc.1`. | T-0326. | Publish helper dry-run/gates may fail if T-0326 did not close cleanly. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Actual publish requires explicit operator confirmation. | Release policy. | Do not automate confirmation or load token values into committed docs. |
