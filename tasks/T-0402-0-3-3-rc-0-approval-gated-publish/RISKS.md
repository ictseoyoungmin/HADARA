# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Operator is not npm-authenticated. | Helper stops before publish. | Medium | Run `npm login --registry=https://registry.npmjs.org` and verify `npm whoami`. | Open |
| Wrong npm dist-tag. | RC could replace stable `latest`. | Low | Use helper default or verify `npm tag: next` in output before typing `publish`. | Open |
| Dirty worktree before helper execution. | Helper exits before validation/publish. | Medium | Commit T-0402 docs before operator run; avoid edits before helper. | Mitigated by planned commit |
| Exact version already exists on npm. | npm publish is impossible because package versions are immutable. | Low | Helper checks `npm view hadara@0.3.3-rc.0 version` and stops if it exists. | Open |
| Publish succeeds but verification is incomplete. | Consumers may hit stale metadata/cache issues unnoticed. | Medium | After helper, record npm view, dist-tags, tarball/README/package metadata, and installed-bin smoke as feasible. | Open |
| GitHub Release draft accidentally requested. | Extra release mutation outside requested scope. | Low | Do not pass `--github-draft` unless explicitly requested. | Mitigated by scope |
