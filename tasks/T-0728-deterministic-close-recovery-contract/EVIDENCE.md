# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0728:a9679622095d4e91b4832742 | passed | validation | Validation "Focused close/schema tests" passed from direct result; npm test -- --run tests/unit/schema-command.test.ts tests/unit/task-close.test.ts passed: 2 files / 42 tests.; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0728:b7823fbfebdc41b5909dbbeb | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed with tsc -p tsconfig.json.; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0728:f8980b9bf7c7456eaeee86ab | passed | validation | Validation "Full check" passed from direct result; npm run check passed: build, tools typecheck, public tests 136 passed / 1 skipped with 1078 tests passed / 8 skipped, HADARA-dev tests 16 passed with 134 passed / 1 skipped.; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0728:2add06b74804480da6c21933 | passed | validation | Task closePlan done-level readiness for T-0728 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:ff4d95745d94453c0fcc2d41e79b0df95144224942ab6003fb66deeb26211b45 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0728:bea2f63c15ae4b49a071e51b |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
