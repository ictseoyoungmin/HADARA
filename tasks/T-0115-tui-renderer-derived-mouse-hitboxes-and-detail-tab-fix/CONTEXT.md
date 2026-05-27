# Context

Relevant documents, files, assumptions, and constraints.

## Required Reading

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`
- `docs/TEST_STRATEGY.md`
- `docs/design/TUI_DESIGN_NOTES.md`
- `.mockup/tui/app.js`
- `.mockup/tui-final/src/app.js`

## Notes

- The mockup records hitboxes as rendering happens and resolves mouse clicks against that rendered hitbox list.
- Current production TUI mouse handling uses fixed coordinate helpers in `src/tui/terminal.ts`; this can drift from `src/tui/snapshot.ts`.
- User-facing output should remain effectively identical to the mockup-oriented production frame, with only interaction correctness improving.
