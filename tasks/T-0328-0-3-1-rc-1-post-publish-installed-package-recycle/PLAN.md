# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Confirm T-0327 publish and npm registry visibility. | Done | T-0327 publish/tag evidence; `command:T-0328:published-cli-surface-recycle` |
| 2 | Run exact package consumer smokes. | Done | `npm view`, `npm dist-tag ls`, `npx`, and temp-prefix installed bin covered by `command:T-0328:published-cli-surface-recycle`. |
| 3 | Run fresh init/docs/migration/task-finish/lifecycle smokes in disposable projects. | Done | Published package command-family matrix covered by `command:T-0328:published-cli-surface-recycle`. |
| 4 | Record findings and residual environment issues. | Done | `FINDINGS.md`; `command:T-0328:published-cli-surface-recycle` |
| 5 | Update release readiness/state docs and close. | Done | Release readiness, Project State, Agent Handoff, Task Board, and lifecycle reports. |
