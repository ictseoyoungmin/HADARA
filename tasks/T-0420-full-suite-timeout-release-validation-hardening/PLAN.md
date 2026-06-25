# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current handoff/task board and inspect the attached timeout log. | Done | `docs/AGENT_HANDOFF.md`, attachment timeout log |
| 2 | Align dashboard bootstrap service default with the fast `core` first-paint path. | Done | `src/services/dashboard-bootstrap.ts` |
| 3 | Make Vitest release-validation timeout explicit and env-overridable. | Done | `vitest.config.ts` |
| 4 | Run the failed test set and full suite in Docker ext4 validation copy. | Done | `ev:T-0420:6fc1e031e0d243c3971bc44d`, `ev:T-0420:80ee3d2f4d09409c9c3651b9` |
| 5 | Refresh `dist`, update state docs, finalize, and commit. | Done | `ev:T-0420:68733ec5e4d24f3f8e43de31`, `ev:T-0420:83a365b861bf4336ba5f2b09` |
