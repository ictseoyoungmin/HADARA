# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current Phase 3.5 state and active task. | Read |
| docs/AGENT_HANDOFF.md | Current validation baseline and known runtime/build caveats. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path/status source. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, Docker validation, evidence, and handoff rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 3.5 capsule ordering through T-0183. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON command contract expectations. | Read |
| docs/SCHEMAS.md | Schema registration and fixture posture. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `task finish` should stay conservative. | Operator feedback requested bounded sync first. | Low; broader writes are explicitly advisory. |
| Evidence/close should remain separate. | Existing task close fixed-point model. | Medium if collapsed into finish; avoided in this capsule. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Execute writes are limited to `TASK.md` status and `docs/TASK_BOARD.md` row status/path. | User request and Phase 3.5 scope. | `DEVELOPMENT_SLICES`, `PROJECT_STATE`, and `AGENT_HANDOFF` remain advisory/manual. |
| Docker workflow is preferred for validation. | AGENTS.md and handoff note host dependencies are unavailable. | Use `dev:docker-check` / `dev:docker-sync-build`. |
