# Context

Relevant references:

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`
- `docs/SCHEMAS.md`
- `docs/TEST_STRATEGY.md`
- `docs/design/TUI_DESIGN_NOTES.md`
- `tasks/T-0108-tui-native-runtime-docs-assimilation/HANDOFF.md`

Implementation constraints:

- TUI cache is local acceleration only under `.hadara/local/tui/`.
- Cache records are not evidence, source of truth, committed project state, or context-export content.
- Default TUI behavior remains cache-free; cache is opt-in through `hadara tui --cache` or direct internal cache helpers.
- TUI remains read-only with no task mutation, evidence writes, handoff updates, shell execution, provider calls, MCP calls, dashboard/server behavior, or release/package behavior.
