# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0713:281f60216d504530a9742fe9 | passed | validation | Validation "Focused regressions per fix" passed; failureClass: none; command: npx vitest run tests/unit/task-finalize.test.ts tests/unit/task-close.test.ts tests/unit/validation-run.test.ts tests/unit/init-v1-transaction.test.ts tests/unit/task-board-v1.test.ts; exitCode: 0; signal: null; durationMs: 8533; stdoutHash: sha256:42ba4747e8d65d156e34cf07706c522874c2a634f314896094787ded0836c200; stderrHash: sha256:184337221e5ebbb9fe2b9a63d6c54e9e18c2f046759a71c12edff1cf97e56f8c |
| ev:T-0713:9579d8d40a884e61a7950ec5 | passed | validation | Validation "Live CLI repro of the close-atomicity fix" passed from direct result; Fresh incomplete task: task close --dry-run then --execute --plan-hash <hash> returned mode: execute-refused, zero writes, and TASK.md Status stayed Draft.; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0713:a95861c52b1d4fd2b72c70ca | passed | validation | Validation "Full repository validation" passed; failureClass: none; command: npm run check; exitCode: 0; signal: null; durationMs: 31481; stdoutHash: sha256:f30d45394024a4a381c57f93d8ecbc6ceeeaa86e88ddbe5c78ceeddb9a5795fd; stderrHash: sha256:184337221e5ebbb9fe2b9a63d6c54e9e18c2f046759a71c12edff1cf97e56f8c |
| ev:T-0713:cdb679aeff3d4525ac2dbcfd | passed | validation | Validation "Diff hygiene" passed; failureClass: none; command: git diff --check; exitCode: 0; signal: null; durationMs: 27; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0713:051412e896234fea9c685190 | passed | validation | Task finalize done-level readiness for T-0713 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:ae31823b9bd18e61281f5e8c703a89fca687e7dd2f138bc56a2c631fcf626541 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0713:7637ce5ddd044e6182067147 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
