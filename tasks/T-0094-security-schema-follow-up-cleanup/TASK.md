# T-0094 Security Schema Follow-up Cleanup

## Goal

Close the remaining security/schema follow-ups after T-0091 through T-0093.

## Scope

- Restrict private evidence source artifact copying to project-boundary files by default.
- Separate active-run malformed local-state warnings from active-run report schema assertion warnings.
- Add JSON Schema fixtures for `hadara.privateEvidence.v1` and `hadara.releaseGate.v1`.
- Register the new schema fixtures and keep runtime schema loading aware of them.
- Add focused tests and evidence.

## Out of Scope

- Adding an `--allow-private-source` override for external absolute private evidence paths.
- Encrypting private evidence content.
- Broad schema runtime enforcement or release gates.
- Provider adapters, shell execution, dashboard live APIs, or broad MCP writes.

## Status

Done
