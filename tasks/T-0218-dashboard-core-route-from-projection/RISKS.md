# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation could not run because Docker escalation is currently blocked by usage limit. | TypeScript/Vitest regressions may remain until the next approved Docker run. | Medium | Added focused tests and ran `git diff --check`; carry validation gap forward to T-0219. | Open |
| Core task counts use Task Board rows rather than individual `TASK.md` files. | Counts can reflect Task Board drift until incremental projections exist. | Medium | This is intentional for request-path boundedness; T-0220 should add source-signal/incremental task projection reconciliation. | Open |
| Warm projection reads are not source-signal validated yet. | A changed Task Board may not invalidate `core/index.json` until background refresh work lands. | Medium | Projection responses mark freshness as `unknown`; T-0219/T-0220 should add refresh/source-signal semantics. | Open |
