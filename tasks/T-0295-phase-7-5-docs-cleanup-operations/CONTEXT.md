# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/0.3.0/06_Phase_7_5_Docs_Cleanup_Operations.md | Binding Phase 7.5 scope and acceptance. | Read |
| docs/specs/0.3.0/implementation_guides/WORKER_AGENT_INSTRUCTIONS.md | Phase 7 worker guidance. | Read |
| docs/specs/0.3.0/implementation_guides/SPEC_AUTHORING_RULES.md | Phase 7 spec-authoring constraints. | Read |
| docs/specs/0.3.0/implementation_guides/README_UPDATE_INSTRUCTIONS.md | Phase 7 README/update guidance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 7.5 should not move or delete docs. | Phase 7.5 spec | Archive execution would exceed the planned dry-run cleanup boundary. |
| Status cleanup should be registry-first. | Phase 7.5 spec and T-0293 registry design | If registry is not authoritative, required-reading and doctor reports can drift. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not hand-edit evidence JSONL. | AGENTS.md / SOP | Evidence was recorded through `evidence add-command`. |
| Use Docker validation baseline for CLI work. | AGENTS.md / SOP | Direct Docker tsc, focused tests, and standard wrapper were used. |
| Finalize close-source docs before close execute. | AGENTS.md / TASK_WORKFLOW_COMMANDS.md | Capsule and tracked state docs are updated before ready/close. |
