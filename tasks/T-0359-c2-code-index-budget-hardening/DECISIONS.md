# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Implement C6 default budget enforcement inside the internal code index builder, not as new public CLI flags. | Accepted | C6 lists flags as potential and says not to add all immediately; C2 needs default hardening before C3. | C2/C6 specs |
| D2 | Treat budget skips as warning-level degraded output instead of command failure. | Accepted | Spec requires partial output to be explicit, not fatal, unless there is an actual error. | C6 degraded-mode rule |
