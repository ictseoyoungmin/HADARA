# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Boundary drift between raw slice and pack candidates. | Suggested commands can become misleading or unsafe. | Medium | Shared helper is used by both surfaces and covered by pack boundary tests. | Mitigated |
| Over-filtering public `.hadara` docs. | Compact context anchor or docs registry could disappear from pack candidates. | Low | Preserve explicit allowlist and test `.hadara/docs-registry.json` remains eligible. | Mitigated |
| Mounted/full Docker validation flake. | A transient timeout could obscure real regressions. | Medium | Record failed diagnostic evidence, rerun full sync-build, and resolve the failed evidence with the passing retry. | Mitigated |
