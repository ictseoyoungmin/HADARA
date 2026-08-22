# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0793:558ef94618cb46e3adb5da8a | passed | validation | Validation "Direct-result CLI recovery guidance" passed from direct result; validation-run and help focused tests passed, including shell-safe argv recovery and sensitive-argv redaction; failureClass: none; command: npm test -- --run tests/unit/validation-run.test.ts; argvHash: sha256:7ed8d14d396aa8bf27ba9f5efc00225ee4bbd66e4ac953e4865a3cd62b0aba61; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0793:7659a94c300c43b3a34a8d06 | passed | validation | Validation "Release helper partial-publication recovery" passed from direct result; HADARA-dev manual publish helper regression passed 10 tests, including GitHub-only resume with no second npm publish; failureClass: none; command: npm run test:hadara-dev -- --run tests/unit/manual-publish-script.test.ts; argvHash: sha256:997e1298cf0efebadab3b3f16271ed50c030c56802f77fac211ae5447fe9ae32; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0793:74671c05dd13448b8e487d83 | passed | validation | Validation "Docker full check" passed from direct result; Canonical dev:docker-check passed core 131 files and 1,072 tests plus HADARA-dev 18 files and 145 tests, with build and tools typecheck; failureClass: none; command: npm run dev:docker-check; argvHash: sha256:64e5495454b85ed6179ff42172394e25db8c3b2472cb1b28272fafb64ed05920; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0793:33f6b9b689f246d79b807abd | passed | validation | Validation "Source hygiene" passed from direct result; Shell syntax checks and git diff --check passed; failureClass: none; command: git diff --check; argvHash: sha256:7c730eec3ea71bd24ffc5a9255bf7f542481bf601dba6c72bed6e00f6c2fab3c; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0793:5cc96c6523f74368bfb7384b | passed | validation | Task closePlan done-level readiness for T-0793 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:f2c94e06954abc20df3f5a54a1387f07924a52d7ffe3682c84c38ccc25b00614 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0793:b5c9863863a448c88dad4198 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
