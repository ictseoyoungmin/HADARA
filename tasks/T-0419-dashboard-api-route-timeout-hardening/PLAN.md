# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and confirm the publish-blocking dashboard test. | Done | `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md` |
| 2 | Keep `/api/status` cheap by excluding debt scans from the status route. | Done | `src/cli/dashboard.ts` |
| 3 | Make dashboard bootstrap default to the fast core tier while preserving explicit full bootstrap. | Done | `src/cli/dashboard.ts` |
| 4 | Update route tests for the new default tier and rerun focused dashboard validation. | Done | `ev:T-0419:e37deeb8c81f4c19a6bea6e2` |
| 5 | Refresh workspace `dist`, update handoff/state docs, and finalize the capsule. | Done | `ev:T-0419:b1f6d6d0181f402589a639fe`, `ev:T-0419:d0d48622b5b94495b1f0d2c2` |
