# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:unit -- tests/unit/dev-docker-script.test.ts | Focus helper script/package wiring. | Yes | Passed: 58 files / 427 tests | T-0179 evidence |
| npm run dev:docker-check | Run the helper in check-only mode. | Yes | Passed: 70 files / 504 tests | T-0179 evidence |
| npm run dev:docker-sync-build | Run the helper with dist refresh and runtime version smoke. | Yes | Passed: 70 files / 504 tests plus runtime smoke | T-0179 evidence |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Done-level harness validate T-0179 | Yes | Capsule completion gate. | Passed | T-0179 evidence at 2026-05-31T10:06:14.752Z |
| Close audit T-0179 | Yes | Post-close audit after evidence is recorded. | Passed | Close audit returned ok:true with one close evidence record and zero warnings. |
