# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-23T16:27:44+09:00 | focused-test | Docker `npm test -- tests/unit/dashboard-static.test.ts tests/unit/status-json.test.ts` passed: 2 files, 10 tests. | pass |
| 2026-05-23T16:27:44+09:00 | full-check | Docker `npm ci && npm run check` passed: 29 files, 152 tests. | pass |
| 2026-05-23T16:29:08+09:00 | done-validation | Docker built CLI `harness validate --task T-0057 --level done --json` failed because `TESTS.md` lacked standard `## Required` and `## Optional` markers; capsule tests doc corrected. | fail |
| 2026-05-23T16:31:30+09:00 | done-validation | Docker built CLI `harness validate --task T-0057 --level done --json` returned `ok: true`. | pass |
| 2026-05-23T16:50:28+09:00 | done-validation | Docker built CLI `harness validate --task T-0057 --level done --json` returned `ok: true` after normalizing capsule Markdown format to match prior task style. | pass |
