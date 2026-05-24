# Acceptance Criteria

- [x] `hadara.context.export.v1` reports context content with `mode: "memory"`, `contextPath: null`, and `wouldWritePath`.
- [x] Default MCP `tools/list` advertises read-only `hadara.context.export`.
- [x] MCP `hadara.context.export` returns one JSON text payload and does not write `.hadara/context/HADARA_CONTEXT.md`.
- [x] Existing CLI `hadara hermes export-context` still writes the generated context file.
- [x] Focused tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
