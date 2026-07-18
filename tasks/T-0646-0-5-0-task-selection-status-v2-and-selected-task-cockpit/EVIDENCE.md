# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0646:4091d6b9b1e84fa2b10e67fb | passed | validation | Validation "npm test -- tests/unit/task-workbench.test.ts tests/unit/schema-fixtures.test.ts tests/unit/status-json.test.ts" passed; command: npm test -- tests/unit/task-workbench.test.ts tests/unit/schema-fixtures.test.ts tests/unit/status-json.test.ts; exitCode: 0; signal: null; durationMs: 11166; stdoutHash: sha256:4d9ff74b1ae6a415c75cb872184c40f214bba0a0938a65708b2376193160169e; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0646:a882339f0ff0418387c640d9 | passed | validation | Validation "npm run build" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 14700; stdoutHash: sha256:97fb9031ff5062da23b87bd8e925bfd317f8ec10b714b991205b95de53b5fa8a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0646:f217cd7b34a54271b7467164 | passed | validation | Built CLI smoke passed: task status --json exposed selection.precedence for T-0646, and task status --task T-0646 --json exposed selected-task cockpit phase metadata. |
| ev:T-0646:df937504518449798f49aa31 | passed | validation | Task finalize done-level readiness for T-0646 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:1d2972defadbf147d524041586ec033134aa3434670b83ba1edcbb056ce752bb |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0646:c4a13838a429491385a8a105 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
