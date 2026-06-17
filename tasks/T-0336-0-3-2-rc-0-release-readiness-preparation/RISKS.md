# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Publish mutation is accidentally run during readiness. | Registry state changes before approval-gated capsule. | Low | Ran only `release publish --mode dry-run`; no helper execute or npm publish. | Mitigated |
| Release evidence uses stale `dist`. | Package/release artifact would not match source. | Medium | Docker sync-build refreshed `dist` before artifact/package validation. | Mitigated |
| Release dry-run fails due missing attached evidence. | T-0336 cannot close. | Medium | Artifact, package smoke, and clean-checkout smoke were attached to T-0336 and strict gate/dry-run passed. | Mitigated |
