# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0794:15935bc2b76e4acb976d635d | passed | validation | Validation "Release recovery state machine" passed from direct result; manual-publish-script.test.ts passed 10/10, including npm-only report persistence, later --github-only recovery, registry mismatch refusal before GitHub mutation, and no second npm publish; failureClass: none; command: npm run test:hadara-dev -- --run tests/unit/manual-publish-script.test.ts; argvHash: sha256:997e1298cf0efebadab3b3f16271ed50c030c56802f77fac211ae5447fe9ae32; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0794:a591b96e657748ff884ea464 | passed | validation | Validation "Destination report schema" passed from direct result; schema-runtime passed 23/23 and release-current-state passed 2/2; GitHub repository/git remote fields validate and legacy-compatible report shapes remain accepted; failureClass: none; command: npm test -- --run tests/unit/schema-runtime.test.ts; argvHash: sha256:6deb99341b4222c5223332ee225c1f2e3b88d8b5f63fe2c5619c30cffd450768; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0794:833e044b4bf74af798bda985 | passed | validation | Validation "Docker full check" passed from direct result; dev:docker-check passed: core 131 files/1072 tests and HADARA-dev 18 files/145 tests, including build and typecheck; failureClass: none; command: npm run dev:docker-check; argvHash: sha256:64e5495454b85ed6179ff42172394e25db8c3b2472cb1b28272fafb64ed05920; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0794:2ba8ca10632b4d96bf69b22c | passed | validation | Validation "Source hygiene" passed from direct result; manual-publish-rc.sh passed bash -n and repository passed git diff --check; failureClass: none; command: git diff --check; argvHash: sha256:7c730eec3ea71bd24ffc5a9255bf7f542481bf601dba6c72bed6e00f6c2fab3c; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0794:3216f44ee095473099b14034 | passed | validation | Task closePlan done-level readiness for T-0794 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:2a7b32545018a1ff4cde2797086b6873ca5656411e2171570185988930ae4363 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0794:7e2eed5795044217a087cb0d |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
