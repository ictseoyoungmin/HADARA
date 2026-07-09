# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0543:517b75fb0f7e40d494f38758 | passed | validation | Validation "Focused unit tests" passed from direct result; Docker build plus focused Vitest passed for context registry/release/state/pack, task selection, context slice, evidence JSON, and validation run: 8 files / 85 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0543:44ab2482aafe493d8c25f304 | passed | validation | Validation "Docker build and version smoke" passed from direct result; Docker direct validation passed: npm run build, focused Vitest 8 files / 85 tests, and node dist/cli/main.js version --json reported distLooksStale:false for packageVersion 0.4.2-rc.0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0543:0d80024ae7f5495da975cdda | passed | validation | Validation "Fresh consumer smoke" passed from direct result; Built CLI initialized /tmp/hadara-t0543-consumer-smoke, task status --json recommended hadara task create 'Create first Task Capsule', task create produced T-0001, context pack omitted HADARA-dev-only source/release warnings, and context slice EOF clamp returned summary.truncated=false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0543:8fffcd9e3c044972b8719191 | passed | validation | Validation "Whitespace diff check" passed from direct result; git diff --check completed with no whitespace errors.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0543:15ae43c8426644b88c09d235 | passed | validation | Task finalize done-level readiness for T-0543 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:75092454167a8346ecfd93e82e6bb375c0eb2dbdc489f487dda3c90bc959ca50 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0543:7e098ddd918a42cc9f1d7d19 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
