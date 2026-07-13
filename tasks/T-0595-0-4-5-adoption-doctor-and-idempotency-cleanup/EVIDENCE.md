# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0595:46a89fc5fa184cfca3d9f2f8 | passed | validation | Validation "Init doctor adoption tests" passed from direct result; npm test -- tests/unit/init.test.ts tests/unit/docs-registry.test.ts passed: 2 files, 44 tests, including adoption init doctor clean regression.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0595:7f73392d738548a5a2222c19 | passed | validation | Validation "Build and Docker build" passed from direct result; npm run build and docker exec hadara-dev bash -lc 'cd /workspace && npm run build' both passed after origin-aware init doctor cleanup.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0595:51be57dcef9347bc8826d9f1 | passed | validation | Validation "Adopted project doctor smoke" passed from direct result; dist CLI /tmp adopted brownfield project passed init doctor and docs doctor --scope all with zero issues after adoption execute.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0595:6afa65ab9f3740e1ad3f4c50 | passed | validation | Task finalize done-level readiness for T-0595 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:f687f8ed506d937b3b6a8575b6a43309229cb24b061691820cbc365987fcf83b |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0595:3846b3c3dc454e1c9f3e4ad4 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
