# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add precise fragment fields additively instead of changing schema id. | Accepted | The report remains `hadara.handoff.suggestion.v1` and schema allows additive fields; existing consumers keep `suggestedMarkdown`. | Schema fixture and handoff suggestion tests passed. |
| D-2 | Keep handoff suggestion read-only. | Accepted | Phase 6.1 explicitly excludes automatic shared-doc writes. | Built `--execute` smoke returned `HANDOFF_SUGGEST_EXECUTE_UNSUPPORTED`. |
