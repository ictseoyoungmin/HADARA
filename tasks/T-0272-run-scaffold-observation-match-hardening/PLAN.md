# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0271 findings. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, and T-0271 `FINDINGS.md` reviewed. |
| 2 | Change generated script matching to target fake-shell observation success metadata. | Done | `src/cli/run-scaffold.ts` uses `"status":"completed"` for step 2. |
| 3 | Add multiline stdout regression coverage. | Done | `tests/unit/run-cli.test.ts` exercises generated script through `runAgentLoop`. |
| 4 | Run focused Docker/temp-copy validation and built CLI smoke. | Done | Focused tests and `/workspace/dist` smoke passed. |
| 5 | Attach evidence and close capsule. | Done | Evidence attached; task ready, finish, close, audit-close, and complete passed. |
