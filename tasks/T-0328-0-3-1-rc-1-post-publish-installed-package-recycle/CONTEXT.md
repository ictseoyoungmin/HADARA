# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Confirms T-0327 publish state. | Done |
| docs/AGENT_HANDOFF.md | Current handoff into recycle. | Done |
| docs/TASK_BOARD.md | Task queue and status. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Done |
| docs/TEST_STRATEGY.md | Installed package consumer proof and temp-prefix guidance. | Done |
| docs/RELEASE_READINESS.md | Release/recycle status source. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.3.1-rc.1` is already visible on npm. | T-0327. | Recycle commands will fail or test stale package state if publish is not complete. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Prefer isolated temp-prefix installed-bin proof when PATH/npx cache is ambiguous. | Test Strategy. | Avoid mistaking stale global binaries for published package behavior. |
