# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Close/evidence fixed-point redesign belongs in v1 planning docs. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Evidence JSONL may be hand-edited by agents today. | T-0164 `kind: harness` drift incident. | Lint must be available before close. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Evidence lint is read-only. | Reviewer guidance. | No evidence repair writes in T-0165. |
| Schema remains fixture-level additive. | docs/SCHEMAS.md. | New lint schema should not become a release gate. |
