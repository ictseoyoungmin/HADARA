# T-0004 ProviderClient Contract

## Goal

Finalize ProviderClient contract before real provider adapters.

## Scope

- Keep MockProvider contract tests passing.
- Add provider error code vocabulary.
- Allow request-level timeout, retry, and fallback model metadata.
- Add ScriptedProvider for deterministic harness and replay scenarios.
- Preserve stream event invariants: start first, finish or error terminal.

## Out of Scope

- Real network provider adapters.
- Provider fallback executor.
- Cost accounting.

## Status

Done
