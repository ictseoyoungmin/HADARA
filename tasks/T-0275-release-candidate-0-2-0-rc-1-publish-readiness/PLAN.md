# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project, workflow, release, test, and security docs. | Done | AGENTS, PROJECT_STATE, AGENT_HANDOFF, TASK_BOARD, IMPLEMENTATION_SOP, DEVELOPMENT_SLICES, TASK_WORKFLOW_COMMANDS, RELEASE_READINESS, RELEASE_NOTES, TEST_STRATEGY, SECURITY_MODEL. |
| 2 | Align package metadata, README, release docs, and manual publish helper examples to `0.2.0-rc.1`. | In Progress | `package.json`, `package-lock.json`, `README.md`, `docs/RELEASE_*`, `scripts/release/manual-publish-rc.sh`. |
| 3 | Remove accidental package self-dependency on the previous `hadara` RC. | In Progress | `package.json` and `package-lock.json`. |
| 4 | Build/validate in Docker and refresh workspace `dist`. | Pending | Focused release/schema tests and full sync-build. |
| 5 | Regenerate T-0275 package smoke, clean-checkout smoke, release artifact, release dry-run, and publish dry-run evidence without publish mutation. | Pending | T-0275 evidence records and artifacts. |
| 6 | Finish, close, audit, and update project handoff/state docs. | Pending | Task workflow reports. |
