# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-23T15:34:52+09:00 | focused-test | Docker `npm test -- tests/unit/dashboard-static.test.ts tests/unit/status-json.test.ts` passed: 2 files, 8 tests. | pass |
| 2026-05-23T15:34:52+09:00 | full-check | Docker `npm ci && npm run check` passed: 29 files, 150 tests. | pass |
| 2026-05-23T15:36:20+09:00 | done-validation | Docker built CLI `harness validate --task T-0056 --level done --json` failed because `evidence.jsonl` used non-HADARA evidence fields; evidence index corrected. | fail |
| 2026-05-23T15:39:12+09:00 | done-validation | Docker built CLI `harness validate --task T-0056 --level done --json` returned `ok: true`. | pass |
