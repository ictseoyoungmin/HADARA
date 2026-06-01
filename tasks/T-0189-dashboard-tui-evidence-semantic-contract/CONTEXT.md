# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading. | Read |
| docs/PROJECT_STATE.md | Current Phase 4 evidence state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0189 next step. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit loop. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 4 slice order. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard read model contract. | Read |
| docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md | Selected-task workbench/TUI contract. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Dashboard/TUI should consume semantic read surfaces, not raw evidence files. | Phase 4 plan and T-0175 contract | UI layers could diverge from CLI semantics. |
| T-0189 should be contract-only. | docs/DEVELOPMENT_SLICES.md | UI/API scope would make this slice too broad. |
| Proof status can be specified as consumer derivation before inlining into workbench JSON. | T-0187/T-0188 surfaces | Consumers need guidance before additive workbench fields exist. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No Dashboard/TUI rendering. | T-0189 scope | Contract docs only. |
| No evidence writer/migration. | Phase 4 scope | T-0190 handles writer/migration planning. |
| No private path exposure. | Security model | Contract tells consumers not to reveal private paths. |
