# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and active workflow guidance. | Done | `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/TASK_BOARD.md` |
| 2 | Confirm root launcher files are not active README/runtime/package entrypoints. | Done | Focused `rg` over README, docs, scripts, src, tests, tasks, package metadata, workflows, and examples. |
| 3 | Delete only the unused root bootstrap launchers. | Done | `START.bat`, `start.sh`, `hadara`, `hadara.cmd` removed. |
| 4 | Run focused cleanup validation. | Done | Reference search, `git diff --check`, package metadata check, and `/tmp` cache `npm pack --dry-run --json` passed. |
| 5 | Attach evidence and update handoff/state docs. | Done | `ev:T-0270:96f9665807e542c28b2a462b`; state docs updated. |
