# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/protocol-consistency.test.ts tests/harness/harness-validate.test.ts tests/unit/evidence-lint.test.ts tests/unit/evidence-semantics.test.ts` | Validate protocol/harness semantic gates and shared lint/analyzer compatibility. | Yes | Passed: 4 files / 55 tests. | T-0188 focused evidence record. |
| `npm run dev:docker-sync-build` | Full Docker validation and build refresh. | Yes | Passed: 77 files / 544 tests; built CLI smoke ok. | T-0188 Docker sync-build evidence record. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host npm focused test | No | Host Node/npm is not authoritative. | Not Run | Docker validation used instead. |
| Dashboard/TUI rendering | No | T-0189 contract work follows this capsule. | Not Run | Deferred. |
