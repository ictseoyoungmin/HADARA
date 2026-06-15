# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | T-0316 capsule exists and clearly owns stable `hadara@0.3.0` npm publish evidence. | Done | TASK.md / CONTEXT.md |
| AC-2 | README and release docs are staged so the npm package page reads as the stable release immediately after publish. | Done | README.md / docs/RELEASE_NOTES.md / docs/RELEASE_READINESS.md |
| AC-3 | Operator can run `npm login` and then one approval-gated helper command from the prepared source. | Done | HANDOFF.md |
| AC-4 | Helper output records npm publish completion and `npm view` verification for `hadara@0.3.0`. | Pending | Operator output / evidence |
| AC-5 | No npm credentials, auth URLs, token values, private logs, Docker/PyPI mutation, or installer mutation are committed. | In Progress | Pre-publish prep evidence; final review before close |
| AC-6 | T-0316 finish/ready/close/audit-close passes after publish evidence is attached. | Pending | Lifecycle reports |
