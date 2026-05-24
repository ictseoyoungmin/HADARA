# Acceptance Criteria

- [x] A single active run manifest format exists.
- [x] The manifest lives under `.hadara/local/state/active-run.json` so it is local project state, not committed product docs.
- [x] A resume projection is generated from the active run manifest.
- [x] Stale handoff detection warns when the active task id is not mentioned in `docs/AGENT_HANDOFF.md`.
- [x] Operations Status JSON includes the active run projection.
- [x] Focused validation passes.
- [x] Done-level capsule validation passes.
