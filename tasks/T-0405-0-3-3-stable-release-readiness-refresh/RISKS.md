# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Package-facing docs mention stable `0.3.3` before npm publish completes. | Readers may assume the registry has already been updated. | Medium | Release readiness and handoff explicitly state publish is pending and belongs to the next approval-gated capsule. | Active |
| Release artifact generation requires a clean worktree. | T-0405 edits must be committed before artifact execute can pass. | High | Run validation first, commit the readiness changes, then generate artifact evidence from the checkpoint. | Active |
| Host npm dependencies are unreliable on mounted workspace. | Host validation may fail for environment reasons. | Medium | Use `dev docker-check` as the source validation baseline. | Active |
