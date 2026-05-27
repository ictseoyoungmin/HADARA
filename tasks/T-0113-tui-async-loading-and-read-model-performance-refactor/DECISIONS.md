# Decisions

- Use `TuiReadModelOptions.profile = 'fast'` instead of changing the full aggregate contract. This keeps snapshot/full reads compatible while allowing the interactive terminal to choose a cheaper model.
- Defer operational debt, release-gate, tools, and write-preflight surfaces in the fast profile because they are advisory in the TUI frame and dominated the measured synchronous cost.
- Represent missing `TASK.md` cache index entries with `mtimeMs: 0` and `size: 0` so cache writes do not fail on stale or malformed task directories.
- Route interactive `r` refresh through the fast profile for responsiveness; a future explicit deep/full advisory refresh can be added separately.
