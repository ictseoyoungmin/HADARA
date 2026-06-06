# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Release mutation accidentally enters a read-model slice. | Could publish or expose tokens unexpectedly. | Medium | Keep publish/token/registry actions out of scope and prove dry-run flags in tests. | Open |
| Operator runs manual helper before committing final rc.1 source/evidence state. | Helper refuses dirty worktrees, or a publish could happen from a source state that differs from reviewed evidence. | Medium | Handoff must say to commit this capsule first, then run `npm login`, then `scripts/release/manual-publish-rc.sh T-0275 --execute`. | Open |
| `0.2.0-rc.1` already exists on npm. | npm package versions are immutable; publish would fail or publish intent would be ambiguous. | Low | Manual helper checks `npm view hadara@<version>` before publish after operator login. | Mitigated by helper |
| README image breaks in published npm context. | Package README could show a broken image. | Medium | README uses GitHub raw URL; ensure `docs/assets/hadara_sub_right_name.png` is committed and pushed before publish. | Open |
| Token values leak into committed evidence. | Could expose credentials. | Low | Do not print token values; only user runs npm login/publish helper locally. | Mitigated so far |
