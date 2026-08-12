# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0781:0478a15b57a849fca0a63144 | passed | validation | Validation "Evidence reference resolver and task validation tests" passed; failureClass: none; command: npx vitest run tests/unit/evidence-reference-resolver.test.ts tests/unit/evidence-lint.test.ts tests/unit/protocol-consistency.test.ts tests/unit/task-validation.test.ts; argvHash: sha256:c7a1d774886a07cd9c7beaa6e52cbec0042a65bfde73bf3f0f7cff725d9f0122; exitCode: 0; signal: null; durationMs: 2722; stdoutHash: sha256:6aac712a585c78cc69199825caeac4786d76ede1448c92c0439d177e2517a82a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0781:830702bbd38f4a6a9a0c4fe7 | passed | validation | Validation "Close snapshot compatibility tests" passed; failureClass: none; command: npx vitest run tests/unit/task-close.test.ts; argvHash: sha256:7bdc477cf63db8bdf61ea91426242423ad523e028b0283f3ff41e46c50180053; exitCode: 0; signal: null; durationMs: 7939; stdoutHash: sha256:be534b1587d2bd99c1e16b2277f75e4829bf35fa0ef29413f3ad73036dcc6857; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0781:b764beebc7364aaa9ae5bbfd | passed | validation | Validation "Full default test suite" passed; failureClass: none; command: npm test; argvHash: sha256:7a29c2fdc8eda277850f4fd0624e62e0670ca1812a756e92aafa47fab71164f2; exitCode: 0; signal: null; durationMs: 20204; stdoutHash: sha256:850d9ade7f4a2348f5a49bd54a3d30653261bca59b2e65619bf1739f5a18e0e4; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0781:ac516baaab374e0c88a9d92c | passed | validation | Validation "Source typecheck" passed; failureClass: none; command: npm run typecheck:src; argvHash: sha256:c77e78c57718a8829f95803ed403384d042d6e7cabe66f19e74b1c6ea5ff08df; exitCode: 0; signal: null; durationMs: 4581; stdoutHash: sha256:aab8caca57f5b62725911b5e265a8b8cb571357240ba4fedb51957179fce91f4; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0781:8d8374bea1094b7484cb36a0 | passed | validation | Validation "Docker sync build" passed from direct result; npm run dev:docker-sync-build passed after resolver integration; Docker TypeScript build completed, dist synchronized, and built CLI smoke reported distLooksStale=false.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0781:b58f78aa8512400da5395586 | passed | validation | Task closePlan done-level readiness for T-0781 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:4e5556cfb4a9154ab7255eae343a431ebd5b6385aa6b1b8e91312226a86e4697 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0781:ca8029eb671547b8b06c1b29 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
