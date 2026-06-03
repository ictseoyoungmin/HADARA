# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Table row summarization may omit useful secondary cells. | Overview cards may show less detail than the full table. | Medium | Prefer concise first meaningful cells for preview; full Detail document viewer still renders complete tables. | Accepted |
| Fast TUI status and full operations status could drift. | TUI `Next Recommended` could differ from dashboard/status output. | Low | Reuse `extractHandoffSectionValues()` for fast TUI status extraction. | Mitigated |
| Evidence preview fallback could duplicate semantic proof wording. | Selected-task proof already prefers shared proof when available. | Low | Evidence fallback only applies after shared proof/latest evidence paths. | Mitigated |
