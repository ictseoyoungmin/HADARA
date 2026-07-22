# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0680:b9c381304c98458fa5a3ada0 | passed | validation | Validation "Focused status, selection, current-state, docs, init, and schema tests" passed from direct result; Corrected expanded focused suite passed: 12 test files and 181 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0680:d3678aba966b4b0fad7d8aa3 | passed | validation | Validation "Full source check" passed from direct result; Docker npm run check passed: TypeScript build plus 166 of 166 test files and 1240 of 1240 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0680:f15442d885a4472c8397a8f9 | passed | validation | Validation "Built CLI missing/malformed checkpoint smokes" passed from direct result; Built CLI selected T-0001 from Markdown after current.json was moved; malformed-checkpoint unit coverage passed in the focused and full suites.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0680:a562dd5b60094d8d8bcb6ee0 | passed | validation | Validation "Task close dry-run" passed from direct result; Reviewed close plan is executable with no blocking issues; finish bookkeeping is the only planned write before deferred close checks.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0680:68d9d941aeee4002b7804481 | passed | validation | Task finalize done-level readiness for T-0680 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:f32f745ce2d2187612725db7db7cef74dd8f5f5eda04b2025b448e22c1606b67 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0680:fff20d1ab9944f03979dc415 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0680:4c07454c20234727815d4a41 | failed | Validation "Focused status, selection, current-state, docs, init, and schema tests" failed from direct result; Initial focused run exposed 12 stale precedence and documentation expectations across 4 of 10 test files; implementation and fixtures were corrected.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0680:b9c381304c98458fa5a3ada0 |
| ev:T-0680:f426a74eb7c34e7c9f572cad | failed | Validation "Task close dry-run" failed from direct result; Initial close dry-run found invalid HANDOFF disposition ready; corrected to controlled value actionable.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0680:a562dd5b60094d8d8bcb6ee0 |
<!-- /hadara:slot -->
