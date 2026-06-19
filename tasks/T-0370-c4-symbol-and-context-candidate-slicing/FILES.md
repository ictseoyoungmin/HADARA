# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-slice.ts` | Modified | Add symbol-neighborhood and context-candidate resolution while preserving T-0369 safety/read-only behavior. | Done |
| `src/cli/context.ts` | Modified | Add `--symbol`, `--task`, and `--candidate` option plumbing. | Done |
| `src/schemas/context-slice.schema.json` | Modified | Add `context-candidate`, symbol/candidate issue codes, and confidence metadata. | Done |
| `src/schemas/context-pack.schema.json` | Modified | Add candidate line/symbol/managed-section hints used by C4 delegation. | Done |
| `src/services/capability-registry.ts` | Modified | Update `context.slice` command metadata and examples. | Done |
| `tests/unit/context-slice.test.ts` | Modified | Cover symbol and candidate service behavior. | Done |
| `tests/unit/context-graph-cli.test.ts` | Modified | Cover CLI JSON behavior for symbol paths. | Done |
| `docs/COMMAND_SURFACE.md` | Modified | Reflect the full C4 public CLI surface. | Done |
| `docs/SCHEMAS.md` | Modified | Reflect completed symbol/candidate schema support. | Done |
| `src/schemas/schema-index.json` | Modified | Update context-slice registry notes for completed symbol/candidate support. | Done |
| `docs/PROJECT_STATE.md` | Modified | Record T-0370 result and next C5/C6 route. | Done |
| `docs/AGENT_HANDOFF.md` | Modified | Update next-session state after C4 completion. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Modified | Add T-0370 completion row. | Done |
| `docs/TASK_BOARD.md` | Modified | Mark T-0370 done with summary. | Done |
