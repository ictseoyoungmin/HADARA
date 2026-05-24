# Context

Relevant documents:

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`

Planning references identify Service Parity Expansion as the next P1 core solidification slice after T-0079. The first priority in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` is to move `hadara.task.read` out of `src/mcp/tool-registry.ts`.

Validation should use the reusable Docker workflow because host Node/npm are unreliable in the current WSL environment.
