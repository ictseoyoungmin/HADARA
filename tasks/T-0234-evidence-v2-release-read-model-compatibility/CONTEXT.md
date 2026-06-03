# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit loop. | Read |
| docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md | v2 writer/migration boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Release/smoke evidence attachment should not bypass canonical writer after T-0233. | T-0233 handoff and user direction. | New release evidence would stay v1 and undermine persisted ids. |
| Strict release gates must continue to accept existing v1 evidence. | Historical release evidence and tests. | Release readiness could regress for existing tasks. |
| Artifact directory names are part of the release evidence contract. | Existing tests and release docs. | Changing paths would break artifact validation and operator expectations. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No migration execute. | Evidence v2 plan. | Historical files are not rewritten in this capsule. |
| No UI work. | Current project handoff. | Dashboard/TUI remain paused. |
| Docker is the validation baseline. | Implementation SOP. | Host `node_modules` state is not relied on. |
