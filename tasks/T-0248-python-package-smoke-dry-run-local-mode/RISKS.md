# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Python local mode depends on optional Python packaging tools. | Medium | Medium | Built smoke uses dry-run; local mode command flow is unit-tested with injected runner. | Mitigated |
| Provider selection could alter npm behavior. | High | Low | Default provider remains npm; Python requires `--provider python`. | Mitigated |
