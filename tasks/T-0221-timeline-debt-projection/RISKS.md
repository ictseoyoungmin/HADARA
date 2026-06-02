# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation could not run because Docker escalation is currently blocked by usage limit. | TypeScript/Vitest regressions may remain until the next approved Docker run. | Medium | Added focused tests and ran `git diff --check`; carry validation gap forward to T-0222. | Open |
| Legacy `/api/timeline` and `/api/debt` still compute live reads. | Old consumers can still hit heavy request-time paths. | Medium | New Phase 5.7 routes are projection-first; frontend migration in T-0222 should switch consumers. | Open |
| Background refresh can still be slow on NTFS. | Refresh completion may lag after serve start. | Medium | Status route exposes missing/refreshing metadata; heavy work is off the new foreground route path. | Mitigated |
