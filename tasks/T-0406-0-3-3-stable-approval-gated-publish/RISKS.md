# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm login missing | Helper stops at npm `whoami` and no publish occurs. | High | Operator logs into npm before running `--execute`; T-0405 recorded the E401 preflight blocker. | Active |
| Wrong npm dist-tag | Stable package could fail to become default install target. | Low | Helper dry-run must show `npm tag: latest`; verify dist-tags after publish. | Active |
| Version already exists | npm publish would fail because package versions are immutable. | Low | T-0405 verified `npm view hadara@0.3.3` returned E404 before publish; rerun if delayed. | Mitigated |
| README describes stable package before mutation | Source docs may appear ahead of registry until operator publishes. | Medium | This is intentional for npm package upload; keep publish capsule active until registry verification completes. | Active |
