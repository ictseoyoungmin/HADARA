# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read Phase 6 T-0256 spec and task workflow docs. | Done | Required reading completed before implementation. |
| 2 | Add optional evidence v2 idempotency/tag/actor metadata support. | Done | `src/evidence/evidence.ts` and evidence JSON tests. |
| 3 | Add close evidence write idempotency planning and execute no-op behavior. | Done | `src/task/task-close.ts` and task-close tests. |
| 4 | Add audit metadata for latest non-superseded proof, superseded ids, duplicate count, and verdict. | Done | `src/task/task-close.ts` and task-close tests. |
| 5 | Update schemas and operator docs. | Done | Task close/audit schemas, CLI contract, workflow docs, and schema docs. |
| 6 | Run Docker validation and built CLI smokes. | Done | Docker sync-build passed; built close/audit smokes exercised T-0255 changed-source behavior. |
| 7 | Update shared state and capsule docs before close. | Done | Project State, Development Slices, Agent Handoff, and T-0256 capsule updated. |
