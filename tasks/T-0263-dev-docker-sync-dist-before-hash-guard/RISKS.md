# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Stale workspace `dist` is overwritten by a concurrent Docker sync. | Multi-agent validation output may regress silently. | Medium | Require reviewed `--before-hash` to match the current workspace hash before sync. | Mitigated |
| Missing pre-sync hash is treated as reviewed state. | First-time sync can mask an unexpected missing artifact. | Medium | Block by default and require explicit `--allow-missing-before-hash`. | Mitigated |
| Guard changes break existing non-sync validation workflows. | Operators lose focused/full Docker validation path. | Low | Keep guard scoped to `--sync-dist`; no-sync reports retain `requiresBeforeHash:false`. | Mitigated |
| JSON contract drift. | External agents misread mutation/conflict state. | Medium | Update schema and docs, validate schema fixtures/focused tests. | Mitigated |
