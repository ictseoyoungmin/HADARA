# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Actor option parser accepts unsupported role values. | Reports could carry non-contract actor roles. | Low | Validate `--actor-role` against `HADARA_ACTOR_ROLES`. | Mitigated |
| Composed task complete report uses mixed actor contexts. | Multi-agent report attribution becomes confusing. | Medium | Pass the same actor into finish/ready/close/audit subreports. | Mitigated |
| Existing consumers depend on default actor values. | Compatibility regression. | Medium | Defaults are unchanged when actor flags are absent. | Mitigated |
