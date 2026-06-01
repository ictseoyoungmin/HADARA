# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dashboard attempts `/api/status` before fixture data. | Done | Focused dashboard test asserts live URL/fetch precedes fixture URL/fetch. |
| AC-2 | Fixture fallback works if the live API fails. | Done | `loadStatusWithFallback()` falls back to fixture and tests assert `fixture-fallback` source kind. |
| AC-3 | Inline fallback works if both live API and fixture fail. | Done | `loadStatusWithFallback()` falls back to inline JSON and tests assert `inline-fallback` source kind. |
| AC-4 | Dashboard displays source provenance and loaded timestamp. | Done | HTML includes `data-source-kind`, `data-source-loaded`, and source badge rendering. |
| AC-5 | `Refresh Status` performs read-only refetch only. | Done | Refresh uses `fetch(..., { cache: 'no-store' })`; forbidden run/sync/update wording remains absent. |
| AC-6 | No shell/provider/MCP/evidence/task/release write behavior is added. | Done | Existing forbidden-token checks pass; no server write route changed. |
| AC-7 | Existing dashboard static smoke tests pass. | Done | Focused dashboard test passed: 1 file / 12 tests. |
| AC-8 | New live/fallback binding tests pass. | Done | `dashboard-static.test.ts` includes live-first/fallback/provenance assertions. |
| AC-9 | Existing security headers and method restrictions remain intact. | Done | Dashboard route boundary tests passed in focused and full validation. |
