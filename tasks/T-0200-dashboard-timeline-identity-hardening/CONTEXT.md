# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.5 T-0200 scope and ordering. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Timeline identity and evidence semantics guidance. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_5_Production_Development_Plan.md | T-0200 source plan and acceptance criteria. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Normalized evidence identity metadata exists. | T-0192 added `idSource`, `idStability`, `sourceLine`, and `fingerprint`. | If absent, timeline would fall back to display ids. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not claim durable identity for legacy ids. | Evidence semantics hardening contract. | Event metadata exposes `unstable-on-reorder`. |
