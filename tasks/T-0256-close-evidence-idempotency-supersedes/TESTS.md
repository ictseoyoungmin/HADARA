# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-sync-build` | Standard Docker build, full test suite, dist refresh, and built CLI version smoke. | Yes | Passed: 94 files / 641 tests; built CLI version smoke returned `ok:true`, `distLooksStale:false`. | Evidence record. |
| `node dist/cli/main.js task close --task T-0255 --json` | Built CLI smoke for changed-source close supersedes planning. | Yes | Passed: emitted `closeEvidenceWrite.duplicateAction: append` and `supersedes` for the latest T-0255 close proof after T-0256 changed Task Board. | Evidence record. |
| `node dist/cli/main.js task audit-close --task T-0255 --json` | Built CLI smoke for additive close audit metadata. | Yes | Passed: emitted `closeEvidenceAudit.latestCloseEvidenceId`, duplicate count 0, and verdict `stale` for expected Task Board source drift. | Evidence record. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Focused close/evidence tests | No | Covered by full Docker suite; separate focused run was not needed after full validation. | Passed within full suite: `tests/unit/task-close.test.ts` 7 tests, `tests/unit/evidence-json.test.ts` 15 tests. | Docker sync-build output. |
