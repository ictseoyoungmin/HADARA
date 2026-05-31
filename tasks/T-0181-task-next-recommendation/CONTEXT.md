# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current Phase 3.5 state and next task. | Read |
| docs/AGENT_HANDOFF.md | Validation baseline and active/next task marker. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path/status source. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, evidence, close, and Docker validation rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Primary next-task ordering source. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON command envelope expectations. | Read |
| docs/SCHEMAS.md | Schema registry and fixture posture. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Development Slices should be the primary source for planned phase order. | User requested `task next` to reduce reading slices/board/handoff manually. | Low; Task Board fallback remains available. |
| Missing planned capsules should be guidance, not mutation. | HADARA task creation already exists and should stay explicit. | Low; report includes `createCommand`. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `task next` is read-only. | Phase 3.5 scope and CLI contract. | No task creation, evidence append, or doc writes. |
| Recommendations are advisory. | Operators may override based on product priorities. | Output includes source/reason/requiredReading. |
