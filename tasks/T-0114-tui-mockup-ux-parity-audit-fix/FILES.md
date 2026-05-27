# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/snapshot.ts` | Modified | Render task list windows from interaction scroll/search state and expose fast-profile deferred advisory reads honestly in Overview. |
| `src/tui/state.ts` | Modified | Pass task-list scroll and search-active state into snapshot options. |
| `src/tui/terminal.ts` | Modified | Make task-row mouse clicks open Detail with detail refresh and prevent wide task-table clicks from being treated as nav clicks. |
| `tests/unit/tui-snapshot.test.ts` | Modified | Add regressions for task window rendering and deferred fast-profile Overview signals. |
| `tests/unit/tui-state.test.ts` | Modified | Cover new snapshot option mapping from interaction state. |
| `tests/unit/tui-terminal.test.ts` | Modified | Add mouse row-click detail-open and wide-layout click regressions. |
| `tasks/T-0114-tui-mockup-ux-parity-audit-fix/*` | Modified | Record scope, decisions, risks, tests, evidence, and handoff. |
