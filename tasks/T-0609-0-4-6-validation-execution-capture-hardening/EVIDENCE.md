# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0609:d02711fef4904796956f552b | passed | validation | Validation "Focused validation-run tests" passed from direct result; npx vitest run tests/unit/validation-run.test.ts passed directly before wrapper launch failure recording.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0609:8c9a13497748433095153552 | passed | validation | Validation "File capture smoke" passed; command: node -e process.stdout.write('ok'); process.stderr.write('warn'); process.exit(0); exitCode: 0; signal: null; durationMs: 32; stdoutHash: sha256:2689367b205c16ce32ed4200942b8b8b1e262dfc70d9bc9fbc77c49699a4f1df; stderrHash: sha256:aa63925edf225e26d79eca9cebc7639de6dfe576d2d9e4183e162f99e38be7ee |
| ev:T-0609:e3bdac7c97b3473caf2f15ed | passed | validation | Validation "File capture JSON smoke" passed; command: node -e process.stdout.write('ok'); process.stderr.write('warn'); process.exit(0); exitCode: 0; signal: null; durationMs: 31; stdoutHash: sha256:2689367b205c16ce32ed4200942b8b8b1e262dfc70d9bc9fbc77c49699a4f1df; stderrHash: sha256:aa63925edf225e26d79eca9cebc7639de6dfe576d2d9e4183e162f99e38be7ee |
| ev:T-0609:e6fca1ddbc0345c7aac257b2 | passed | validation | Docker dev sync build passed after validation capture hardening; full suite 153 files / 1104 tests passed and distLooksStale=false. |
| ev:T-0609:e8b174f52b1c4c829fd05e69 | passed | validation | Task finalize done-level readiness for T-0609 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:f29189441e92ed6f08c1d7aa68bf2364baee75a8dc6f50f26d7739d4d3c3566e |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0609:2b1d5200723349269e2bd435 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0609:bba6e77fc9d9434387477cf7 | blocked | Validation "Focused validation-run tests" blocked; blocked because validation command could not be launched (EPERM): spawnSync npx EPERM; command: npx vitest run tests/unit/validation-run.test.ts; exitCode: 0; signal: null; durationMs: 12032; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0609:d02711fef4904796956f552b |
<!-- /hadara:slot -->
