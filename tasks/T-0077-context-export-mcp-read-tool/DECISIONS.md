# Decisions

- Keep `hadara hermes export-context` as the only context export path that writes `.hadara/context/HADARA_CONTEXT.md`.
- Implement MCP `hadara.context.export` as a read-only memory report using the same generated context content, with `contextPath: null` and `wouldWritePath` for operator clarity.
- Include `docs/IMPLEMENTATION_SOP.md` in default context export and name it in the header so external agents treat it as the authoritative workflow.
- Accept `summaryOnly` for schema compatibility, but return `SUMMARY_ONLY_NOT_IMPLEMENTED` until actual summary generation exists.
