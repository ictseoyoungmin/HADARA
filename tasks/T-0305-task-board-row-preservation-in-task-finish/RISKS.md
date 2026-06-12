# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Markdown table parsing broadens unexpectedly. | Could affect unrelated docs readers. | Medium | Kept the new row splitter local to `task finish` and added focused regressions. | Mitigated |
| Preserving raw human cells conflicts with normalized row formatting. | Minor visual churn in Task Board rows. | Low | Preserved content and restored existing empty-final-cell formatting. | Mitigated |
| Workspace built CLI becomes stale after TypeScript changes. | Built smoke could test old behavior. | Medium | Docker build refreshed `/workspace/dist`; built CLI smoke passed. | Mitigated |
