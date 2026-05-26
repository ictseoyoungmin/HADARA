# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/snapshot.ts` | Update | Hide `generatedAt` by default, add `includeGeneratedAt`, and add `widthPolicy: mockup/compact`. |
| `src/tui/markdown.ts` | Update | Wrap lines and size tables by visible terminal width for wide-character text. |
| `tests/unit/tui-snapshot.test.ts` | Update | Cover timestamp stability, explicit timestamp opt-in, compact width policy, Korean snapshots, and no-write behavior. |
| `tests/unit/tui-markdown.test.ts` | Update | Cover Korean/wide-character wrapping and tables with visible-width assertions. |
| `tasks/T-0104-tui-snapshot-polish/*` | Update | Record scope, acceptance, evidence, and handoff. |
| `docs/TASK_BOARD.md` | Update | Mark T-0104 Done. |
| `docs/PROJECT_STATE.md` | Update | Record snapshot polish and width/timestamp policy. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Insert completed TUI snapshot polish before interactive state. |
| `docs/AGENT_HANDOFF.md` | Update | Refresh current handoff and validation baseline. |
