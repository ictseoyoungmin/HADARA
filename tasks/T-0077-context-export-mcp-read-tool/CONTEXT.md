# Context

Relevant documents, files, assumptions, and constraints.

- `docs/DEVELOPMENT_SLICES.md` slice 62 names Context Export MCP Read Tool as the next P0 slice.
- `docs/V1_0_CAPSULE_BACKLOG.md` requires `hadara.context.export` to appear in MCP read tools and write no files.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` defines the planned input/output shape with `format`, `summaryOnly`, `mode: "memory"`, `contextPath: null`, and `wouldWritePath`.
- `docs/MCP_BRIDGE_CONTRACT.md` keeps default MCP read-only and states that `hadara.context.export` must not generate or mutate `.hadara/context/HADARA_CONTEXT.md`.
- Existing `src/hermes/context-export.ts` generates the context content and writes the CLI output file; this task should separate those concerns without breaking the CLI path.
