# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Derive 0.4 metadata axes in read-map output instead of migrating registry storage now. | Accepted | This keeps T-04A5 read-only and avoids premature registry mutation before `complete-spec`/`mark-drift` design work. | `ev:T-0431:a81383c6d7894693a45a95ed` |
| D-2 | Keep `docs inbox` as a read-only attention list over existing registry diagnostics. | Accepted | It satisfies the immediate operator/agent routing need without adding cleanup writes. | `ev:T-0431:a81383c6d7894693a45a95ed` |
