# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Operator publishes from a dirty or stale source state. | Registry package could diverge from reviewed readiness evidence. | Medium | Use helper clean-worktree guard and optional `prepare-publish-env.sh` clean clone. | Open |
| Token values leak into committed evidence. | Credential exposure. | Low | Use npm login/config outside committed files; helper records token presence/registry verification only. | Open |
| Exact npm version already exists. | npm package versions are immutable. | Low | Helper checks `npm view hadara@0.3.1-rc.1` before publish and exits if present. | Open |
