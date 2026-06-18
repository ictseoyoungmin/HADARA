# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused `npm run build` plus `npm run test:focused -- tests/unit/context-cache-store.test.ts tests/unit/context-source-manifest.test.ts tests/unit/context-graph-cli.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts tests/unit/command-registry.test.ts` | Validate C6.2 cache status/store/CLI/schema behavior. | Yes | Passed | `ev:T-0364:e80f8a290ea74e8c97ff34c1` |
| `npm run dev:docker-sync-build` | Preferred full Docker suite and dist refresh. | Yes | Passed on rerun: 133 files / 855 tests, `dist` refreshed, version smoke `distLooksStale:false`. First attempt hit an unrelated `dashboard-static` 5s timeout; standalone rerun of that file passed. | `ev:T-0364:dab623159edd409a9767f25a` |
| Built CLI `node dist/cli/main.js context cache status --json` | Verify refreshed `dist` exposes the new read-only status command. | Yes | Passed: returned `hadara.context.cacheStatus.v1`, `readOnly:true`, mode `miss`. | `ev:T-0364:1e4fa5a72fbe4ad08d016cf6` |
| Final Docker focused revalidation after shared docs updates | Recheck build plus cache, CLI, schema, registry, workflow-docs, and schema-stability coverage after close-source docs changed. | Yes | Passed: 8 files / 56 tests. | `ev:T-0364:9a5fef9dea9f4b3ba308ab17` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No secrets/private evidence boundary changes expected. | Not Run | N/A |
| Integration smoke | No | C6.2 adds a read-only status command, not graph/cache integration. | Not Run | N/A |

## Notes

An accidental `evidence add-command --task T-0364 --help` invocation appended one `unknown` command evidence row before the correct validation evidence was recorded. It is intentionally retained rather than hand-edited out of `evidence.jsonl`.
