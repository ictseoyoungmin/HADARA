# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0503:d5ceb1ae861c4347bed3fb62 | passed | validation | Focused Docker tests passed: cli-help-routing plus package/release/dev adjacent suites, 8 files / 80 tests; TypeScript build passed. |
| ev:T-0503:fd0b99de773b4bc28676d048 | passed | validation | Built CLI help smokes passed for package smoke, package recycle, dev docker-check, release dry-run, release closeout, release publish --execute, release artifact --execute --attach-evidence, and release gate with invalid mode; each exited 0 and rendered registry-backed command help. |
| ev:T-0503:1501f4312a434f9397776ccf | passed | validation | Validation "Resolve T-0503 handoff placeholder repair" passed; command: node dist/cli/main.js harness validate --task T-0503 --level draft --json; exitCode: 0; signal: null; durationMs: 492; stdoutHash: sha256:89abd6b1daec767135f00b9c5b146944bacf7af5c3d5dec9ed7411d8ba8f7aee; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0503:39e5f4d5a3fe4811ba7b7bb3 | passed | validation | Validation "Harness validate T-0503" passed; command: node dist/cli/main.js harness validate --task T-0503 --level done --json; exitCode: 0; signal: null; durationMs: 644; stdoutHash: sha256:8c9db2c3bd3c381c2d77d2ebfa0baf982fbc1ffc3fbd9f53bb22ac33cf5dd895; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0503:673dd9cf6ae841a5bf6cfd32 | passed | validation | Validation "Harness validate T-0503 final" passed; command: node dist/cli/main.js harness validate --task T-0503 --level done --json; exitCode: 0; signal: null; durationMs: 634; stdoutHash: sha256:8c9db2c3bd3c381c2d77d2ebfa0baf982fbc1ffc3fbd9f53bb22ac33cf5dd895; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0503:02aa71aa34dd4639b44b3650 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0503:91a8d084c28b4f5aa87e6b86 | failed | Validation "Harness validate T-0503" failed; command: node dist/cli/main.js harness validate --task T-0503 --level done --json; exitCode: 6; signal: null; durationMs: 944; stdoutHash: sha256:ada7f5bf17bbaf72c7bb1eb01fe2bd1509c6729f3d6a28a54715b7bedd26406c; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0503:1501f4312a434f9397776ccf |
<!-- /hadara:slot -->
