# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Publish mutation is accidentally run during readiness. | Registry state changes before approval-gated capsule. | Low | Run only `release publish --mode dry-run`; do not use helper execute or npm publish. | Mitigating |
| Release evidence uses stale `dist`. | Package/release artifact would not match source. | Medium | Run Docker sync-build before release artifact/package smoke. | Mitigating |
| Release dry-run fails due missing attached evidence. | T-0336 cannot close. | Medium | Run artifact, package smoke, and clean-checkout smoke with `--attach-evidence --task T-0336`. | Mitigating |
