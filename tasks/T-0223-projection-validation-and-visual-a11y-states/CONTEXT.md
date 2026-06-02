# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current Phase 5.7 projection state and validation gaps. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, Docker/build blockers, and next-step constraints. | Read |
| docs/TASK_BOARD.md | T-0223 capsule status and queue placement. | Read |
| docs/IMPLEMENTATION_SOP.md | HADARA task/evidence/close workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Required ready/finish/close/audit-close sequence. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.7 slice order and Done evidence expectations. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Projection route contracts and visual-state expectations. | Read |
| docs/TEST_STRATEGY.md | Dashboard projection validation, visual/a11y, and Docker validation expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0216 through T-0222 projection features are already implemented. | Task Board and Project State. | Reimplementing projection services would exceed T-0223 scope. |
| Host dependencies and Docker visual validation are unavailable in this session. | Prior T-0217/T-0222 evidence plus T-0223 command results. | Actual Playwright/axe execution and static bundle rebuild must be carried forward as validation gaps. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep T-0223 focused on validation/visual-state locking. | TASK.md scope. | No new projection authority, mutation surface, or timing-sensitive unit thresholds. |
| Projection fixtures must be redacted and schema-gated. | Dashboard read-model contract and security boundary. | No raw project-root paths or private local state in committed fixtures. |
| Browser/dashboard state remains read-only. | TEST_STRATEGY and dashboard contract. | No browser storage, command execution, provider/MCP writes, or task/evidence mutation. |
