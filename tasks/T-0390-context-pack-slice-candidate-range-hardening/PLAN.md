# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and inspect the context pack/slice candidate path. | Done | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_WORKFLOW_COMMANDS.md`; source inspection. |
| 2 | Change context pack explicit-range slice candidates to use a bounded source window when no real end-line exists. | Done | `src/context/context-pack.ts`, `tests/unit/context-pack.test.ts`. |
| 3 | Run focused and full Docker validation. | Done | `ev:T-0390:d6ab0cb842d3479faf06b351`, `ev:T-0390:3696103d7d274411b7cc706f`. |
| 4 | Attach evidence. | Done | Evidence appended through `hadara evidence add-command`. |
| 5 | Update capsule, contract, and shared state docs before finish/close. | Done | This capsule and shared docs. |
