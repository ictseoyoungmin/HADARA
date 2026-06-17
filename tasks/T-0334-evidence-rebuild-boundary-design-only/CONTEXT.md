# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading rules. | Read |
| .hadara/context/HADARA_CONTEXT.md | Current-state routing guide. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task routing. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task loop, evidence, and dry-run boundaries. | Read |
| docs/DEVELOPMENT_SLICES.md | 0.3.2 slice order. | Read |
| docs/specs/0.3.2/02_Worker_Agent_Instructions.md | 0.3.2 worker routing. | Read |
| docs/specs/0.3.2/00_Evidence_v2_Refactor_Release_Design.md | Evidence v2 release design context. | Read |
| docs/specs/0.3.2/capsules/T-0334_Evidence_Rebuild_Boundary_Design_Only.md | T-0334 acceptance and constraints. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0334 is documentation-only. | Capsule spec | Runtime code changes would exceed scope. |
| Existing evidence migrate guidance remains separate from rebuild guidance. | CLI JSON contract | Conflating migrate/rebuild could imply unsupported broad rewrite behavior. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not add `evidence rebuild` command behavior. | T-0334 scope | Document future boundary only. |
| Do not rewrite existing evidence files. | T-0334 out of scope | Evidence changes must be append-only via writer commands. |
| Future rebuild must be dry-run-first and guarded before execute. | T-0334 required decision text | Keep aligned with HADARA write safety model. |
