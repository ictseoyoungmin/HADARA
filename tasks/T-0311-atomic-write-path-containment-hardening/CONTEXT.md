# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact current-state read routing and operating rules. | Read |
| docs/PROJECT_STATE.md | Current project state and rc.2 publish boundary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, latest validation baseline, and next recommended publish step. | Read |
| docs/TASK_BOARD.md | Task queue and T-0311 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, Docker validation, and close-source rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit command semantics. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and T-0311/T-0312 numbering. | Read |
| docs/SECURITY_MODEL.md | Project-root write containment invariant. | Read |
| docs/specs/0.3.0/rc2/HADARA_0.3.0-rc.2_Workflow_UX_Hardening_Plan.md | rc.2 capsule sequence and post-publish recycle plan. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0310 release readiness full validation is complete and remains the release baseline. | docs/AGENT_HANDOFF.md | Duplicating full readiness in this focused hardening capsule would be unnecessarily broad. |
| npm publish has not been approved or executed. | docs/AGENT_HANDOFF.md | Post-publish recycle cannot start until rc.2 is visible on npm. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Shared atomic writes must stay inside `projectRoot`. | docs/SECURITY_MODEL.md | Use resolved path containment before temp file creation. |
| Workspace built CLI should be refreshed after CLI/core changes. | docs/IMPLEMENTATION_SOP.md | Run Docker validation/build and sync `dist`. |
