# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm login missing | Helper stops at npm `whoami` and no publish occurs. | High | Operator logged into npm and publish completed. | Resolved |
| Wrong npm dist-tag | Stable package could fail to become default install target. | Low | Dist-tags verified `latest=0.3.3` and `next=0.3.3-rc.0`. | Resolved |
| Version already exists | npm publish would fail because package versions are immutable. | Low | T-0405 verified `npm view hadara@0.3.3` returned E404 before publish; rerun if delayed. | Mitigated |
| README describes stable package before mutation | Source docs may appear ahead of registry until operator publishes. | Medium | Registry verification and installed-bin smoke passed after publish. | Resolved |
