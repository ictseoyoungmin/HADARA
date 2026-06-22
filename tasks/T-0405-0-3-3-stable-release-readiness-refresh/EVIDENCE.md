# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-22T09:46:56.939Z | command-log | Initial T-0405 full Docker JSON validation failed at full-check before dist sync; rerun without JSON was needed to inspect raw output and subsequently passed. | failed | public | evidence.jsonl |
| 2026-06-22T09:46:56.939Z | command-log | T-0405 raw full Docker validation passed after the transient JSON full-check failure: dev docker-check full completed temp workspace, npm ci, and full repository check successfully without publish mutation. | passed | public | evidence.jsonl |
| 2026-06-22T09:46:57.964Z | command-log | T-0405 focused Docker validation with guarded dist sync passed: init/runtime-version/release-dry-run/release-publish tests passed, Docker build ran, dist sync executed, and built CLI version reported packageVersion 0.3.3 with distLooksStale false; git diff --check passed. | passed | public | evidence.jsonl |
| 2026-06-22T09:47:16.338Z | command-log | T-0405 raw full Docker validation passed and resolves the initial transient full Docker JSON failure ev:T-0405:5024d9240beb4313b5abd207; no publish mutation ran. | passed | public | evidence.jsonl |
