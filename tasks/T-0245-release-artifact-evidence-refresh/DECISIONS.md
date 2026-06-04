# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Commit scaffold/scope before running release artifact refresh. | Accepted | The artifact command intentionally refuses dirty worktrees, and the capsule scaffold is a tracked worktree change. | T-0243 guard; T-0245 risk register |
| D-2 | Refresh only release artifact evidence in this capsule. | Accepted | Current release dry-run already reports package-smoke and clean-checkout smoke evidence as passed. | T-0244 built release dry-run smoke |
| D-3 | Preserve no-publish release boundary. | Accepted | This capsule updates evidence freshness only, not registry or deployment state. | Release readiness docs |
