# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Accidental npm registry mutation before explicit approval. | Violates release policy and cannot be undone for a package version. | Medium | Helper dry-runs passed first; publish execute happened only after operator authentication/approval. | Mitigated |
| Stable publish uses the wrong dist-tag. | `latest` could remain stale or point to the wrong version. | Low | Verified dist-tags after publish: `latest=0.3.2`, `next=0.3.2-rc.0`. | Mitigated |
| Source docs claim stable availability before registry publish completes. | Users may try installing `0.3.2` before visibility. | Medium | npm registry verification returned `0.3.2`; docs now reflect stable publish completion. | Mitigated |
| Release artifact requires a clean git worktree. | Release dry-run and helper publish cannot proceed while T-0340 changes remain uncommitted. | High | Committed release preparation as `14c840f` and reran release artifact/dry-runs successfully; keep this guard for the final helper publish flow. | Mitigated |
| Missing npm token or explicit operator approval. | Actual stable npm publish cannot execute. | High | Operator completed npm auth/approval and publish succeeded. | Resolved |
