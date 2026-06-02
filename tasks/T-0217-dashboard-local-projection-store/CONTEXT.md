# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit workflow. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.7 ordering. | Read |
| docs/ARCHITECTURE.md | Runtime/local state boundary. | Read |
| docs/SECURITY_MODEL.md | Redaction and local/private storage constraints. | Read |
| docs/TEST_STRATEGY.md | Docker validation baseline and dashboard checks. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard read-model and cache contracts. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md | Phase 5.7 projection architecture. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The local dashboard projection store is disposable machine-local cache, not canonical project truth. | T-0217 TASK.md and Phase 5.7 redesign spec. | Later routes might accidentally treat cached bodies as authoritative. |
| Browser code must not write `.hadara/local/cache/dashboard`. | Dashboard authority model and browser storage boundary. | Frontend could create hidden project-state persistence. |
| Projection records should reject raw project-root paths at write time. | Redacted dashboard source contract from T-0206/T-0216. | Absolute paths could leak into ignored local files and later diagnostics. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep writes under `.hadara/local/cache/dashboard`. | T-0217 TASK.md. | Implemented with store-root and candidate-path checks. |
| Use atomic replacement for projection writes. | T-0217 TASK.md. | Implemented with temp file plus `renameSync`. |
| Do not add routes or frontend migration. | T-0217 TASK.md out of scope. | Deferred to T-0218 and T-0222. |
| Do not hand-edit JSONL evidence. | HADARA SOP. | Evidence JSONL should be written by CLI commands only. |
