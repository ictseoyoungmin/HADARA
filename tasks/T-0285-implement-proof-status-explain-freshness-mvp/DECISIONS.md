# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Build proof MVP on evidence lint semantics plus task close audit freshness. | Accepted | Reuses existing validated read models and avoids raw ad hoc evidence parsing. | Focused tests passed. |
| D-2 | Treat stale or missing close proof as a proof warning instead of a command failure. | Accepted | The status command should surface freshness risk while preserving evidence-read visibility. | Built proof smoke surfaced stale T-0284 freshness. |
