# Decisions

Record task-local design decisions here.

## No-Omission Import

- Preserve the complete TUI mockup parity / HADARA-native runtime design text inside `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` as an unabridged imported reference.
- Use the backlog, schema, and test strategy docs for actionable navigation and planning, but do not rely on those shorter docs as the only copy of the design.

## Scope Boundary

- Do not implement `hadara.tui.cache.v1` schema fixtures or cache runtime in this capsule.
- Do not alter `hadara tui` behavior in this capsule.
- Keep `.hadara/local/tui/` as future ignored local state guidance, not a committed data source.
