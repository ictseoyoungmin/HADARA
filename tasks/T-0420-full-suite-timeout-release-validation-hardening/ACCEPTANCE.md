# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dashboard bootstrap service defaults to `core` and marks debt summary pending unless `tier=full` is requested. | Met | `src/services/dashboard-bootstrap.ts`, `tests/unit/dashboard-bootstrap.test.ts` |
| AC-2 | Vitest per-test/hook timeout is explicit, defaults to 30s, and can be overridden by environment. | Met | `vitest.config.ts` |
| AC-3 | The six-file regression set from the publish failure log passes in Docker ext4 validation. | Met | `ev:T-0420:6fc1e031e0d243c3971bc44d` |
| AC-4 | Full Vitest suite passes in Docker ext4 validation. | Met | `ev:T-0420:80ee3d2f4d09409c9c3651b9` |
| AC-5 | Workspace `dist` is refreshed after source/config changes. | Met | `ev:T-0420:68733ec5e4d24f3f8e43de31` |
| AC-6 | Whitespace check passes before finalize/commit. | Met | `ev:T-0420:83a365b861bf4336ba5f2b09` |
