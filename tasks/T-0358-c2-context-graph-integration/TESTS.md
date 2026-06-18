# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused tests | Run context graph/code index focused tests. | Yes | Passed | `docker exec -w /tmp/hadara hadara-dev npm run test:focused -- tests/unit/context-graph-builder.test.ts tests/unit/context-graph-cli.test.ts tests/unit/code-index.test.ts tests/unit/command-registry.test.ts` passed 4 files / 24 tests. |
| Docker npm run build | Compile TypeScript before dist refresh. | Yes | Passed | `docker exec -w /tmp/hadara hadara-dev npm run build` passed. |
| Docker npm run check | Run the full repository check when available. | Yes | Passed | Final rerun passed 130 files / 835 tests after adding task-scoped `--include-code` CLI coverage. |
| Built CLI smokes | Verify workspace `dist` context graph and version behavior after refresh. | Yes | Passed | `node dist/cli/main.js version --json` reported `build.distLooksStale:false`; built `context graph --include-code --json` reported SourceFile 175, TestFile 130, Symbol 1047, `IMPLEMENTS_COMMAND` 77, and code-index state source present. |
| git diff --check | Verify whitespace and patch cleanliness. | Yes | Passed | `git diff --check` passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | Yes | This capsule changes a public read-only CLI option. | Passed | Built `node dist/cli/main.js context graph --include-code --json` wrote schema-compatible output to `/tmp/t0358-context-graph.json`; parsed summary was `ok:true`. |

## Notes

| Item | Outcome | Follow-up |
|---|---|---|
| Container `/workspace` focused test attempt | Failed with `vitest: not found` because `/workspace` lacks installed dependencies. | Used the established `/tmp/hadara` validation copy with dependencies. |
| First full `npm run check` attempt | Failed only because `tests/unit/context-graph-schema.test.ts` still expected C1-only vocabularies. | Updated the test to assert additive C1/C2 vocabularies and reran full check successfully. |
| Validation evidence | Final evidence is `ev:T-0358:407b29c183f246d390f162f9`; earlier `ev:T-0358:19f72b46d18f45f09d5a2ba1` was superseded after adding task-scoped option coverage. | Use the final evidence id for handoff/state references. |
| Nested `execFileSync('node', ...)` smoke helper | Failed with sandbox `spawnSync node EPERM`. | Replaced it with direct CLI execution to `/tmp/t0358-context-graph.json` and parsed the result. |
