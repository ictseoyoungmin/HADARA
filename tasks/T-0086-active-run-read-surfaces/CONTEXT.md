# Context

Relevant documents, files, assumptions, and constraints.

- Required protocol docs read: `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/DEVELOPMENT_SLICES.md`.
- MCP/Hermes docs read: `docs/CLI_JSON_CONTRACT.md`, `docs/MCP_BRIDGE_CONTRACT.md`.
- V1.0 planning notes read: `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` Active Run State section.
- Existing implementation: `src/services/active-run-state.ts` already provides `safeCreateActiveRunProjection()` with degraded-read warnings for malformed local state.
- Keep active-run state under `.hadara/local/state/` and do not add writes in this capsule.
