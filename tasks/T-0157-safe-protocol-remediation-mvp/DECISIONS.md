# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Expose remediation as `hadara protocol remediate --fix <name> [--execute] --json`. | Accepted | Keeps doctor read-only and makes writes explicit. | T-0157 scope |
| D-2 | Limit MVP fixes to four allowlisted operations. | Accepted | Matches Phase 2 acceptance and avoids broad document rewriting. | Phase 2 plan |
