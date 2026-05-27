# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/snapshot.ts` | Modify | Emit internal hitbox metadata from the renderer while preserving rendered text. |
| `src/tui/terminal.ts` | Modify | Resolve SGR mouse clicks through renderer hitboxes instead of fixed geometry. |
| `tests/unit/tui-snapshot.test.ts` | Modify | Cover snapshot hitbox metadata without changing deterministic text behavior. |
| `tests/unit/tui-terminal.test.ts` | Modify | Cover compact/wide mouse behavior and Detail tab targeting through rendered hitboxes. |
| `tasks/T-0115-tui-renderer-derived-mouse-hitboxes-and-detail-tab-fix/*` | Modify | Keep Task Capsule plan/evidence/handoff current. |
| `docs/TASK_BOARD.md` | Modify | Track T-0115 status. |
| `docs/PROJECT_STATE.md` | Modify | Record completed TUI hitbox capability when done. |
| `docs/DEVELOPMENT_SLICES.md` | Modify | Record the completed TUI follow-up slice when done. |
| `docs/AGENT_HANDOFF.md` | Modify | Leave compact next-session handoff. |
