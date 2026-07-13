# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0591:ccddbbe0e36944b9a5ce6162 | passed | validation | Validation "Host TypeScript build" passed from direct result; npm run build passed for docs mutation hardening changes.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0591:0fa54024a1eb43b98daa82a0 | passed | validation | Validation "Focused docs mutation tests" passed from direct result; Focused vitest suite passed: docs-registry, cli-help-routing, schema-fixtures, command-registry, command-surface-drift, schema-command.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0591:0d08c5ad5f89422981fa956b | passed | validation | Validation "Docker build" passed from direct result; docker exec hadara-dev bash -lc 'cd /workspace && npm run build' passed; full sync wrapper tar stage hung and was not used.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0591:11aee056c4484c4d95fc5e3f | passed | validation | Validation "Built CLI docs mutation smoke" passed from direct result; Built CLI smoke in /tmp verified docs register before-hash execute, missing-hash exit 6, protected archive exit 6, and docs update help exit 0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0591:ce3b957a56234d7f999f92fa | passed | validation | Task finalize done-level readiness for T-0591 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:72b775f01fb14114323cc9c6ec70bd4c35a520fdd5436d33a68825f46cd65ec9 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0591:562ae47e915247ce8c8bf929 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0591:ed80ef8cae3c4bc390ffef66 | blocked | Validation "Full test suite" blocked from direct result; npm test reached 1065 passing tests but 14 environment-related failures from spawnSync EPERM / empty spawned script output; focused docs mutation tests passed.; blocked by operator-supplied direct result; command: direct-result; exitCode: null; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
