# Acceptance Criteria

- [x] Overview fast-profile advisory state is honest: deferred debt/release/tools/write-preflight reads render as deferred instead of zero/ok completed signals.
- [x] Task list snapshots consume interaction `taskListScroll`, `taskSearch`, and `searchActive` state so keyboard selection and rendered rows stay aligned.
- [x] Active task search rendering shows cursor-style active search copy and preserves fixed-width snapshot output.
- [x] Mouse task-row clicks select the rendered row, open Detail, and refresh selected task detail when the loaded model is still pointed at another task.
- [x] Wide-layout task-table clicks are not mistaken for left navigation panel clicks.
- [x] The change remains read-only: no TUI writes, shell execution, provider calls, MCP calls, dashboard/server behavior, release/package behavior, evidence writes, handoff mutation from runtime, or Task Capsule mutation from runtime are introduced.
- [x] Focused TUI snapshot/state/terminal regressions pass.
- [x] Full Docker check and done-level harness validation pass.
- [x] Evidence is attached.
- [x] Handoff is updated.
