# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README or release-readiness wording drifts from release gate markers. | Strict release gate can fail. | Medium | Updated the README contract test and restored the `Current version is` marker required by strict release gate. | Mitigated |
| npm cache or registry access fails in the local environment. | Package or clean-checkout smoke can fail for environment reasons. | Medium | Use `/tmp` npm cache; record initial failures honestly and rerun with the corrected environment. | Mitigated |
| Release artifact evidence cannot be generated from a dirty worktree. | Release dry-run remains blocked. | High | Create a checkpoint commit before release artifact refresh, then attach final evidence and close the capsule. | Open until checkpoint |
