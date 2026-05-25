# Context

Relevant documents, files, assumptions, and constraints.

## Required Reading

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` provider adapter preparation section
- `docs/specs/HADARA_Core_v1.0_Technical_Development_Plan.md` provider adapter preparation section

## Constraints

- Real provider adapters remain unimplemented in this slice.
- No network calls, provider SDK calls, secret loading, shell execution, or new MCP write/provider surfaces are allowed.
- Provider configuration may reference secret environment variable names, but must not persist or report secret values.
- Provider-originated actions remain deferred; future action intents must pass through shared policy services before execution.
- The current validation path is Docker via the reusable `hadara-dev` container.
