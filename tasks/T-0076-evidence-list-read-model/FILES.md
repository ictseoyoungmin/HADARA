# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/evidence-list.ts` | Add | Shared evidence list read model and degraded JSONL parsing. |
| `src/cli/evidence.ts` | Update | Add `hadara evidence list --json` handling. |
| `src/cli/main.ts` | Update | Document evidence list CLI usage. |
| `src/mcp/tool-registry.ts` | Update | Dispatch read-only `hadara.evidence.list`. |
| `src/mcp/tool-schemas.ts` | Update | Advertise read-only MCP evidence list tool. |
| `tests/unit/evidence-list.test.ts` | Add | Validate report shape, filtering, limits, and degraded reads. |
| `tests/unit/evidence-json.test.ts` | Update | Cover CLI JSON evidence list behavior near existing evidence JSON tests. |
| `tests/unit/mcp-tools.test.ts` | Update | Cover MCP `hadara.evidence.list` dispatch. |
| `docs/*` and `tasks/T-0076-*/*` | Update | Record state, board, slice, handoff, and evidence. |
