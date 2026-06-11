# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0297 metadata context. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/TEST_STRATEGY.md`, and `docs/ROADMAP.md` reviewed. |
| 2 | Bump package/readiness/README references to `0.3.0-rc.1`. | Done | `package.json`, `package-lock.json`, `README.md`, and `docs/RELEASE_READINESS.md` edited. |
| 3 | Harden manual publish helper CLI selection and tarball metadata verification. | Done | `scripts/release/manual-publish-rc.sh` edited and covered by focused tests. |
| 4 | Run validation and tarball metadata smoke. | In Progress | Focused tests passed; full Docker check had one known dashboard parallel timeout and standalone dashboard-static passed. |
| 5 | Attach evidence and close the capsule. | Pending | TBD |
