# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 7.6 spec. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/specs/0.3.0/07_Phase_7_6_0_3_0_Release_Hardening_and_Installed_Package_Recycle.md` |
| 2 | Audit Phase 7.0-7.5 completion and decide version/release-candidate handling. | Done | T-0289 through T-0295 are closed/audited; `package.json` is `0.3.0-rc.0` source candidate. |
| 3 | Update README and release notes for implemented 0.3.0 surface and boundaries. | Done | `README.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| 4 | Run full build/test/Docker baseline. | Done | Docker sync build evidence: 115 files / 741 tests, `distLooksStale=false`. |
| 5 | Run package smoke, clean-checkout smoke, installed-package recycle, fresh-init profile smokes, docs/managed/cleanup smokes, release dry-run, and publish dry-run. | In Progress | Package smoke, Docker clean-checkout smoke, and installed recycle passed; release artifact/dry-run/publish dry-run still pending clean worktree. |
| 6 | Self-review, fix findings, update state docs, finish/ready/close/audit, and commit. | Pending | close evidence |
