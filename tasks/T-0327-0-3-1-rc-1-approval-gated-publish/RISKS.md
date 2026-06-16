# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Operator publishes from a dirty or stale source state. | Registry package could diverge from reviewed readiness evidence. | Medium | Helper clean-worktree guard and container publish clone were used before the operator publish. | Mitigated |
| Token values leak into committed evidence. | Credential exposure. | Low | npm authentication stayed outside committed files; committed evidence records only reduced publish and registry facts. | Mitigated |
| Exact npm version already exists. | npm package versions are immutable. | Low | Helper checked `npm view hadara@0.3.1-rc.1` before publish and post-publish registry visibility confirmed the version. | Mitigated |
| RC was published with npm default `latest` dist-tag. | Default `npm install hadara` could resolve to rc1 instead of stable `0.3.0`. | High | Dist-tags were corrected and helper default rc tag is now `next` for future publishes. | Mitigated |
| npm dist-tag correction was blocked in an unauthenticated session. | T-0327 could not close until an authenticated operator corrected registry tags. | Medium | Blocked evidence `ev:T-0327:a675c6e0eb274859b8dc1d22` is resolved by `command:T-0327:npm-dist-tag-corrected`; next step is T-0328 installed-package recycle. | Mitigated |
