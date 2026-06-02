# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Static dashboard bundle could not be rebuilt because host esbuild is missing and Docker escalation is blocked. | Served HTML may not yet reflect authored source changes. | High | Carry to T-0223; run dashboard build/Docker validation when dependencies or approval are available. | Open |
| Full Docker validation could not run because Docker escalation is currently blocked by usage limit. | TypeScript/Vitest regressions may remain until the next approved Docker run. | Medium | Added static source expectation and ran `git diff --check`; carry validation gap forward to T-0223. | Open |
| Timeline backfill only updates when projection has events. | Missing projection leaves activity empty until refresh completes. | Medium | Projection status and T-0223 visual states should label missing/stale honestly. | Open |
