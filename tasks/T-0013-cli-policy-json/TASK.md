# T-0013 CLI Policy JSON

## Goal

Continue CLI JSON normalization by adding a stable machine-readable envelope for `hadara policy check-shell <command> --json`.

## Scope

- Add a versioned policy check JSON envelope.
- Include command text, permission mode, tokenized shell shape, and policy decision.
- Return exit code `2` when the policy decision is `deny`.
- Preserve existing non-JSON policy output shape.
- Add focused tests and Docker CLI smokes.

## Out of Scope

- ShellTool execution.
- Approval workflow implementation.
- Full POSIX or PowerShell parsing.
- Hermes and Evidence CLI JSON normalization.
- Dashboard, MCP body, real provider adapters, or full agent loop.

## Status

Done
