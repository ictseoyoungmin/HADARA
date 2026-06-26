# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat the T-0422 package-recycle helper residual as a stable blocker and fix the helper before stable `0.3.4` readiness. | Accepted | A 73-180s failing default graph smoke plus source-workspace smoke capsule leakage conflicts with Agent UX Hardening goals. | Reviewer feedback; T-0422 evidence |
| D-2 | Make the default package recycle profile the fast installed-agent UX path and move broad context graph to explicit opt-in. | Accepted | Default release recycle should prove installed version/help/init/session/lifecycle/finalize/context-pack/context-slice cleanup without hidden broad reads. | Reviewer feedback; 0.3.4 Agent UX spec |
