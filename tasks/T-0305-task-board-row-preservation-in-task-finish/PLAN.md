# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and rc2 T-0305 spec. | Done | Required docs plus `docs/specs/0.3.0/rc2/HADARA_0.3.0-rc.2_Workflow_UX_Hardening_Plan.md` read. |
| 2 | Update `task finish` Task Board row planning so only ID/title/status/capsule are command-owned. | Done | `src/task/task-finish.ts` preserves `Notes` and extra cells. |
| 3 | Add focused regression tests for Notes, extra cells, escaped pipes, title sync, capsule sync, and generated title pipe sanitization. | Done | `tests/unit/task-finish.test.ts`. |
| 4 | Update workflow docs with the Task Board ownership policy. | Done | `docs/TASK_WORKFLOW_COMMANDS.md` and generated init docs updated. |
| 5 | Run focused Docker validation, build/dist refresh, built CLI smoke, and diff check. | Done | Evidence `ev:T-0305:1c0b3d64e7354e098c26e53e`. |
| 6 | Attach evidence, finish, update shared docs, ready, close, audit, and commit. | In Progress | Evidence attached; finish/close workflow pending. |
