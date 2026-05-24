# Decisions

- Keep `hadara hermes export-context` as the only context export path that writes `.hadara/context/HADARA_CONTEXT.md`.
- Implement MCP `hadara.context.export` as a read-only memory report using the same generated context content, with `contextPath: null` and `wouldWritePath` for operator clarity.
