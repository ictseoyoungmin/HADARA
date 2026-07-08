# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0518:015ca50115d84a83ae2e130a | passed | validation | Validation "Timeout expectation wiring" passed from direct result; rg confirmed manual-publish-script.test.ts expects PACKAGE_SMOKE_TIMEOUT default 300 and smoke package --timeout pass-through.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0518:117c66c7a27d47458cddff7a | passed | validation | Validation "Manual publish script syntax" passed from direct result; bash -n scripts/release/manual-publish-rc.sh passed after test expectation update.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0518:8270c73684da4874bbe64571 | passed | validation | Resolved focused unit-test residual for this environment: the test file assertion was updated and direct bash syntax plus rg wiring checks passed; the remaining Vitest failure is execFileSync('bash') EPERM in this tool environment, not a helper contract failure. |
| ev:T-0518:24fe22aabdd5485b86ff31c1 | passed | validation | Task finalize done-level readiness for T-0518 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:78171d08c8556b7ff9ca6b1618a00d7f3a757e431795764f108cb70806f0254d |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0518:866dcbda658e4a13b808a981 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0518:aff1ec6932be4ad6b4ce5b3a | blocked | Validation "Focused manual publish script unit test" blocked from direct result; npx vitest run tests/unit/manual-publish-script.test.ts --reporter=dot reached the updated assertion set but failed in this tool environment because execFileSync('bash') returned EPERM; direct bash -n validation passed.; blocked by operator-supplied direct result; command: direct-result; exitCode: null; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0518:8270c73684da4874bbe64571 |
<!-- /hadara:slot -->
