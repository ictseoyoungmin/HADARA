# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dashboard status route no longer performs the operational debt scan used by explicit debt endpoints. | Met | `src/cli/dashboard.ts` |
| AC-2 | Dashboard bootstrap defaults to the fast `core` tier, with full bootstrap still available via `tier=full`. | Met | `src/cli/dashboard.ts` |
| AC-3 | Dashboard route regression coverage reflects the new fast default path. | Met | `tests/unit/dashboard-static.test.ts`, `ev:T-0419:e37deeb8c81f4c19a6bea6e2` |
| AC-4 | Timeout reproduction and passing validation evidence are both attached, with the failed timeout evidence resolved by a later passed check. | Met | `ev:T-0419:f78eb0dda4304353b04e7e79`, `ev:T-0419:e37deeb8c81f4c19a6bea6e2`, `ev:T-0419:058774b754bf45f2b904e093` |
| AC-5 | Workspace `dist` is refreshed after CLI code changes. | Met | `ev:T-0419:b1f6d6d0181f402589a639fe` |
