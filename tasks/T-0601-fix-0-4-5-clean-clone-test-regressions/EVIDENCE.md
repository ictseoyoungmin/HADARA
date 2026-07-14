# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0601:5b2a2ce79b1e4da992bee548 | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed after clean-clone init/adoption regression fixes.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0601:fed96a7bc69f41c4bc76f889 | passed | validation | Validation "Focused clean-clone regression tests" passed from direct result; npx vitest run tests/unit/docs-doctor.test.ts tests/unit/session-start.test.ts tests/unit/task-finish.test.ts passed: 3 files, 37 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0601:8907aba9189441969d45d6c5 | passed | validation | Validation "Docker full test suite" passed from direct result; docker exec hadara-dev bash -lc 'cd /workspace && npx vitest run' passed: 153 files, 1096 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0601:d294bf75d06e47e89ed0fdfb | passed | validation | Validation "Docker build" passed from direct result; docker exec hadara-dev bash -lc 'cd /workspace && npm run build' passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0601:df42381d8c614f71babba10e | passed | validation | Task finalize done-level readiness for T-0601 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:35cd5ea4dfbd6b0f4974fc93338d2d337e7c46702649f9314816b7cd5547eeff |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0601:b4a5f7e0dc1a4f09a1006c87 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
