# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker TypeScript build | `docker exec -w /workspace hadara-dev node node_modules/typescript/bin/tsc -p tsconfig.json`. | Yes | Passed | `EVIDENCE.md` |
| Focused Phase 7.3 tests | `docker exec -w /workspace hadara-dev node node_modules/vitest/vitest.mjs run tests/unit/docs-registry.test.ts tests/unit/docs-doctor.test.ts tests/unit/init.test.ts tests/unit/schema-fixtures.test.ts tests/unit/command-registry.test.ts tests/unit/tools-list.test.ts tests/unit/tools-list-command-registry.test.ts`. | Yes | Passed: 7 files / 45 tests | `EVIDENCE.md` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI smoke | Yes | New CLI docs surfaces require command-level smoke. | Passed: init, docs list, docs doctor, docs explain | `EVIDENCE.md` |
| `git diff --check` | Yes | Whitespace hygiene. | Passed | `EVIDENCE.md` |
| Standard Docker sync wrapper | Yes | Standard HADARA-dev wrapper check. | Blocked: `timeout 120 bash scripts/dev-docker-sync-build.sh --check-only --no-smoke` timed out without output. | `EVIDENCE.md` |
