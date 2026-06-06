# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current Phase 6.1/RC state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0274 carry-forward context. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and validation expectations. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle command semantics and status `ok` interpretation. | Read |
| tasks/T-0271-npm-installed-toy-project-interface-recycle/FINDINGS.md | Source findings for rc.1 hardening. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0271 findings should be fixed before 0.2.0-rc.1. | User request. | Leaving ambiguity would weaken the published package interface. |
| `task status` must keep existing stable fields. | Schema compatibility rules. | Removing or repurposing `state.ready` would break consumers. |
| JSON Docker diagnostics must not include raw logs or private paths. | Existing privacy contract. | Debug detail must stay bounded and redacted. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Work remains inside T-0274. | AGENTS protocol. | Commit after capsule close. |
| Use Docker workflow for build/test validation. | HADARA-dev guidance. | Host node_modules is incomplete. |
| Do not expose secrets or private subprocess logs. | Security/privacy model. | Diagnostics add exit code and hint only. |
