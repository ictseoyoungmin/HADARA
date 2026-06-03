# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-refresh.ts` | Updated | Add refresh progress metadata, staged progress updates, cheap freshness/stale/pending derivation. | Done |
| `src/services/dashboard-task-projection.ts` | Updated | Report async batch rebuild progress and yield timestamps. | Done |
| `src/services/dashboard-core.ts` | Updated | Allow core projection responses to carry externally derived freshness, refresh state, pending, and stale metadata. | Done |
| `src/cli/dashboard.ts` | Updated | Inject projection status metadata into `/api/dashboard/core` without awaiting refresh completion. | Done |
| `dashboard/src/model.ts` | Updated | Normalize core projection metadata and add `/api/dashboard/refresh` trigger helper. | Done |
| `dashboard/src/app.tsx` | Updated | Make UI Refresh trigger projection refresh and keep current runtime visible. | Done |
| `dashboard/src/ui.tsx` | Updated | Add projection stale/pending/refreshing badge. | Done |
| `dashboard/visual-fixtures/projection-status-*.json` | Updated | Include progress metadata in projection status fixtures. | Done |
| `docs/design/dashboard/index.html` | Updated | Rebuilt served dashboard bundle. | Done |
| `tests/unit/dashboard-refresh.test.ts` | Updated | Cover refresh progress metadata. | Done |
| `tests/unit/dashboard-task-projection.test.ts` | Updated | Cover async batch progress reporting. | Done |
| `tests/unit/dashboard-static.test.ts` | Updated | Pin UI refresh route and fixture progress fields. | Done |
| `docs/PROJECT_STATE.md` | Updated | Record T-0225 capability state. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Updated | Add T-0225 completion row. | Done |
| `docs/AGENT_HANDOFF.md` | Updated | Refresh current handoff. | Done |
