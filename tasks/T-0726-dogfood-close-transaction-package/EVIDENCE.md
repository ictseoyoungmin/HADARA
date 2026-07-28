# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0726:9e8c145718bc4ffdb8d39fbc | passed | validation | Validation "Installed package close dogfood" passed from direct result; Packed hadara-0.5.0-rc.1 with /tmp npm cache, installed tarball into /tmp project, ran installed governed init, task create, blocked close, clean close closed-valid, and identical retry no-op; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0726:3ac0d61a87ea435f9d163e75 | passed | validation | Validation "Focused harness and close tests" passed from direct result; npm test -- --run tests/unit/task-close.test.ts tests/unit/harness-validate.test.ts tests/unit/init.test.ts passed: 2 files / 65 tests; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0726:a94142ac355a45fc8e924713 | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed before installed package dogfood; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0726:9887ae80871749bea0530aac | passed | validation | Validation "Full check" passed from direct result; npm run check passed: public 136 files/1069 tests, HADARA-dev 16 files/134 tests; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0726:98a86ae0fd384353a2737ad9 | passed | validation | Validation "Diff hygiene" passed from direct result; git diff --check passed; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0726:289f5c88682f44e6851e2a8b | passed | validation | Task closePlan done-level readiness for T-0726 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:08fae290e410fa4cee7cd7109ae1b375770b1ce39e289c0e8e54a2ec5dfa28d8 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0726:f4e1ffe848684f70b8c80a61 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
