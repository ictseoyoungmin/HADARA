# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5 ordering and T-0196 scope. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard timeline route/read-only contract. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_Development_Plan.md | Source plan for timeline read model. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A deterministic service report is enough for T-0196. | Phase 5 spec defers SSE/polling/telemetry. | Future streaming work must not reinterpret T-0196 as live. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No live stream, polling, or event persistence. | Phase 5 spec. | Timeline is read-only and generated from existing read models. |
| No private raw path exposure. | Dashboard security boundary. | Timeline uses sanitized evidence list records and omits local/private paths. |
