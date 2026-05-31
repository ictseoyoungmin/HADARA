# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docker-mounted workspace reports git dubious ownership. | Runtime report loses branch/head in the main validation environment. | Medium | Use per-command `git -c safe.directory=<projectRoot>` without mutating global git config. | Mitigated |
| Runtime report is mistaken for a build command. | Operators may expect it to refresh stale dist. | Low | Document read-only boundary and defer sync-build to T-0179. | Mitigated |
