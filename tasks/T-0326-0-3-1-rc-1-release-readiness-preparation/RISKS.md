# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README could imply `0.3.1-rc.1` is already published before T-0327. | Users may try an npm version that is still only a source candidate. | Medium | README now labels rc1 as the current RC and keeps stable install on `hadara@0.3.0`; publish remains T-0327. | Mitigated |
| Release artifact dirty-worktree guard blocks evidence refresh. | Release artifact/package evidence cannot be generated from uncommitted source prep. | High | Commit the source/readiness prep checkpoint before artifact execution, then record generated evidence separately. | Open |
| T-0326 accidentally performs registry mutation. | npm/GitHub/Docker/PyPI state changes outside approval-gated T-0327. | Low | Run only `release publish --mode dry-run`; do not run helper `--execute`, `npm publish`, GitHub Release creation, Docker publish, or token-loading commands. | Open |
| Host npm/Docker environment may be unreliable under sandbox. | Required validation can fail for environment reasons rather than code reasons. | Medium | Docker socket escalation and container restart were required; the first full-validation run timed out, and the immediate rerun passed. | Mitigated |
| Patch-line release policy change is too broad. | Future non-intended versions could pass publishability checks. | Low | Limit the accepted pattern to `0.x.y` and `0.x.y-rc.N` with `private:false`; keep all existing metadata, evidence, and approval gates. | Mitigated |
