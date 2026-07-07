# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0510:14f8ebc85ed5466ab51be7be | passed | validation | Validation "bash -n scripts/release/manual-publish-rc.sh" passed from direct result; Shell syntax passed for manual-publish-rc.sh after replacing stale package smoke command.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0510:fb14e919c4a44bc2bd499828 | passed | validation | Validation "bash scripts/release/manual-publish-rc.sh --help" passed from direct result; manual-publish-rc.sh help rendered current T-0509 examples and exited 0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0510:85f18464c12c47698a85df05 | passed | validation | Validation "npm run build" passed from direct result; TypeScript build passed after manual publish helper command-surface fix.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0510:4fd82837a221488dbdc309b3 | passed | validation | Validation "docker exec hadara-dev ... npx vitest run tests/unit/manual-publish-script.test.ts --reporter=dot" passed from direct result; Docker/ext4 focused manual publish script regression test passed: 1 file / 5 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0510:63107d158a5947a3835a19bd | passed | validation | Task finalize done-level readiness for T-0510 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:2276b795cc0747eac94b4d3d7fc78b29bec64bdfda1e29bffddfa43dbd79c55d |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0510:dcfb5c0d1fd74bc09c665957 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
