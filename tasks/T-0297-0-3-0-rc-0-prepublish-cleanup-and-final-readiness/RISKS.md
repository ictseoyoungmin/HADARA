# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README overclaims publish before the operator runs npm publish. | Users may try to install a not-yet-propagated version. | Medium | npm publish completed and registry verification returned `0.3.0-rc.0`. | Mitigated |
| Release evidence becomes stale after evidence/state-doc commits. | Strict release dry-run may block manual publish. | Medium | Final read-only release dry-run/publish dry-run passed from final clean commit before publish; npm registry verification passed after publish. | Mitigated |
| Duplicate bundle deletion removes a reference someone had open locally. | Temporary navigation churn. | Low | Canonical specs are unchanged under `docs/specs/0.3.0/`; the bundle was a copied staging artifact. | Mitigated |
| Published npm metadata lacks the new discovery fields. | npm search visibility for `0.3.0-rc.0` may stay lower than expected. | Medium | Treat as a follow-up for the next immutable npm version; verified package version and dist-tag are correct. | Open |
