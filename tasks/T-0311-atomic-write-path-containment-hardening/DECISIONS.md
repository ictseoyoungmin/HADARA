# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Enforce lexical project-root containment in the shared atomic text write helper. | Accepted | The helper now protects future call sites, including those that might pass user-derived relative paths. | T-0311 implementation/tests |
| D-2 | Keep npm publish and post-publish recycle out of T-0311. | Accepted | T-0310 completed readiness only; publish remains approval-gated and consumer recycle belongs after registry mutation. | T-0311 docs updates |
