# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0593:8c278e4620644a8a87d755fc | passed | validation | Validation "Focused init/schema tests" passed from direct result; npm test -- tests/unit/schema-fixtures.test.ts tests/unit/init.test.ts tests/unit/schema-command.test.ts tests/unit/command-registry.test.ts passed: 4 files, 36 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0593:655db60d9d76487290d4a1b5 | passed | validation | Validation "Build and Docker build" passed from direct result; npm run build and docker exec hadara-dev bash -lc 'cd /workspace && npm run build' both passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0593:63222e71054c4e07897d4ce9 | passed | validation | Validation "Dist init adoption smoke" passed from direct result; dist CLI smoke passed in /tmp: greenfield basic scaffold created; brownfield standard returned hadara.init.adoption.v1 with writes []; execute without plan hash exited 6 with INIT_ADOPTION_PLAN_HASH_REQUIRED.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0593:fc3afc1b58f3409882c7adf3 | passed | validation | Task finalize done-level readiness for T-0593 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:2dc3952f06471cc44984c5c750b3d1b6fb35ad6f96d67b7356a76748d3979f92 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0593:c3bd2c6f5f87461aa143acdf |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
