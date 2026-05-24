# Plan

1. Read relevant docs.
2. Split context export generation from file writing so a read-only report can reuse the content builder.
3. Add `hadara.context.export` to MCP schemas and dispatch.
4. Add unit/contract coverage for memory-mode output and no file mutation.
5. Run Docker validation, attach evidence, and update project docs/handoff.
