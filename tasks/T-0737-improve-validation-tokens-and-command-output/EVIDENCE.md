# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0737:906bfe6fa3c04c47ad3d4319 | passed | validation | Validation "Focused tests" passed; failureClass: none; command: npx vitest run tests/harness/harness-validate.test.ts tests/unit/controlled-vocabulary.test.ts tests/unit/validation-run.test.ts tests/unit/schema-command.test.ts tests/unit/schema-fixtures.test.ts; exitCode: 0; signal: null; durationMs: 5607; stdoutHash: sha256:a329bbc3ec8ecd5924af1e816db415000126c977c4e44785a8ffa911c732e266; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0737:a8f99f27c0474e0fbb53b12e | passed | validation | Validation "TypeScript no-emit" passed; failureClass: none; command: npx tsc --noEmit; exitCode: 0; signal: null; durationMs: 10088; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0737:bbab4b01a0854dc0a32da760 | passed | validation | Validation "Output preview smoke" passed; failureClass: none; command: node -e process.stdout.write("original stdout\n"); process.stderr.write("original stderr\n"); exitCode: 0; signal: null; durationMs: 55; stdoutHash: sha256:d2479a75baf20582f31a36a66b969a6c4c1639b26b89d25cd119a926a3a61cde; stderrHash: sha256:3a3548b68d57ca337a8e0c8f87dd091208be2bff976610691be63789352b95fa |
| ev:T-0737:48c4a232b719448a9855da9c | passed | validation | Task closePlan done-level readiness for T-0737 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:25608fcce4190c32b447400fe3b228cbc2b96c2199c65a2684c1c07d8f36fccd |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0737:d33500d99e7048a085c72934 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
