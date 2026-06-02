# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation could not run because Docker escalation is currently blocked by usage limit. | TypeScript/Vitest regressions may remain until the next approved Docker run. | Medium | Added focused tests and ran `git diff --check`; carry validation gap forward to T-0220. | Open |
| Refresh state is process-memory only. | Status resets when the dashboard server restarts. | Low | Local projection files remain the durable warm cache; T-0219 status is operational metadata only. | Accepted |
| T-0219 refresh only warms core projection. | Heavy sections may remain pending until later slices. | Medium | T-0221 owns timeline/debt projection materialization; status reports pending sections. | Open |
