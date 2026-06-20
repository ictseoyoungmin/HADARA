# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `scripts/release/manual-publish-rc.sh T-0402` as the only publish path. | Accepted | It refreshes evidence and blocks mutation unless `--execute` plus interactive `publish` confirmation are provided. | T-0337/T-0340 precedent |
| D-2 | Publish `0.3.3-rc.0` with npm dist-tag `next`. | Accepted | Release candidates must not replace stable `latest`; helper default resolves `*-rc.*` to `next`. | `scripts/release/manual-publish-rc.sh` |
| D-3 | Do not create a GitHub Release draft in the default T-0402 flow. | Accepted | GitHub Release creation is optional and should not happen without explicit request. | T-0402 scope |
| D-4 | Commit this capsule preparation before the operator runs the helper. | Accepted | The helper requires clean worktree and release evidence should refer to committed capsule state. | Helper preflight |
