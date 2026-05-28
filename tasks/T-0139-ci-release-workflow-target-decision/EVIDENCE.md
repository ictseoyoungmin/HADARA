# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-28T14:05:27Z | test-log | Docker focused release-gate test passed: `tests/unit/operational-debt.test.ts`, 1 file, 24 tests. | passed |
| 2026-05-28T14:06:42Z | test-log | Docker full `npm run check` passed with TypeScript build, 55 test files, and 394 tests. | passed |
| 2026-05-28T14:07:03Z | command-log | Docker built CLI `release gate --mode strict --json --project /tmp/hadara` returned `ok: true` with `CI_RELEASE_WORKFLOW_TARGET_DECISION` passed. | passed |
| 2026-05-28T14:07:52Z | command-log | Docker built CLI `harness validate --task T-0139 --level done --json --project /tmp/hadara` returned `ok: true` with no issues after removing the duplicate Task Board row. | passed |
| 2026-05-28T14:21:24Z | test-log | Docker focused harness validation test passed after adding the done-level duplicate evidence table header guard: 1 file, 17 tests. | passed |
| 2026-05-28T14:21:50Z | test-log | Docker full `npm run check` passed after the hot-fix with TypeScript build, 55 test files, and 395 tests. | passed |
| 2026-05-28T14:21:56Z | command-log | Docker built CLI `harness validate --task T-0139 --level done --json --project /tmp/hadara` returned `ok: true` after the duplicate evidence table header guard. | passed |
