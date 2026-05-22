# T-0023 Workspace File Boundary

## Goal

Require CLI file inputs to resolve to real files inside the project workspace before reading or copying them.

## Scope

- Add a shared workspace file resolver with realpath containment checks.
- Apply it to evidence artifact collection, harness replay scenarios, `run --script`, and `run --fake-shell-fixtures`.
- Return stable JSON issues for rejected file inputs.
- Add regression tests for parent traversal, absolute outside paths, and symlink escape.

## Out of Scope

- Evidence artifact redaction or binary policy.
- Full CLI args parser extraction.
- Real shell execution.
- Agent loop evidence attachment.

## Status

Done
