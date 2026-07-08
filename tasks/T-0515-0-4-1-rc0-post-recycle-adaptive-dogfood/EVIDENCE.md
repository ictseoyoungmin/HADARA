# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0515:d2ff92a938974a5983536eac | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0515:a20385b3ade94850976abe9c | passed | validation | Validation "Fresh tmp toy lifecycle dogfood" passed from direct result; Fresh governed project /tmp/hadara-t0515-toy-vv65sh initialized, created T-0001, ran node tests/calculator.test.mjs, recorded validation through direct-result, finalized with state closed-valid, and state verify reported consistent:true with no errors/warnings.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0515:0886f8668a314f6c83be452f | passed | validation | Validation "Package recycle adaptive dry-run" passed from direct result; node dist/cli/main.js package recycle --package hadara@next --expected-version 0.4.1-rc.0 --json passed and planned command-surface plus task-status steps.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0515:6a518f6681b248139ea1f343 | passed | release | Sandboxed package recycle registry lookup failure was resolved by an approved network rerun; the rerun passed with observedVersion 0.4.1-rc.0, commandSurfaceExecuted true, taskStatusExecuted true, and taskLifecycleExecuted false. |
| ev:T-0515:a4dcb78c38c44926a83ce36c | passed | validation | Task finalize done-level readiness for T-0515 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:d7727b3314c16468e56efe5f6135dacca8dc5468ed1fc2867fb7995d950d17aa |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0515:56b7d2fd12a94831bd1663a8 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0515:a327f97670c24806a29343c4 | failed | Installed-package recycle failed with reduced public evidence. | Resolved | ev:T-0515:6a518f6681b248139ea1f343 |
<!-- /hadara:slot -->
