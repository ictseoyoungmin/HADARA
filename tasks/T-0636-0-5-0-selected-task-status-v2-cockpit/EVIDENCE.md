# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0636:4db398db0ad64028880ce42b | passed | validation | Validation "Focused selected-task status tests" passed; command: npm run test:focused -- tests/unit/task-workbench.test.ts tests/unit/schema-fixtures.test.ts tests/unit/help.test.ts; exitCode: 0; signal: null; durationMs: 10075; stdoutHash: sha256:dcff6a4ab957f648e42cd9c293609adae34498a5a9a88bbc9dc2599a521ccb16; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0636:6dbae4cabedd4785aea88219 | passed | validation | Validation "TypeScript build" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 14662; stdoutHash: sha256:97fb9031ff5062da23b87bd8e925bfd317f8ec10b714b991205b95de53b5fa8a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0636:868e2bfde039494b85deccdf | passed | validation | Validation "Built CLI selected-task v2 smoke" passed; command: node dist/cli/main.js task status --task T-0636 --json; exitCode: 0; signal: null; durationMs: 2079; stdoutHash: sha256:6f110f45d1bfabaf73ad0308fff4613355d1fc989c574dd9a9ec4df6b5a187c2; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0636:ad6cd5d69307422a90cebea3 | passed | validation | Validation "Built CLI selected-task v1 compatibility smoke" passed; command: node dist/cli/main.js task status --task T-0636 --compat v1 --json; exitCode: 0; signal: null; durationMs: 2301; stdoutHash: sha256:026cd53448a0f648bf85820a285845b169e6f9f66e1dba0360dfaa5451bebac7; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0636:36238f3645ab47209878a5fb | passed | validation | Task finalize done-level readiness for T-0636 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:5c8b65633cc89465cec86295358d74dc37fd3c225bd9cbadfde1eb716a2f8caa |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0636:91912b185b614d3297de3ee9 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
