# Acceptance Criteria

- [x] `hadara.context.export.v1` reports context content with `mode: "memory"`, `contextPath: null`, and `wouldWritePath`.
- [x] Default MCP `tools/list` advertises read-only `hadara.context.export`.
- [x] MCP `hadara.context.export` returns one JSON text payload and does not write `.hadara/context/HADARA_CONTEXT.md`.
- [x] Existing CLI `hadara hermes export-context` still writes the generated context file.
- [x] Context export includes `docs/IMPLEMENTATION_SOP.md` and names it as the implementation, validation, and session-end procedure source.
- [x] `summaryOnly: true` returns warning issue `SUMMARY_ONLY_NOT_IMPLEMENTED` until real summarization exists.
- [x] Focused tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
