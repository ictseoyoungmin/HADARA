# T-0092 Active Run Runtime Schema Validation

## Goal

Add runtime schema validation for active-run projection and resume reports so read surfaces backed by mutable local state stay aligned with the registered JSON Schema fixtures.

## Scope

- Add a small schema loader/validator for the existing `src/schemas/*.schema.json` fixture subset.
- Validate `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1` reports at runtime before CLI/MCP consumers receive them.
- Add tests proving normal active-run reports and malformed-local-state degraded reports pass runtime schema validation.
- Keep schema validation read-only and diagnostic; do not introduce release gates or broad schema enforcement.

## Out of Scope

- Schema validation for every HADARA read model.
- New active-run write commands.
- Release/package blocking gates.
- MCP write behavior, shell execution, provider calls, or dashboard live APIs.

## Status

Done
