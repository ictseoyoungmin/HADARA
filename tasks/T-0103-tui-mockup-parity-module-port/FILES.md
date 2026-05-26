# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/constants.ts` | Add | Centralize TUI panel ids and Task Capsule document tab metadata from the mockup. |
| `src/tui/layout.ts` | Add | Split terminal frame, card, badge, column, divider, clipping, and width helpers out of the renderer. |
| `src/tui/markdown.ts` | Add | Split Markdown document rendering for headings, checklists, bullets, and tables. |
| `src/tui/snapshot.ts` | Update | Move the internal snapshot renderer toward the mockup Work Console frame and panels. |
| `tests/unit/tui-snapshot.test.ts` | Update | Cover mockup-style frame, minimum terminal size, document tabs, and read-only rendering. |
| `tests/unit/tui-markdown.test.ts` | Add | Cover terminal Markdown rendering helpers. |
| `tasks/T-0103-tui-mockup-parity-module-port/*` | Update | Record capsule scope, evidence, decisions, risks, and handoff. |
| `docs/TASK_BOARD.md` | Update | Mark T-0103 Done. |
| `docs/PROJECT_STATE.md` | Update | Record the new TUI module split and mockup-parity snapshot renderer. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Add completed TUI mockup parity module slice and keep interactive state deferred. |
| `docs/AGENT_HANDOFF.md` | Update | Refresh current handoff and validation baseline. |
