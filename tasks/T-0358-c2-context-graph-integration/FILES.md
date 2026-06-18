# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-graph.ts` | Modify | Extend graph types additively for code file/symbol node and code edge families. | Done |
| `src/context/context-graph-builder.ts` | Modify | Include code index extraction when `includeCode` is requested. | Done |
| `src/context/code-graph-extractor.ts` | Add | Convert `hadara.codeIndex.v1` file/symbol/edge output into context graph extraction results. | Done |
| `src/context/state-projection.ts` | Modify | Keep optional state summary fields schema-valid when source hints are absent. | Done |
| `src/cli/context.ts` | Modify | Parse and pass `--include-code` for graph/task graph output. | Done |
| `src/context/code-index.ts` | Inspect | Reuse code index report data for graph conversion. | Done |
| `tests/unit/context-graph-builder.test.ts` | Modify | Cover code-aware graph report behavior. | Done |
| `tests/unit/context-graph-cli.test.ts` | Modify | Cover CLI `--include-code` behavior. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Modify | Document additive context graph option. | Done |
| `docs/COMMAND_SURFACE.md` | Modify | Keep command documentation aligned with `context graph --include-code`. | Done |
| `docs/SCHEMAS.md` | Modify | Align code index schema notes with graph integration status. | Done |
| `tasks/T-0358-c2-context-graph-integration/*` | Modify | Keep capsule docs, evidence, and handoff current. | In Progress |
