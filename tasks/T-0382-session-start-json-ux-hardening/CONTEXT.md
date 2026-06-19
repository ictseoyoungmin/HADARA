# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact current-state read routing. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0382 next step. | Read |
| docs/TASK_BOARD.md | Task queue and T-0382 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and required reading. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/evidence workflow. | Read |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | Session Start contract. | Read |
| docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md | T-0382 scope and cleanup queue. | Read |
| src/context/session-start.ts | Runtime JSON builder and bounded fallback behavior. | Read |
| src/schemas/session-start.schema.json | Session Start schema fixture. | Read |
| tests/unit/session-start.test.ts | Focused Session Start behavior tests. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| No-task bounded Session Start can be degraded but should not be a command failure. | `hadara session start --json` is the documented default entry point. | If callers depended on exit 6 for missing task, they should use task-specific validation instead. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not add hidden live scans. | T-0378/T-0379/T-0381. | No-task output must route to `task next`, not run graph discovery. |
| Preserve additive JSON compatibility. | CLI JSON contract practice. | Add fields; do not remove existing arrays. |
