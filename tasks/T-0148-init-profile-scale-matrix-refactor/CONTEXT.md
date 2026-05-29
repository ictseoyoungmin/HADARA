# Context

## Relevant Documents

- `docs/IMPLEMENTATION_SOP.md`
- `docs/PROJECT_STATE.md`
- `docs/TASK_BOARD.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/AGENT_HANDOFF.md`
- `tasks/T-0147-init-scaffold-protocol-alignment/HANDOFF.md`

## User Direction

- The previous init profile naming did not carry enough meaning for general use.
- Init profiles should be general, not HADARA-dev-specific.
- Generated SOP docs must not require agents to read files that the selected init profile did not generate.
- Profile scale should determine which generated docs are added to the SOP required-reading table.
- Decide whether the current HADARA-dev baseline belongs to the middle or heavy profile and reflect that design.

## Assumptions

- Use `basic|standard|governed` as general scale names.
- Treat HADARA-dev itself as `governed` because it has long-lived release, security, MCP, TUI, and operational surfaces, while the default for new projects should be `standard`.
- Do not preserve old profile names as compatibility aliases; unsupported profile names should be rejected.
