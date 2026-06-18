# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close workflow. | Read |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | C1-C6 architecture and read-only constraints. | Read |
| docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md | Active C2 scope and code index contract. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Capsule sequence and validation expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| First C2 capsule should not add a public command. | C2 spec lists `code index` as a dedicated candidate and prefers additive graph options later. | Avoiding a CLI now means validation is through focused tests/schema runtime only. |
| Ignore/discovery can be implemented without import/export parsing. | Worker plan lists schema/ignore rules before import/export extraction. | If later extraction needs different metadata, this contract must remain additive. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Context routing commands/read models must be read-only projections. | Architecture overview and worker plan. | No file writes/cache writes from code index helpers in this capsule. |
| C2 first language scope is TypeScript and JavaScript. | Code Link Layer spec. | Other languages classify as unknown or are ignored unless explicitly in configured inputs. |
| Ignore generated/local/cache paths, and only future local cache paths may live under `.hadara/local/cache/context/`. | Code Link Layer spec. | Do not introduce `.hadara/cache/` or persistent cache writes here. |
