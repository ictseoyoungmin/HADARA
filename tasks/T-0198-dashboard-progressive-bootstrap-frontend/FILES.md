# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `docs/design/dashboard/index.html` | Updated | Switches first read to bootstrap, keeps status/fixture/inline fallback, adds cache badge, and retains previous in-memory state on refresh failure. | Done |
| `tests/unit/dashboard-static.test.ts` | Updated | Guards bootstrap-first loading, cache status badge, stale subtitle removal, storage bans, and existing fallback behavior. | Done |
