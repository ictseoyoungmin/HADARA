# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Use a git worktree fingerprint as the first C6.5 read-path freshness proof. | Accepted | In git worktrees, `HEAD` plus porcelain status captures tracked content changes, staged changes, removals, and untracked files without walking/statting every context source. If the fingerprint is absent or mismatched, the existing full manifest build remains the fallback. | C6 spec requires bounded fresh detection and no stale reuse. |
| D2 | Treat mtime-only changes in a clean git worktree as cache-fresh. | Accepted | HADARA context depends on file content and routing metadata, not modification time alone. Avoiding mtime-only invalidations is a deliberate speed improvement for mounted filesystems. | Unit coverage will verify this behavior. |
| D3 | Keep the fast path read-only and local-cache optional. | Accepted | `context graph` and future C4 slices must never warm or mutate cache as a side effect. Fast reuse only consumes existing cache state and falls back to deterministic rebuilds. | C6/C4 specs. |
