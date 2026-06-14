# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Split stable readiness and publish into T-0315/T-0316. | Accepted | Release evidence and registry mutation should stay separate; T-0315 performs no publish. | Reviewer feedback; task scope. |
| D-2 | Treat stable `0.3.0` as source target until T-0316 publishes it. | Accepted | README/package docs must not claim stable publication before the operator-approved mutation. | README/release readiness updates. |
| D-3 | Keep `manual-publish-rc.sh` filename but generalize wording. | Accepted | The helper already publishes the current package version; renaming it is not required for stable readiness and would broaden scope. | Script wording updates. |
