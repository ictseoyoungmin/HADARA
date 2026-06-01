# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Legacy ids remain line-fallback ids until v2 persisted ids exist. | Existing `resolves:<id>` markers can still change on reorder/delete. | Medium | Expose `idStability: unstable-on-reorder` and document v2 persisted ids. | Mitigated |
| Same-category failed resolution can still over-resolve within v1 records. | A later unrelated validation pass may hide an earlier validation failure. | Medium | Document as v1 compatibility-only and plan v2 subject/scope narrowing. | Tracked |
| Dry-run freshness checks are stricter than release gate checks. | Operators may see gate pass but dry-run fail. | Low | Document gate vs dry-run difference and keep dry-run issue summaries explicit. | Mitigated |
