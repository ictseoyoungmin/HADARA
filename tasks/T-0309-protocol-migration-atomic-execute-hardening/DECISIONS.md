# Decisions

| ID | Decision | Rationale | Status |
|---|---|---|---|
| D-1 | Implement protocol migration execute as all-or-rollback across planned file writes. | `protocol migrate` is an adoption command; partial writes undermine before-hash trust. | Accepted |
| D-2 | Add common atomic text write helpers in `src/core/fs.ts`. | `docs mark` and protocol migration need the same temp+rename primitive. | Accepted |
| D-3 | Shift release readiness to T-0310 and post-publish recycle to T-0311. | User requested all reviewer hardening in T-0309 and later tasks renumbered. | Accepted |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
