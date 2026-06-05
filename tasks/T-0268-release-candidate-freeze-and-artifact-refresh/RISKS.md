# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Release mutation accidentally enters a read-model slice. | Could publish or expose tokens unexpectedly. | Medium | Keep publish/token/registry actions out of scope and prove dry-run flags in tests. | Open |
