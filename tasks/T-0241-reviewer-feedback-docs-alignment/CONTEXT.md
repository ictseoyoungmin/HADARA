# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task workflow and remediation dry-run/write boundaries. | Read |
| docs/CLI_JSON_CONTRACT.md | Consumer contract for task-next, evidence migrate, and remediation outputs. | Read |
| docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md | Evidence v2 migration and Markdown frame policy. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Reviewer feedback describes accepted product boundaries. | User request and current docs. | If treated as new implementation scope, it would distract from release/package readiness. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No runtime code behavior changes. | User asked for document reflection. | Docs-only alignment. |
| Do not start historical evidence migration. | Evidence v2 plan and handoff. | Migration remains selected-task only. |
