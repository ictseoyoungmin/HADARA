# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and active Phase 8 context. | Done | AGENTS.md instructions; `docs/PROJECT_STATE.md`; `docs/AGENT_HANDOFF.md`; `docs/TASK_WORKFLOW_COMMANDS.md` |
| 2 | Remove persistent CloseState from generated HANDOFF scaffolds and validation policy. | Done | `src/task/task-capsule.ts`; `src/harness/validate.ts`; `src/services/state-projection.ts` |
| 3 | Repair recent Phase 8 handoff drift and update workflow/spec guidance. | Done | T-0320 through T-0325 `HANDOFF.md`; workflow docs; Phase 8 specs |
| 4 | Add regression coverage for handoff CloseState persistence and task capsule discovery leftovers. | Done | Focused tests updated |
| 5 | Run focused and full validation, then attach evidence. | Done | `command:T-0325:focused-docker`; `command:T-0325:full-docker-sync-build`; `command:T-0325:built-smokes`; `command:T-0325:diff-check` |
| 6 | Finalize shared state docs and prepare the capsule for ready/close/audit. | Done | `task finish`; shared state docs |
