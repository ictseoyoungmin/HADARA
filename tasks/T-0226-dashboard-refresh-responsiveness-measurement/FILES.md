# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-refresh.ts` | Modify | Add current/completed stage timing metadata and slow-stage warnings. | Done |
| `scripts/dashboard-refresh-responsiveness.mjs` | Add | Provide repeatable refresh responsiveness measurement with optional `/tmp` comparison. | Done |
| `docs/DASHBOARD_REFRESH_RESPONSIVENESS_MEASUREMENT.md` | Add | Document operational command and interpretation criteria. | Done |
| `docs/IMPLEMENTATION_SOP.md` | Modify | Register the new conditional dashboard refresh measurement document. | Done |
| `tests/unit/dashboard-refresh.test.ts` | Modify | Cover refresh duration metadata. | Done |
| `tests/unit/dashboard-refresh-measurement-script.test.ts` | Add | Keep measurement script output contract explicit. | Done |
| `tests/unit/dashboard-static.test.ts` | Modify | Keep visual fixture status shape aligned with projection status metadata. | Done |
| `dashboard/visual-fixtures/projection-status-*.json` | Modify | Add stage timing metadata to fixture API examples. | Done |
