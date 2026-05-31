# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Helper accidentally copies private/local state into `/tmp/hadara`. | Private state or stale build artifacts could affect validation. | Medium | Exclude `.git`, `.hadara`, `node_modules`, and `dist`. | Mitigated |
| Helper is mistaken for release validation. | Operators may over-trust a local dev script. | Low | Document it as HADARA-dev local validation only. | Mitigated |
