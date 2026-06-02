# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation could not run in this turn because escalation was rejected by usage limit. | TypeScript or Vitest regressions may remain until the next approved Docker run. | Medium | Added focused tests and ran `git diff --check`; carry the validation gap forward explicitly. | Open |
| Later route slices may accidentally treat local projections as canonical truth. | Dashboard could display stale or incomplete state without freshness metadata. | Medium | Store records are documented as disposable cache; T-0218 should serve `hadara.dashboard.core.v1` freshness/completeness metadata. | Open |
| Projection body writers could try to store absolute paths. | Local cache could leak machine-specific paths. | Low | Store rejects serialized raw project-root paths before writing. | Mitigated |
