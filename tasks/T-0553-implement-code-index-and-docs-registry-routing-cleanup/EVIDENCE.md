# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0553:9dfcaa17c78d494c84aac8b6 | passed | validation | Validation "Focused context routing tests" passed from direct result; npm test -- --run tests/unit/context-graph-builder.test.ts tests/unit/context-pack.test.ts tests/unit/docs-registry.test.ts passed: 3 files, 28 tests; npm run build passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0553:b990814a52c44d89b38b499f | passed | validation | Validation "Docker sync-build full validation" passed from direct result; npm run dev:docker-sync-build passed: Docker npm ci/build/full Vitest passed 148 files / 1022 tests and refreshed workspace dist; built version smoke reported distLooksStale:false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0553:06af419d19144bab937b06cb | passed | validation | Validation "Built context routing smokes" passed from direct result; Built CLI cache warm reported postWriteCacheFresh=true with 5 fresh shards; default context pack for T-0553 reported codeIndexAvailable=true, cacheMode=graph-core+code-index, readShardCount=2, hitShardCount=2, staleShardCount=0; docs read-map kept old Code Link reference spec as conditional-reference while active 0.4.1 rc0 scope remained the only active-spec readFirst entry.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0553:5337fdfa720f4061a6610ee6 | passed | validation | Validation "Baseline routing diagnostic" passed from direct result; Pre-change baseline reproduced T-0548 residuals: default context pack for T-0553 reported codeIndexAvailable=false and readFirst promoted docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md as active-spec; docs read-map showed the same reference spec as active-spec before the fix.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0553:05753848b33c40b590b00905 | passed | validation | Task finalize done-level readiness for T-0553 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:21fbdad9cfcdc465ffe414913c54ea436a03f0585df3d6e089f48cfe68b84848 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0553:ee333bd250274d0192f844a4 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
