# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add a dedicated `profile` doctor scope instead of overloading `docs`. | Accepted | Profile drift remediation is narrower than full docs consistency and needs remediation objects even when docs-scope remains warning-oriented. | T-0156 plan |
| D-2 | Emit manual remediation entries only. | Accepted | T-0156 is a guide; safe-auto execution belongs to T-0157. | Phase 2 plan |
