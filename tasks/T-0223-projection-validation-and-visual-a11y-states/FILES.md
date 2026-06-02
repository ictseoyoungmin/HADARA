# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `dashboard/visual-check.mjs` | Updated | Stub projection-first routes and capture projection-ready/detail/stale/refreshing/missing/offline/degraded visual/a11y states. | Done |
| `dashboard/visual-fixtures/core.json` | Added | Redacted core projection fixture for visual/a11y gate. | Done |
| `dashboard/visual-fixtures/timeline.json` | Added | Redacted timeline projection fixture for heavy-section backfill gate. | Done |
| `dashboard/visual-fixtures/debt.json` | Added | Redacted debt projection fixture for heavy-section backfill gate. | Done |
| `dashboard/visual-fixtures/projection-status-ready.json` | Added | Metadata-only ready projection status fixture. | Done |
| `dashboard/visual-fixtures/projection-status-stale.json` | Added | Metadata-only stale projection status fixture. | Done |
| `dashboard/visual-fixtures/projection-status-refreshing.json` | Added | Metadata-only refreshing projection status fixture. | Done |
| `dashboard/visual-fixtures/projection-status-missing.json` | Added | Metadata-only missing-heavy projection status fixture. | Done |
| `tests/unit/dashboard-static.test.ts` | Updated | Static regression coverage for projection visual fixtures/routes/states and redaction. | Done |
| `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | Updated | Documented T-0223 projection visual/a11y validation contract. | Done |
| `docs/TEST_STRATEGY.md` | Updated | Added Phase 5.7 projection visual/a11y state expectations. | Done |
