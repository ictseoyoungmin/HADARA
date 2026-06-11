# T-0294 Phase 7.4 Managed Sections and Safe Patch Plans

## Metadata

| Field | Value |
|---|---|
| ID | T-0294 |
| Title | Phase 7.4 Managed Sections and Safe Patch Plans |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Implement Phase 7.4 managed sections and safe patch plans. | Add marker parsing, read-only managed section inspection, dry-run patch planning, hash-guarded execute, safe init markers, schemas, and focused tests. |

## Scope

| In Scope | Reason |
|---|---|
| Managed section parser/model | Phase 7.4 requires valid/missing/duplicate/nested/invalid metadata diagnostics. |
| Docs managed inspection CLI | `docs managed list/explain` must expose section metadata without writes. |
| Docs patch CLI | `docs patch` must dry-run by default and execute only with matching before hashes. |
| Fresh init markers for safe generated sections | Phase 7.4 requires markers only for safe generated/tabular sections. |
| Schema/tests | New patch plan contract and behavior must be covered. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad Markdown rewrite | Only declared managed sections are patchable. |
| Auto-convert all legacy docs | Marker bootstrap beyond safe init is not required. |
| Archive/delete docs | Deferred to Phase 7.5. |
| Change close-proof model | Existing close-source hash behavior remains. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-11 | Implementation in progress. | Scope prepared from Phase 7.4 spec. | `TASK.md`, `PLAN.md` |
| 2026-06-11 | Done. | Managed section parser, patch planner/apply, CLI surfaces, init/task markers, schemas, tests, and smokes completed. | T-0294 evidence records |
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
