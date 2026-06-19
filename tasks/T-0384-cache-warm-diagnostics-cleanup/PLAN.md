# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and cache implementation context. | Done | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `src/context/context-cache-store.ts` |
| 2 | Add additive cache diagnostics for missing/stale/corrupt/partial states. | Done | `src/context/context-cache-store.ts` |
| 3 | Add schema and unit coverage for diagnostics. | Done | `src/schemas/context-cache-*.schema.json`, `tests/unit/context-cache-store.test.ts` |
| 4 | Run validation and built CLI smoke. | Done | `ev:T-0384:5cf534a97e2c4ff7a8355fd6` |
| 5 | Attach evidence and update handoff/shared state. | Done | `ev:T-0384:5cf534a97e2c4ff7a8355fd6` |
