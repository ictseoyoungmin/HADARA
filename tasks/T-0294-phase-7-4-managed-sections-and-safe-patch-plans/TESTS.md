# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker TypeScript build | `docker exec -w /workspace hadara-dev node node_modules/typescript/bin/tsc -p tsconfig.json`. | Yes | Passed | `EVIDENCE.md` |
| Focused Phase 7.4 tests | `docker exec -w /workspace hadara-dev node node_modules/vitest/vitest.mjs run tests/unit/managed-sections.test.ts tests/unit/docs-patch.test.ts tests/unit/init.test.ts tests/unit/task-create.test.ts tests/unit/task-finish.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts`. | Yes | Passed: 7 files / 53 tests | `EVIDENCE.md` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI smoke | Yes | New managed docs surfaces require command-level smoke. | Passed: init, docs managed list/explain, docs patch dry-run/execute. | `EVIDENCE.md` |
| `git diff --check` | Yes | Whitespace hygiene. | Passed | `EVIDENCE.md` |
| Standard Docker sync wrapper | Yes | Standard HADARA-dev wrapper check. | Blocked: `timeout 120 bash scripts/dev-docker-sync-build.sh --check-only --no-smoke` timed out without output. | `EVIDENCE.md` |
