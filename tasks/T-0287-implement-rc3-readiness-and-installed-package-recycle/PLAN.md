# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read rc3 readiness spec and release/package surfaces. | Done | `docs/specs/rc3-proof-reliability/04_RC3_Readiness_and_Recycle.md`; release/readiness docs. |
| 2 | Update rc3 package metadata and release-facing docs. | Done | `package.json`, `package-lock.json`, README, release readiness, release notes. |
| 3 | Run build, focused tests, and full check. | Done | T-0287 command evidence. |
| 4 | Run package, clean-checkout, and fresh init/recycle smokes. | Done | T-0287 package/clean-checkout artifacts and command evidence. |
| 5 | Create clean checkpoint for release artifact builder. | In Progress | Dirty-worktree guard blocked release artifact as designed. |
| 6 | Refresh rc3 release artifact evidence and release dry-run. | Pending | Requires clean checkpoint. |
| 7 | Finalize capsule docs, finish, ready, close, audit, and final commit. | Pending | TBD |
