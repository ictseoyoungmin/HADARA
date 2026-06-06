# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project, workflow, release, test, and security docs. | Done | AGENTS, PROJECT_STATE, AGENT_HANDOFF, TASK_BOARD, IMPLEMENTATION_SOP, DEVELOPMENT_SLICES, TASK_WORKFLOW_COMMANDS, RELEASE_READINESS, RELEASE_NOTES, TEST_STRATEGY, SECURITY_MODEL. |
| 2 | Align package metadata, README, release docs, and manual publish helper examples to `0.2.0-rc.1`. | Done | `package.json`, `package-lock.json`, `README.md`, `docs/RELEASE_*`, `scripts/release/manual-publish-rc.sh`. |
| 3 | Remove accidental package self-dependency on the previous `hadara` RC. | Done | `package.json` and `package-lock.json`; package smoke passed. |
| 4 | Build/validate in Docker and refresh workspace `dist`. | Done | Focused Docker tests passed 8 files / 73 tests; feature-smoke focused test passed 1 file / 3 tests; Docker full check passed 100 files / 680 tests and refreshed `dist`. |
| 5 | Regenerate T-0275 package smoke, clean-checkout smoke, release artifact, release dry-run, and publish dry-run evidence without publish mutation. | Done | T-0275 evidence records and artifacts; release dry-run readiness `ready`, blockers 0, warnings 0. |
| 6 | Finish, close, audit, and update project handoff/state docs. | Done | `task finish --execute`, `task ready`, `task close --execute`, and `task audit-close` passed; project handoff/state docs are updated. |
