# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading. | Read |
| docs/PROJECT_STATE.md | Current Phase 4 evidence state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0190 next step. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit loop. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 4 slice order. | Read |
| docs/SCHEMAS.md | Evidence schema posture. | Read |
| docs/TEST_STRATEGY.md | Evidence validation constraints. | Read |
| docs/specs/evidence/EVIDENCE_PHASE4_REFACTOR_PLAN.md | Local ignored Phase 4 design detail. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0190 should design v2 writer/migration but not implement it. | docs/DEVELOPMENT_SLICES.md | Implementation scope could rewrite evidence too early. |
| v2 migration must be dry-run-first and per-task before broad migration. | HADARA write safety pattern | Bulk migration could corrupt evidence history. |
| Existing v1 evidence remains valid during and after this capsule. | Phase 4 compatibility-first plan | Readers could break historical capsules. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No automatic `evidence.jsonl` rewrite. | Phase 4 scope | Plan explicitly forbids it. |
| No automatic `EVIDENCE.md` rewrite. | Phase 4 scope | Markdown frame changes require separate task. |
| No init/MCP/release/UI expansion. | Phase 4 scope | Keep design boundaries narrow. |
