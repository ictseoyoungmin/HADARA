# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0579:ec780f1860244bdcac80bc0b | passed | validation | Validation "npm pre-publish availability" passed from direct result; npm view hadara@0.4.4-rc.0 version returned E404, confirming the exact release-candidate version is not yet published before operator publish.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0579:99e9627ede96433f97a13ab1 | passed | validation | Validation "Docker full check" passed from direct result; Docker hadara-dev /workspace npm run check passed after test stability fixes: 153 test files and 1068 tests passed; build completed before tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0579:1e85fffe14f2401b88aa8211 | passed | validation | Validation "Built CLI version smoke" passed from direct result; node dist/cli/main.js version --json reported packageVersion 0.4.4-rc.0 and distLooksStale false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0579:370b652d038c4ec6a01c42cb | passed | validation | Validation "Docs doctor currentness" passed from direct result; node dist/cli/main.js docs doctor --json returned health healthy, currentnessVerdict clean, zero currentness issues, and zero semantic drift issues.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0579:e57bc1d6ce8f429d98d5eda8 | passed | validation | Validation "Strict release gate" passed from direct result; node dist/cli/main.js release gate --mode strict --json returned ok true with all release gate checks passed and no issues.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0579:6e24094f13f742518692b9e2 | passed | validation | Task finalize done-level readiness for T-0579 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:982a07f28f505b69006dcec2f62045f84a25f4aed221692d3bb150365f790e43 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0579:45bc5d90c1e6455198f2c915 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
