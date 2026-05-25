# T-0095 Logger and Audit Event Model

## Goal

Add a small structured event foundation for HADARA audit/debug surfaces, centered on `hadara.event.v1`, without changing user-facing CLI output or adding new write-capable surfaces.

## Scope

- Define a typed `hadara.event.v1` event model with normalization, secret redaction, and JSONL serialization helpers.
- Add a JSON Schema fixture for `hadara.event.v1` and register it in the schema index/runtime loader.
- Route existing private audit writes through the structured event model while preserving the current audit JSONL compatibility fields.
- Add focused unit tests proving event normalization, redaction, schema validation, and audit compatibility.
- Document stdout/stderr/audit/debug boundaries in task-local context.

## Out of Scope

- New CLI commands for reading or writing logs.
- Live dashboard log/event APIs.
- Provider adapters, provider calls, shell execution, release execution, or broad MCP writes.
- Persisted debug logs beyond the existing private audit JSONL store.

## Status

Done
