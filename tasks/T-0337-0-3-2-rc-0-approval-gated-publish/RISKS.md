# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm authentication is missing or stale. | Helper stops at `npm whoami`; no publish. | Medium | Operator authenticated through npm CLI flow before publish. | Resolved |
| Wrong npm dist-tag would move stable consumers to rc. | `latest` could point to rc. | Low | Verified `latest=0.3.0` and `next=0.3.2-rc.0`. | Resolved |
| Exact version already exists. | npm versions are immutable; publish cannot proceed. | Low | Helper publish completed for new `0.3.2-rc.0`. | Resolved |
| Worktree dirtiness blocks helper. | Helper refuses publish from dirty source. | Medium | Helper reached publish and verification in clean publish environment. | Resolved |
| GitHub Release draft accidentally created. | Out-of-scope release artifact mutation. | Low | Helper skipped GitHub Release draft. | Resolved |
