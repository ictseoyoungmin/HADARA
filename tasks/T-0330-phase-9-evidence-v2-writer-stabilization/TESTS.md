# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Host `npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/evidence-semantics.test.ts tests/unit/evidence-lint.test.ts tests/unit/evidence-v2-plan-docs.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/command-registry.test.ts tests/unit/init.test.ts` | Host focused writer, semantic, and docs/registry coverage. | No | Blocked: host `node_modules` lacks `vitest`; Docker validation used instead. | `ev:T-0330:bbe12677ce5b4844ae6dfcde` |
| Docker `npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/evidence-semantics.test.ts tests/unit/evidence-lint.test.ts tests/unit/evidence-v2-plan-docs.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/command-registry.test.ts tests/unit/init.test.ts` | Focused writer, semantic, and docs/registry coverage. | Yes | Passed: 7 files / 70 tests. | `ev:T-0330:e3a494f054a749089098ac64` |
| Docker `npm run check` plus `npm run build` and `/workspace/dist` refresh | Full repository validation and built CLI refresh. | Yes | Passed: 119 files / 781 tests; build passed; workspace `dist` refreshed. | `ev:T-0330:89c60f19499f43e5a2616641` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI smoke for `evidence add-command --category --outcome --resolves --supersedes`. | Yes | Proves the built command surface writes expected v2 metadata. | Passed: recorded decision outcome and supersedes tag with legacy result `unknown`. | `ev:T-0330:4faf84f9dd7a45e8b353d7d9` |
