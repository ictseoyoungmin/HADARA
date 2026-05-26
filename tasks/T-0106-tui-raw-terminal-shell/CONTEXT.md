# Context

Relevant documents, files, assumptions, and constraints.

- Required project protocol docs were read at session start: `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, and `docs/DEVELOPMENT_SLICES.md`.
- TUI design references: `docs/design/TUI_DESIGN_NOTES.md`, `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`, and `docs/V1_0_CAPSULE_BACKLOG.md`.
- Existing TUI foundations:
  - `src/tui/read-model.ts` composes read-only HADARA service reports.
  - `src/tui/snapshot.ts` renders deterministic fixed-size no-color snapshots.
  - `src/tui/state.ts` owns pure interaction transitions and refresh effect flags.
- Host Node/npm remains unreliable per handoff; use the reusable Docker workflow for validation.
