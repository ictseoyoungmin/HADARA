# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Package-facing docs mention stable `0.3.3` before npm publish completes. | Readers may assume the registry has already been updated. | Medium | Release readiness and handoff explicitly state publish is pending and belongs to the next approval-gated capsule. | Carry Forward |
| Release artifact generation requires a clean worktree. | T-0405 edits must be committed before artifact execute can pass. | High | Checkpoint commit `ed551eb` was created, then release artifact evidence was generated from that commit. | Mitigated |
| Host npm dependencies are unreliable on mounted workspace. | Host validation may fail for environment reasons. | Medium | Used Docker validation, package smoke, clean-checkout smoke, and release gates instead of host test dependencies. | Mitigated |
| Publish helper dry-run needs npm login. | The helper stops at npm `whoami` until the operator logs in. | High | Carry to the next approval-gated publish capsule; no publish mutation ran in T-0405. | Carry Forward |
