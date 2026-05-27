# Context

- Required docs read: `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, and `docs/DEVELOPMENT_SLICES.md`.
- T-0113 reduced interactive TUI reads to about 2.8-3.1s by using a fast read-model profile, but this introduced a UX honesty issue: deferred debt/release/tools/write-preflight surfaces could still look like real zero/ok signals in Overview.
- The `.mockup/tui-final/src/app.js` task panel keeps a rendered task window (`taskOffset`) aligned with selection, adds hitboxes as it renders rows, and treats task row click/Enter as opening Detail.
- Production `src/tui/state.ts` already tracked `taskListScroll`, but `src/tui/snapshot.ts` ignored it and always rendered a latest-task slice. This made keyboard selection and displayed rows diverge for longer task lists.
- Production `src/tui/terminal.ts` accepted mouse row clicks, but task clicks only selected rows and wide-layout table clicks could be intercepted as left navigation because panel hit detection ignored the x coordinate.
