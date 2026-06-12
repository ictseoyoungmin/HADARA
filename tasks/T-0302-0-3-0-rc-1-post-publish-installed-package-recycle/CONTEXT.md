# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle close rules. | Read |
| T-0302 Task Capsule | Active recycle scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara-recycle` can be used as the disposable installed-package environment. | User request and running container. | If wrong, registry/package smoke evidence would need rerun in another clean environment. |
| `/tmp/hadara-recycle/0.3.0-rc.1/` can hold volatile dogfood projects. | User request. | If wrong, artifacts would need relocation. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not publish or mutate npm registry. | T-0302 scope. | Validation only. |
| Do not commit the full temp dogfood project tree. | Repository hygiene. | Keep only reduced reports/artifacts. |
| Record failures honestly. | AGENTS.md. | Fresh-init doctor friction is preserved in findings. |
