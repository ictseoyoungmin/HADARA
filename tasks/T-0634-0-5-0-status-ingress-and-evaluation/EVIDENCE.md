# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0634:d2b3eaf8c787400abbd4219a | passed | validation | Validation "Focused status ingress tests" passed; command: npm run test:focused -- tests/unit/status-json.test.ts tests/unit/schema-fixtures.test.ts tests/unit/feature-smoke.test.ts tests/unit/clean-checkout-smoke.test.ts tests/unit/help.test.ts; exitCode: 0; signal: null; durationMs: 29091; stdoutHash: sha256:788df71de792fa73f95c8c84397eb9d541b2e33d4243589e3f23a294b3764a2a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0634:6ae4618500d54ef0afca34be | passed | validation | Validation "TypeScript build" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 23638; stdoutHash: sha256:97fb9031ff5062da23b87bd8e925bfd317f8ec10b714b991205b95de53b5fa8a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0634:42fcbebc9c014652947f3e61 | passed | validation | Validation "Built CLI status v2 smoke" passed; command: node dist/cli/main.js status --json; exitCode: 0; signal: null; durationMs: 5649; stdoutHash: sha256:4cdd14642f1caafed5e14d9e4e91eaab37325e73fe05d92f3d623ad810239712; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0634:573b66d48db540f9bb8f7784 | passed | validation | Validation "Built CLI status v1 compatibility smoke" passed; command: node dist/cli/main.js status --compat v1 --json; exitCode: 0; signal: null; durationMs: 7414; stdoutHash: sha256:e426ef36196a51a0f4780f688900759466c22f4aec0d700ada10207c9412d2ed; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0634:dd1ab4b8d58c4efd95cb18b6 | passed | validation | Task finalize done-level readiness for T-0634 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:4cd100f5ad9bc891b898304eb7a4630ca665c0a7babb7bb13edff21787a10462 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0634:a1260b9091b54e90912250a7 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
