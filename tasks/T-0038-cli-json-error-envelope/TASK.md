# T-0038 CLI JSON Error Envelope

## Goal

Ensure CLI commands in JSON mode return a stable JSON error envelope even when argument parsing or runtime validation fails before command-specific envelopes are built.

## Scope

- Add a shared CLI error envelope helper.
- Use raw argv `--json` detection in the top-level CLI catch path.
- Map known argument, mode, evidence result, harness level, and workspace errors to stable codes.
- Preserve command-family exit code policies.
- Add regression tests and built CLI smokes for JSON error paths.

## Out of Scope

- Success envelope changes.
- Non-JSON error output changes beyond preserving current stderr behavior.
- Policy safe command exactness.
- Handoff compaction.

## Status

Done
