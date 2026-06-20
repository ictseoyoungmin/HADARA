# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prepare `0.3.3-rc.0` instead of stable `0.3.3`. | Accepted | 0.3.3 changes context-routing and the default agent lifecycle enough to warrant rc recycle before stable promotion. | User request and T-0401 scope |
| D-2 | Keep publish mutation out of T-0401. | Accepted | Release readiness and approval-gated publish are separate HADARA boundaries. | T-0336 precedent |
| D-3 | Use a clean-worktree checkpoint before release artifact if needed. | Accepted | `release artifact --execute` refuses dirty worktrees by design. | T-0336 precedent |
