# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0723:f4f9e6187cd04a8ead32f7e7 | passed | validation | Validation "Focused task close tests" passed; failureClass: none; command: npm test -- --run tests/unit/task-close.test.ts; exitCode: 0; signal: null; durationMs: 6697; stdoutHash: sha256:3b31cbf571f27fd116c8a5d3d426c91623086c0501e14044f8c9d81d597a5bdf; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0723:55b82b8c861849afac6bd477 | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed directly after proof-last changes; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0723:53025d43248648a08cb0b808 | passed | validation | Validation "Full check" passed from direct result; npm run check passed after allowing current rc2 specs: public 136 files/1067 tests, HADARA-dev 16 files/134 tests; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0723:06d0d75452a244599979ee0a | passed | validation | Validation "Diff hygiene" passed from direct result; git diff --check passed; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0723:7f02cf80eb794a358f1f1169 | passed | validation | Task closePlan done-level readiness for T-0723 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:6b9732a35cb56dc6c94c530cff6639d6e89c9670619dbbeb4dbdc35a4296567b |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0723:29d94ac1396e4068b3fdfde6 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0723:44b9a777391240ecbd9930ac | failed | Validation "Full check" failed from direct result; npm run check failed in archive-boundary.test.ts because docs/specs/0.5.0-rc2 is now present and not allowed by the test; failureClass: assertion; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0723:53025d43248648a08cb0b808 |
<!-- /hadara:slot -->
