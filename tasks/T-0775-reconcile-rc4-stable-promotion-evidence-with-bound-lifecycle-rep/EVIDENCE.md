# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0775:ff29e544e7ac439d955598f0 | passed | validation | Structural artifact binding contract test passed; report is directly linked in canonical evidence artifacts[]. |
| ev:T-0775:5a073db0ba534805a91e0e27 | passed | validation | Validation "Evidence artifact binding focused tests" passed; failureClass: none; command: npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/schema-runtime.test.ts; argvHash: sha256:02623c127f2aa575c71b61cc8cacfbcbfda5902b821671d8598114682a5f9b3a; exitCode: 0; signal: null; durationMs: 2773; stdoutHash: sha256:75ea9bfc941821f137edf5664b854d2c2cab15885e85add60e56fca62817b6fc; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0775:6d0d2c5aefab4eecb994f5b7 | passed | validation | Validation "Public artifact policy focused tests" passed; failureClass: none; command: npm run test:focused -- tests/unit/evidence-json.test.ts; argvHash: sha256:a4db5a29f3f7834a27a586fe39c20d8f7d702c8c9297a08f7cc5b5be0b450894; exitCode: 0; signal: null; durationMs: 3191; stdoutHash: sha256:c4d958dfa2d4ea7eb9f2ee5e91154cd8fb27a9e808a389114e7d79604ba8c4e2; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0775:d5a195f8e1a74a80a29650aa | passed | validation | Validation "Operator publication report contract tests" passed; failureClass: none; command: npm run test:focused -- tests/unit/manual-publish-script.test.ts tests/unit/schema-runtime.test.ts; argvHash: sha256:17e9a91f73a3e149f92e30f58a8e770add65ab1997a3e18d77b3bd9b5959af71; exitCode: 0; signal: null; durationMs: 1621; stdoutHash: sha256:b7b219fbe649ae5f25152742e67a6e675475dc1c12780a6dacd617c3b02efb0a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0775:555338e0f0a044d4b0e774c7 | passed | validation | Validation "Full repository check/build" passed from direct result; Docker sync-build passed; typecheck:tools and test:all passed. The host npm run check attempt was blocked only by root-owned Docker dist output (TS5033 EACCES), not by source or test failures.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0775:5bf315d39c36437a94013878 | passed | validation | Validation "Full repository check/build" passed from direct result; Docker sync-build passed; typecheck:tools and test:all passed. The host npm run check attempt was blocked only by root-owned Docker dist output (TS5033 EACCES), not by source or test failures.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0775:cbb30278a4f249078a14256d | passed | validation | Validation "Evidence lint and task close" passed; failureClass: none; command: node dist/cli/main.js evidence lint --task T-0775 --json; argvHash: sha256:bf2c4db4e8e14014f34e9279dd4951920ea1bf8c6c3ebef3b43ddd1d9432d0eb; exitCode: 0; signal: null; durationMs: 135; stdoutHash: sha256:12d47f0a4c321ec5c984a7ea059535a282f0b8fcaad4cbdda069ee1eb0201eae; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0775:5373c725685b4e9e86cbd120 | passed | validation | Task closePlan done-level readiness for T-0775 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:ab7429b4405978e80522decb0703fcafe9297224197c0568885072c10e6cc520 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0775:47ca5364587e44818965984e |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0775:ba2afe0b5cc14f3198083683 | failed | Validation "Full repository check/build" failed; failureClass: assertion; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 2; signal: null; durationMs: 6429; stdoutHash: sha256:ea8ad9d456e2bcfcc348a047d6935065bab23c9e66c3bd867dc5ed87b46d50be; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0775:5bf315d39c36437a94013878 |
<!-- /hadara:slot -->
