# T-0075 Redaction Policy Follow-up

## Goal

Separate redaction scanning/reporting from public evidence policy decisions and record the remaining naming/schema clarifications surfaced after T-0074.

## Scope

- Add a severity-threshold helper for redaction reports.
- Use the helper for public evidence artifact rejection while preserving existing `containsSecret()` compatibility.
- Document per-pattern finding count overlap semantics.
- Record canonical future active-run MCP tool names and context export memory-mode output shape in planning docs.

## Out of Scope

- Implementing the evidence list read model.
- Changing default redaction severities or adding low/medium heuristics.
- Implementing active-run or context-export MCP tools.
- Splitting `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.

## Status

Done
