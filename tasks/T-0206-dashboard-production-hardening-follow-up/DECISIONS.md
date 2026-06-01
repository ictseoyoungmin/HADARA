# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `sha256(realpath(projectRoot)).slice(0, 12)`-style redacted fingerprints in dashboard cache keys. | Accepted | Avoids raw absolute paths in cache metadata while isolating same-process multi-root reads. | `createDashboardCacheKey()` tests. |
| D-2 | Keep `source.projectRoot` for v1 compatibility and add `source.projectRootRedacted` plus `source.project`. | Accepted | Lets new browser consumers move to redacted references without a breaking schema removal. | Updated schemas and read-model tests. |
| D-3 | Implement sidebar navigation as in-page read-only view filtering. | Accepted | Fixes Home-only navigation without adding routes, writes, or execution behavior. | Static dashboard tests and HTML smoke. |
| D-4 | Limit long badge/source-chip width with ellipsis. | Accepted | Prevents long roadmap/phase strings from dominating the first viewport in the operator console. | Screenshot-driven CSS update. |
