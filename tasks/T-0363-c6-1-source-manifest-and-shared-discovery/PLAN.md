# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and 0.3.3 C6/context-routing specs. | Done | Session read context plus C6 spec. |
| 2 | Add source manifest schema/types/helper functions. | Done | `src/context/source-manifest.ts`, schema registration, unit tests. |
| 3 | Run focused validation and full Docker sync-build. | Done | Focused Docker validation passed; full sync-build was attempted twice and failed on unrelated existing 5s timeouts; build-only dist refresh passed. |
| 4 | Attach evidence through `evidence add-command`. | Done | `ev:T-0363:72c3bfa638d94ac6b200b3de`, `ev:T-0363:0fc9286c6a1e45b0ac9b6c53`, `ev:T-0363:d1b2b1425c9b4d939f001d1c`, `ev:T-0363:9c3d5872e2194d2196f18705`, `ev:T-0363:b845f1b45c524d66b79e5936`, `ev:T-0363:aec3cd54336c4e0eb3b95fc7`. |
| 5 | Update shared docs and task handoff before finish/close. | Done | Project State, Agent Handoff, Task Board, Development Slices, schema docs, and task handoff updated. |
