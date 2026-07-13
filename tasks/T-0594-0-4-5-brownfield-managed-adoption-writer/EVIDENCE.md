# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0594:fa8fc333193d4a51a36d6cde | passed | validation | Validation "Focused init writer tests" passed from direct result; npm test -- tests/unit/init.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-command.test.ts tests/unit/command-registry.test.ts tests/unit/docs-registry.test.ts passed: 5 files, 58 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0594:bc8bbe75bbf04b728c121bdd | passed | validation | Validation "Build and Docker build" passed from direct result; npm run build and docker exec hadara-dev bash -lc 'cd /workspace && npm run build' both passed after brownfield writer implementation.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0594:38dde3dbae834bac9bb99e6d | passed | validation | Validation "Dist brownfield execute smoke" passed from direct result; dist CLI /tmp brownfield adoption passed: dry-run plan hash executed, v3 registry written, project currentRelease 9.8.7, AGENTS/.gitignore managed blocks added while preserving existing content, no tasks/.gitkeep.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0594:8cf16b3981cf41eeba00a750 | passed | validation | Task finalize done-level readiness for T-0594 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:f7ae4d8fa74b4b8b686c44f6ff8bb27530360e04a387b39517092eadc8965bd3 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0594:858f0351ecaf46aba22f9edb |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
