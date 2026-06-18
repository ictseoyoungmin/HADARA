# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Status command still performs a source manifest discovery pass. | Mounted workspaces may still be slower than desired. | Medium | Kept it metadata-first, no content reads, and report budgets/degraded issues; next C6 slice should add warm/integration. | Accepted carry-forward |
| Adding store helpers without a public warm command may feel partial. | Cache cannot be populated by users yet. | Medium | Documented that C6.3 should add explicit warm dry-run/execute or graph integration using these helpers. | Accepted carry-forward |
| Cache schema evolves before graph/code-index integration. | Future work may need migrations. | Low | Keep schema additive and fixture-level; use cache version and schema ids. | Mitigated |
