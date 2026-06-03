# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/evidence-migration.test.ts tests/unit/schema-fixtures.test.ts tests/unit/evidence-json.test.ts tests/unit/evidence-list.test.ts tests/unit/evidence-normalizer.test.ts tests/unit/evidence-lint.test.ts tests/harness/harness-validate.test.ts` | Focused migration/evidence compatibility suite. | Yes | Passed: 7 files / 67 tests. | Docker `/tmp/hadara` validation. |
| `npm run build` | TypeScript build. | Yes | Passed. | Docker `/tmp/hadara` validation. |
| `npm run dev:docker-sync-build` | Full reproducible check and `/workspace/dist` refresh. | Yes | Passed: 92 files / 606 tests; built CLI smoke `ok:true`, `distLooksStale:false`. | Host-side Docker sync-build. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI execute smoke | Yes | Proves built command can rewrite a copied task's `evidence.jsonl` with a matching before hash. | Passed: `/tmp` copy of T-0015 rewrote 5 records; post-preview reported v1 0, v2 5. | Built CLI smoke on temp workspace copy. |
| Built CLI mismatch smoke | Yes | Proves execute refuses drift without writes. | Passed: mismatch returned `EVIDENCE_MIGRATION_BEFORE_HASH_MISMATCH`. | Built CLI smoke on temp workspace copy. |
