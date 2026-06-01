# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/evidence-lint.test.ts tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/unit/evidence-normalizer.test.ts tests/unit/evidence-semantics.test.ts` | Validate T-0187 lint integration, ready/close compatibility, and T-0186 foundation compatibility. | Yes | Passed: 5 files / 30 tests. | T-0187 focused evidence record. |
| `npm run dev:docker-sync-build` | Full Docker validation and build refresh. | Yes | Passed: 77 files / 541 tests; built CLI smoke ok. | T-0187 Docker sync-build evidence record. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host npm focused test | No | Host Node/npm is not authoritative in current handoff. | Not Run | Docker validation used instead. |
| Protocol/harness semantic gate tests | No | Direct integration is planned for T-0188. | Not Run | Deferred. |
