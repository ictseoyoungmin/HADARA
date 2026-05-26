# Risks

| Risk | Mitigation |
|---|---|
| Interactive state accidentally becomes terminal runtime behavior. | Keep this capsule to pure functions and unit tests; no raw mode, CLI command, timers, or stdin handling. |
| Selection and search drift from renderer display order. | Base task navigation on the same newest-first ordering used by the snapshot Tasks panel. |
| Detail opens a task whose full detail is not in the current aggregate. | Track the selected task id and expose a read-model options helper for the next refresh rather than reading files inside the reducer. |
| TUI state writes cache or project files. | Add no-write regression coverage around state initialization and transitions. |
