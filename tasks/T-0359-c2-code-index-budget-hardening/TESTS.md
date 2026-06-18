# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec -w /tmp/hadara hadara-dev npm run test:focused -- tests/unit/code-index.test.ts tests/unit/context-graph-builder.test.ts tests/unit/schema-fixtures.test.ts` | Focus code-index budget, include-code projection, and schema fixture coverage. | Yes | Passed: 3 files / 14 tests. | `ev:T-0359:5bd5521857864638b2abde7a` |
| `docker exec -w /tmp/hadara hadara-dev npm run check` | Run build plus full repository tests in Docker validation copy. | Yes | Passed: 130 files / 836 tests. | `ev:T-0359:5bd5521857864638b2abde7a` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec -w /tmp/hadara hadara-dev npm run build` | TypeScript build before dist refresh. | Yes | Passed. | `ev:T-0359:5bd5521857864638b2abde7a` |
| `node dist/cli/main.js version --json` | Built CLI freshness smoke after dist refresh. | Yes | Passed with `build.distLooksStale:false`. | `ev:T-0359:5bd5521857864638b2abde7a` |
| `node dist/cli/main.js context graph --include-code --json > /tmp/t0359-context-graph.json` plus JSON parse | Built include-code smoke for code-index budget projection. | Yes | Passed: budget defaults and usage present in code-index state source. | `ev:T-0359:5bd5521857864638b2abde7a` |
| Nested `node -e` spawn smoke | Optional | Attempted to spawn built CLI from Node for compact parsing. | Failed due sandbox `spawnSync node EPERM`; replaced by direct CLI-to-file smoke. | Recorded in this test note. |
