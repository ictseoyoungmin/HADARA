# Decisions

| Decision | Reason |
|---|---|
| Treat T-0066 through T-0070 mismatch cleanup as documentation-only. | The relevant runtime behavior already exists or is explicitly deferred; the risk is stale planning guidance. |
| Keep implemented snake_case schema names and `.hadara/local/state/` path as canonical for active-run state. | These names and paths are what the current code and tests enforce. |
| Leave future debt persistence location undecided. | The portable/project versus local mutable boundary must be chosen before adding a persisted debt store. |
