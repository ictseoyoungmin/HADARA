# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README overclaims publish before the operator runs npm publish. | Users may try to install a not-yet-propagated version. | Medium | Keep `docs/RELEASE_READINESS.md` as source/publish-boundary detail; package README is prepared for npm page and final publish happens only through the helper. | Open |
| Release evidence becomes stale after evidence/state-doc commits. | Strict release dry-run may block manual publish. | Medium | Run final read-only release dry-run/publish dry-run from the final clean commit and instruct operator to use the manual helper from repo root. | Open |
| Duplicate bundle deletion removes a reference someone had open locally. | Temporary navigation churn. | Low | Canonical specs are unchanged under `docs/specs/0.3.0/`; the bundle was a copied staging artifact. | Mitigated |
