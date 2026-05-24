# T-0083 Task Read Evidence Normalization

## Goal

Normalize `task.read` embedded evidence data through the shared evidence-list parser.

## Scope

- Reuse evidence-list parsing/normalization for `task.read` embedded `evidenceIndex`.
- Normalize the `files["evidence.jsonl"]` view returned by `task.read` so private paths, unknown fields, mismatched task records, malformed lines, and read-time secrets do not leak through the file payload.
- Preserve `task.read` files for standard Task Capsule Markdown files.
- Add focused regression coverage for sanitized embedded evidence records and warning issue behavior.

## Out of Scope

- No schema runtime validation or release gates.
- No new evidence storage format.
- No broad MCP writes, shell execution, provider calls, or dashboard APIs.
- No changes to evidence collection/write semantics.

## Status

Done
