# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5 ordering and T-0195 scope. | Read |
| docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md | Selected-task workbench consumer contract. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard selected-task evidence semantic contract. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_Development_Plan.md | Source plan for T-0195. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Dashboard can add a read-only evidence-lint API route for selected-task semantics. | T-0195 requires shared evidence lint semantics; existing `/api/evidence` remained evidence-list compatible. | If route naming changes later, UI/tests must update without changing proof derivation. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Proof status must use semantic issue codes and summary only. | Dashboard and workbench contracts. | No raw Markdown/JSONL proof parsing. |
| Private-only proof is warning, not blocker. | Evidence semantic contract. | UI wording and priority preserve this distinction. |
| Generated legacy ids are not durable identity. | T-0192 hardening. | Display identity caveat instead of persisting selected evidence ids. |
