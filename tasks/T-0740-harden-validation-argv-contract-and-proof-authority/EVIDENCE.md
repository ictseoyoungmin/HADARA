# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0740:5c0e76227a9c488ba3710a8f | passed | validation | Validation "Focused trust-boundary tests" passed; failureClass: none; command: npx vitest run tests/unit/task-close.test.ts tests/unit/validation-run.test.ts tests/unit/schema-fixtures.test.ts tests/unit/cli-help-routing.test.ts tests/unit/command-registry.test.ts tests/unit/schema-runtime.test.ts --reporter=dot; argvHash: sha256:6a0854065f0f1cfe64ebd75221b3446554be1e717aa1b76db44ff30e1ab20eaa; exitCode: 0; signal: null; durationMs: 10863; stdoutHash: sha256:3f4b5f526ddaf839514f05c88193afe83d2acd68b3af8e582b070525476cb1be; stderrHash: sha256:1b865a631d7a2d4fc0ad18adc9ecd4d62c080f43661ded013cc3738ec3f27bfe |
| ev:T-0740:eb7f68e3b34d41c0949464c8 | passed | validation | Validation "TypeScript no-emit" passed; failureClass: none; command: npx tsc --noEmit; argvHash: sha256:a4c1939e956994bb1d7c608c85f1c267aee9e74394dac0c33269e995195eb8ab; exitCode: 0; signal: null; durationMs: 6885; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0740:a8a301fb55b84a9fbade85cc | passed | validation | Task closePlan done-level readiness for T-0740 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:7747dfdb98f0f9085689866844dbdab8b6a8119a67eca5ea2c4bc1f19c7ed109 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0740:a2e6f002d915406c869e73b8 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
