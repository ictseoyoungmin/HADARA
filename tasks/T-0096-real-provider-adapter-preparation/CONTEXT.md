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
- Provider config input uses a deny policy for unknown fields at the root, adapter, and capabilities levels. This keeps future loader behavior conservative and avoids silently accepting nested secret-like values.
- Provider helper outputs are schema-asserted before return so JavaScript/runtime callers cannot receive schema-invalid provider config or call reports.
- Provider-originated actions remain deferred; future action intents must pass through shared policy services before execution.
- Provider-originated `ActionIntent` contract design, provider call audit integration, and actual provider adapters remain follow-up work. Actual provider adapters must stay explicit opt-in and policy-gated.
- The current validation path is Docker via the reusable `hadara-dev` container.

## Deferred P2 Contract Sketch

- Provider-originated `ActionIntent` records should be proposal-only objects with a schema version, provider/model metadata, stable intent id, action summary, origin provider-call id/task id, and policy-required marker.
- ActionIntent records must not execute shell, write files, call providers, mutate evidence, or dispatch MCP writes.
- Provider call audit integration should record redacted provider call reports plus ActionIntent ids, not prompt/response content or secret values.
