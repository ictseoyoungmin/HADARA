# Decisions

Record task-local design decisions here.

- Implement interaction as pure state reducers in `src/tui/state.ts` so raw terminal handling can remain a later integration layer.
- Treat refresh as a local `refreshRequested` flag, not an immediate read-model call or timer.
- Treat refresh completion as an explicit reducer signal (`refresh-complete` / `detail-refresh-complete`) so the future terminal runtime can clear effect flags without special state mutation.
- Treat task selection as a local selected task id; opening detail can request a future read-model refresh if the current aggregate does not contain that task detail.
- Keep scroll positions in local state only and avoid any cache or project-state persistence.
