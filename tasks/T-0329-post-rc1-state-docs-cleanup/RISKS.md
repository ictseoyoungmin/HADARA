# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Updating handoff before T-0329 close could make recent-task ordering confusing. | Medium | Medium | Explicitly record T-0329 as the latest cleanup task in final shared state and keep T-0328/T-0327 visible in the recent list. | Mitigated |
| Release notes could imply new release mutation. | Medium | Low | Word boundaries as completed historical facts for T-0326/T-0327/T-0328 while preserving deferred GitHub/Docker/PyPI/MCP boundaries. | Mitigated |
| Docs-only validation could be too weak if lifecycle checks are skipped. | Medium | Low | Run focused wording checks plus `task ready`, `task close`, and `task audit-close`. | Mitigated |
