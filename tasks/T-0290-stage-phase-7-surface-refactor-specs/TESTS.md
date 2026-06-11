# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| git diff --check | Validate docs-only patch whitespace. | Yes | Passed | Command exited 0. |
| npm run test:focused -- tests/unit/protocol-consistency.test.ts tests/unit/init.test.ts | Lightweight docs/protocol adjacency suggested by the Phase 7.0 spec when available. | No | Not available on host; Docker fallbacks blocked by temp-copy/mounted I/O. | Host failed `vitest: not found`; built Docker wrapper failed at temp-workspace step; direct Docker copy and `/tmp` rsync fallback timed out before tests. |
| test -f docs/specs/0.3.0/... | Confirm canonical Phase 7 spec files and implementation guide exist. | Yes | Passed | Program spec, Phase 7.6 spec, and worker guide file checks exited 0. |
| rg stale rc3 status phrases | Confirm stale rc3 candidate/rc2-latest language is gone from current docs. | Yes | Passed | Search found only the intended `Current published npm RC` row for rc3. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full build/test/Docker baseline | No | Phase 7.0 is docs-only staging with no runtime behavior change. Full runtime validation is required by implementation phases and Phase 7.6. | Deferred | No runtime code changed. |
| Publish/release smoke | No | No release mutation or release artifact work is in scope. | Not Run | TBD |
