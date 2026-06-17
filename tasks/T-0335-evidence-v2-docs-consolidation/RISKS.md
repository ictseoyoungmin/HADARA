# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Consolidation introduces contradictory wording. | Operators may choose wrong id or rebuild workflow. | Medium | Use the same canonical JSONL, non-canonical Markdown, durable `ev:`, and legacy inspection-only language across docs. | Mitigated |
| Docs imply deferred commands are implemented. | Users may expect unsupported rebuild/check-id/subject behavior. | Medium | Mark deferred items as future candidate scope and avoid command examples. | Mitigated |
| Source-string docs drift from generated tests. | Init/generated guidance may regress. | Low | Run focused docs tests and Docker sync-build. | Mitigated |
