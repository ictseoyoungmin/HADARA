# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/IMPLEMENTATION_SOP.md`, lifecycle spec. |
| 2 | Implement finalize evidence guidance and lazy report evaluation. | Done | `src/task/task-finalize.ts`, `src/task/task-ready.ts`, schema/test updates. |
| 3 | Run focused, full, built smoke, and diff validation. | Done | `ev:T-0399:c213cedb4cfe4d20a8858fd9`, `ev:T-0399:8aa7e7dc564e429393a1ea67`, `ev:T-0399:ac178da8a71f482a9d8e702a`, `ev:T-0399:cda485bcea7242448c0da511`. |
| 4 | Attach evidence, including failed first full-run timeout and resolving retry. | Done | `ev:T-0399:eba26dcf11c5461395d90965`, `ev:T-0399:8aa7e7dc564e429393a1ea67`. |
| 5 | Update capsule and shared handoff/state docs. | Done | This capsule, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/SCHEMAS.md`. |
