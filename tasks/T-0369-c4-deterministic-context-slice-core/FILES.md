# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-slice.ts` | Add | Implement C4 slice contract, safe reader, source hashing, and explicit-range/tail/keyword/managed-section strategies. | Done |
| `src/schemas/context-slice.schema.json` | Add | Register `hadara.contextSlice.v1` JSON schema. | Done |
| `src/core/schema.ts` | Modify | Load/register the new schema fixture. | Done |
| `src/schemas/schema-index.json` | Modify | Add `hadara.contextSlice.v1` to the schema index. | Done |
| `src/cli/context.ts` | Modify | Add `hadara context slice` CLI routing. | Done |
| `src/services/capability-registry.ts` | Modify | Register the new read-only command metadata. | Done |
| `tests/unit/context-slice.test.ts` | Add | Cover core strategies and safety failures. | Done |
| `tests/unit/context-graph-cli.test.ts` | Modify | Cover CLI JSON behavior and read-only behavior. | Done |
| `tests/unit/command-registry.test.ts` | Modify | Cover command registry metadata for `context.slice`. | Done |
| `tests/unit/schema-fixtures.test.ts` | Modify | Cover schema index alignment for `hadara.contextSlice.v1`. | Done |
