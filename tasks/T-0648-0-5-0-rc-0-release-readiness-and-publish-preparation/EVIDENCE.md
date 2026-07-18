# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0648:fde14fbcea9b4d71bd5b5001 | passed | validation | Validation "TypeScript build" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 14594; stdoutHash: sha256:57c64f7bdb3d5fceff8885e869a5d5cea9fb5eade20e20b177419f60bc3ce0b1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0648:25b814358b374b8083791da1 | passed | validation | Validation "Focused status and session workflow tests" passed; command: npm test -- tests/unit/status-json.test.ts tests/unit/task-workbench.test.ts tests/unit/context-routing-e2e-smoke-script.test.ts tests/unit/session-start.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/schema-fixtures.test.ts; exitCode: 0; signal: null; durationMs: 12356; stdoutHash: sha256:891dc34cf0cb7f43bff25e32efddcbd04fd7fcaf11ed03749c955b8f55dcffa2; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0648:d828f730140f4e8093ef6d8a | passed | validation | Validation "Context routing status ingress smoke" passed; command: node scripts/context-routing-e2e-smoke.mjs --project . --cli dist/cli/main.js --task T-0648 --timeout-ms 20000; exitCode: 0; signal: null; durationMs: 10942; stdoutHash: sha256:204ef36c1a4e8521e9143f2abd0dbf9ace0c3a1db45566b3142b90d8c9051073; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0648:e7e62d6f7e294ccda8fa1ee6 | passed | validation | Validation "Package smoke dry-run" passed; command: node dist/cli/main.js smoke package --dry-run --json; exitCode: 0; signal: null; durationMs: 2231; stdoutHash: sha256:70f4066d0b9d2cdec8efdd82d367b39122e434fc0f59e8a364606c752f542236; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0648:1dbe2f6fdb334ca293963917 | passed | validation | Validation "Strict release gate dry-run" passed; command: node dist/cli/main.js release gate --mode strict --json; exitCode: 0; signal: null; durationMs: 40479; stdoutHash: sha256:202853cd10a3a47a8da6726a219ac04681220af792bd031974547847ed6d6ed5; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0648:15f9d458c95f4a78b5937a6b | passed | validation | Task finalize done-level readiness for T-0648 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:069c8fadfe13a75c13180e95ef8df74cdb00c9a3e68288dae493b11c18e45115 |
| ev:T-0648:5c63d61ca6224752a3c80e95 | passed | validation | Task finalize done-level readiness for T-0648 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:21ceb8166cdbf78d110dc92387cb8ed6d4fcde90e398b7cafc7ac2aa9be7db76 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0648:be78f636b5454e068ef1127f |
| close evidence | passed | ev:T-0648:fc107302f2eb4a04bc4b691d |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0648:bd8fe64f293b4b6087926947 | failed | Validation "Strict release gate dry-run" failed; command: node dist/cli/main.js release gate --mode strict --json; exitCode: 6; signal: null; durationMs: 103544; stdoutHash: sha256:58b4b50a26e11404d8895340da3db7ce1ac9d3f3340985b0101e553fd872d898; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0648:1dbe2f6fdb334ca293963917 |
<!-- /hadara:slot -->
