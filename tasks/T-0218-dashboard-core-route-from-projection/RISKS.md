# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation was previously blocked. | TypeScript/Vitest regressions could have remained before the follow-up validation window. | Medium | Docker sync-build passed 90 files / 582 tests with built CLI smoke `ok:true`; validation gap is closed for this follow-up. | Closed |
| Core task counts use Task Board rows rather than individual `TASK.md` files. | Counts can reflect Task Board drift until incremental projections exist. | Medium | This is intentional for request-path boundedness; T-0220 should add source-signal/incremental task projection reconciliation. | Open |
| Warm projection reads are not source-signal validated yet. | A changed Task Board may not invalidate `core/index.json` until background refresh work lands. | Medium | Projection responses mark freshness as `unknown`; T-0219/T-0220 should add refresh/source-signal semantics. | Open |
| Core route no-scan tests do not prove the whole server event loop stays unblocked. | A separate serve-start refresh can still delay `/api/dashboard/core` even if the route handler itself does not scan capsules. | Medium | T-0219 follow-up changed serve-start warmup to delayed core-only refresh; manual heavy refresh still needs future cooperative chunking/offload. | Mitigated |
