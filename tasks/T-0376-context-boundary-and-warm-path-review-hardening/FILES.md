# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-slice.ts` | Edit | Align raw slice denylist with generated/local ignored boundaries. | Done |
| `tests/unit/context-slice.test.ts` | Edit | Add denied generated/local boundary coverage and allowed docs-registry behavior. | Done |
| `tests/unit/context-cache-store.test.ts` | Edit | Add graph-core stale/corrupt shard regression coverage. | Done |
| `tests/unit/context-graph-builder.test.ts` | Edit | Add graph-core shard-path assertion for include-code cached graph reports. | Done |
| `scripts/context-routing-performance-baseline.mjs` | Edit | Harden benchmark child timeout and error handling. | Done |
| `tests/unit/context-routing-performance-baseline-script.test.ts` | Add | Add script-level timeout/error behavior coverage. | Done |
| `src/context/context-pack.ts` | Edit | Add structured `suggestedCommandArgs` to slice candidates and shell-quoted display command. | Done |
| `src/schemas/context-pack.schema.json` | Edit | Add schema-visible `suggestedCommandArgs` for slice candidates. | Done |
| `tests/unit/context-pack.test.ts` | Edit | Assert structured command args and shell quoting. | Done |
