# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and 0.3.4 Agent UX spec. | Done | `.hadara/context/HADARA_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md` |
| 2 | Define the recycle capsule around installed-package consumer proof for `hadara@next`. | Done | T-0422 capsule docs |
| 3 | Run `hadara package recycle --execute --package hadara@next --expected-version 0.3.4-rc.0 --task T-0422 --attach-evidence --json`. | Done | Failed on the helper's extra `context graph --json` smoke; evidence `ev:T-0422:158cb7ac06f94b00a09fda08`, `ev:T-0422:ba22c58572db4b3c8c3288da` |
| 4 | Confirm registry tags, installed version/help/init/task/context/session smokes, and cleanup from the package recycle report. | Done | Manual acceptance smoke passed; evidence `ev:T-0422:f32c692a502c49d494970f4d` |
| 5 | Update acceptance/tests/evidence/handoff and shared state docs for the completed recycle. | Done | `ev:T-0422:ed2802b97d3d44ec9474890f` |
| 6 | Finalize the task with `task lifecycle` / `task finalize`. | Pending | TBD |
