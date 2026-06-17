# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Accidental npm registry mutation before explicit approval. | Violates release policy and cannot be undone for a package version. | Medium | Keep helper in dry-run mode; require explicit operator approval/authentication before `--execute`. | Open |
| Stable publish uses the wrong dist-tag. | `latest` could remain stale or point to the wrong version. | Low | Verify helper npm tag output and registry dist-tags; stable non-rc version should default to `latest`. | Open |
| Source docs claim stable availability before registry publish completes. | Users may try installing `0.3.2` before visibility. | Medium | Mark T-0340 as approval-gated preparation until publish verification evidence exists. | Open |
| Release artifact requires a clean git worktree. | Release dry-run and helper publish cannot proceed while T-0340 changes remain uncommitted. | High | Committed release preparation as `14c840f` and reran release artifact/dry-runs successfully; keep this guard for the final helper publish flow. | Mitigated |
| Missing npm token or explicit operator approval. | Actual stable npm publish cannot execute. | High | Require operator npm authentication/approval before running the helper with `--execute`; no publish mutation has run. | Active Blocker |
