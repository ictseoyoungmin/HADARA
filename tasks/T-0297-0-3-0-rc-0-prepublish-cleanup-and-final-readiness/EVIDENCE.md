# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-11T09:36:03.725Z | command-log | Focused Docker tests passed after package metadata and release artifact staging updates: tests/unit/init.test.ts, tests/unit/task-workflow-docs.test.ts, and tests/unit/release-artifact.test.ts passed with 3 files / 31 tests. | passed | public | evidence.jsonl |
| 2026-06-11T09:36:03.725Z | command-log | Initial focused Docker metadata/docs test run failed in release-artifact staging because release artifact package.json still used the old description; README docs tests passed. | failed | public | evidence.jsonl |
| 2026-06-11T09:44:18.863Z | command-log | Docker sync build passed and refreshed dist: npm ci, npm run check, 115 test files / 741 tests, then built CLI version smoke reported 0.3.0-rc.0 with distLooksStale=false. | passed | public | evidence.jsonl |
| 2026-06-11T09:44:39.551Z | command-log | T-0296 ready passed after correcting its task-local handoff to Done / closed. | passed | public | evidence.jsonl |
| 2026-06-11T09:45:40.292Z | command-log | T-0296 close was rerun after the handoff correction; task close --execute appended superseding close evidence and task audit-close returned closed-valid. | passed | public | evidence.jsonl |
| 2026-06-11T09:46:48.618Z | command-log | Package smoke local passed with reduced public evidence. (artifacts/package-smoke/2026-06-11T09-46-48.618Z-summary.json) | passed | public | artifacts/package-smoke/2026-06-11T09-46-48.618Z-summary.json |
| 2026-06-11T09:51:36.223Z | command-log | Clean-checkout smoke failed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-06-11T09-51-36.223Z-summary.json) | failed | public | artifacts/clean-checkout-smoke/2026-06-11T09-51-36.223Z-summary.json |
| 2026-06-11T09:54:05.206Z | command-log | Clean-checkout smoke passed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-06-11T09-54-05.206Z-summary.json) | passed | public | artifacts/clean-checkout-smoke/2026-06-11T09-54-05.206Z-summary.json |
