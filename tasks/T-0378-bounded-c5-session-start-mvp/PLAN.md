# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C3/C5/C6 specs. | Done | Current session read `.hadara/context/HADARA_CONTEXT.md`, state/handoff/board/SOP/workflow docs, and context-routing specs. |
| 2 | Define the bounded Session Start report contract and CLI route. | Done | Added `hadara.sessionStart.v1`, `hadara session start`, default bounded no-live mode, and explicit `--live`. |
| 3 | Add focused service/CLI/schema tests proving read-only composition. | Done | Covered by Docker validation `ev:T-0378:b3e1cc3b1b6d44b4a68c9bf0`. |
| 4 | Run focused Docker validation, sync `dist`, and built CLI smoke. | Done | Docker sync-build `ev:T-0378:2c321128b97c4efda50ee1ba`; built smoke `ev:T-0378:dd42b8f8ded34d988a2090a1`. |
| 5 | Attach evidence, update state docs, finish/ready/close. | Done | Evidence lint `ev:T-0378:59772865b91049d6b79fa3ce`; shared state docs updated before finish/ready/close. |
