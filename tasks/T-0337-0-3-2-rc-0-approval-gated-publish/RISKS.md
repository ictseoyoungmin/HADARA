# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm authentication is missing or stale. | Helper stops at `npm whoami`; no publish. | Medium | Operator runs `npm login` or configures token before execute. | Open |
| Wrong npm dist-tag would move stable consumers to rc. | `latest` could point to rc. | Low | Helper defaults rc versions to `next`; verify dist-tags after publish. | Open |
| Exact version already exists. | npm versions are immutable; publish cannot proceed. | Low | Helper checks `npm view hadara@0.3.2-rc.0 version` before publish. | Open |
| Worktree dirtiness blocks helper. | Helper refuses publish from dirty source. | Medium | Keep only committed/expected release outputs before execution. | Open |
| GitHub Release draft accidentally created. | Out-of-scope release artifact mutation. | Low | Do not pass `--github-draft` unless explicitly requested. | Open |
