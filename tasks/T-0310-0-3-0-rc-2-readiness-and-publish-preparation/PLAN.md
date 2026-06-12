# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs, rc.2 plan, release readiness docs, and active capsule docs. | Done | Required reading completed before edits. |
| 2 | Align package metadata, README, release notes/readiness docs, helper examples, and T-0310 capsule docs with rc.2. | Done | package/readiness docs target rc.2 while README install examples stay on published rc.1. |
| 3 | Run full Docker/check validation and refresh workspace `dist`. | Done | `npm run dev:docker-sync-build` passed 117 files / 758 tests; workspace built CLI reports `0.3.0-rc.2`. |
| 4 | Run package smoke, clean-checkout smoke, release artifact, strict gate, release dry-run, publish dry-run, manual helper guard, and extra rc.2 workflow smokes. | Done | Release artifact, package smoke rerun, Docker clean-checkout smoke rerun, strict gate, dry-run, publish dry-run, helper guard, and workflow smokes passed. |
| 5 | Attach evidence through canonical evidence writer. | Done | Release artifact/package/clean smoke attach-evidence plus command-log summaries recorded. |
| 6 | Update acceptance/tests/handoff and shared state docs. | In Progress | Capsule docs and shared state docs being finalized before finish/close. |
| 7 | Finish, ready, close, audit, and commit T-0310. | Pending | TBD |
