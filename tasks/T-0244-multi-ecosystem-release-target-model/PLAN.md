# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and release readiness context. | Done | `task next --json`, `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, and T-0243 handoff were reviewed. |
| 2 | Implement descriptor-backed release target model. | Done | `src/services/release-targets.ts`, `src/services/release-dry-run.ts`, release dry-run schema/tests. |
| 3 | Mark package smoke as npm-provider-specific. | Done | `src/services/package-smoke.ts`, package-smoke schema/tests. |
| 4 | Update release/operator docs. | Done | `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, `docs/SCHEMAS.md`. |
| 5 | Run Docker validation, sync build, and built CLI smoke. | Done | Docker check/sync-build passed; built release dry-run/package-smoke smokes confirmed descriptors/provider metadata. |
| 6 | Attach evidence and close the capsule. | Done | Evidence records, `task ready`, `task finish`, `task close`, and `task audit-close` passed. |
