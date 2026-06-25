# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README suggests an unpublished package can be installed. | User confusion and failed installs. | Medium | Keep install commands on stable `0.3.3`; label `0.3.4-rc.0` as source candidate until publish capsule completes. | Mitigated in design |
| Release readiness accidentally mutates npm/GitHub/package targets. | Violates approval-gated release boundary. | Low | Use source/readiness, dry-run, smoke, and local artifact commands only; publish remains out of scope. | Open |
| `dist` reports stale package version after metadata change. | Built CLI/package smoke would be misleading. | Medium | Build in Docker and refresh `/workspace/dist` before built CLI validation. | Open |
