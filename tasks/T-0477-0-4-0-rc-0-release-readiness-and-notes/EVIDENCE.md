# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0477:d68e7155025d4ac4a2748c4e | passed | validation | Docker clean-copy npm ci, npm run check, npm run build, and dist refresh passed for hadara@0.4.0-rc.0: 148 test files and 987 tests passed. |
| ev:T-0477:c1d07b3af38d42e2a95e2c98 | passed | validation | Built CLI version smoke passed: node dist/cli/main.js version --json reported packageVersion 0.4.0-rc.0, distLooksStale false, and no issues. |
| ev:T-0477:94932d7e2ded42d1bc00a777 | passed | validation | Release helper shell syntax passed: bash -n scripts/release/manual-publish-rc.sh scripts/release/prepare-publish-env.sh. |
| ev:T-0477:a65852a1ad8143f4a150758d | passed | validation | git diff --check passed for 0.4.0-rc.0 release readiness changes. |
| ev:T-0477:d8567a139d9f450797f36c11 | passed | validation | Done-level harness validation passed for T-0477 with no issues. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0477:cfb3f3280387401786220dbd |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0477:e5c133488d56407286455af9 | blocked | Release publish dry-run returned the expected blocked state without mutation because NPM_TOKEN and GITHUB_TOKEN are absent; manual npm login/operator publish remains required. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
