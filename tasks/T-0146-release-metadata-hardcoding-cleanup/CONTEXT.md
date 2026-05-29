# Context

Relevant documents and files:

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `src/services/operational-debt.ts`
- `tests/unit/operational-debt.test.ts`
- `package.json`

Current issue:

- T-0145 fixed MCP initialize version metadata, but release readiness checks still embed specific current RC strings such as `0.1.0-rc.0` in source logic.

Assumptions:

- Historical docs/evidence may keep exact versions because they record completed events.
- Source checks for current readiness should tolerate the next RC version when `package.json` changes and matching docs are updated.
