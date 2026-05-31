# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Agents keep using `test:unit -- <file>` and run more tests than intended. | Slower feedback and confusing evidence. | Medium | Add `test:focused` and explicit SOP warning. | Mitigated |
| Focused tests replace full validation. | Capsules could close without broad regression coverage. | Low | Docs say focused checks supplement full Docker validation; completion still ran sync-build. | Mitigated |
| Script drifts from docs. | Guidance becomes stale. | Low | Add unit test checking package script and docs. | Mitigated |
