# Decisions

- Active run state is a single local manifest at `.hadara/local/state/active-run.json`.
- Status JSON exposes a projection for readers, not a write surface.
- Stale handoff means the active task id is missing from `docs/AGENT_HANDOFF.md`.
