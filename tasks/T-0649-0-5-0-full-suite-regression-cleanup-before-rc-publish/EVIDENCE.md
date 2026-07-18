# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0649:fcf5b2c078474cbdaf589a14 | passed | validation | Validation "Focused regression tests from full-suite failure" passed; command: npm test -- tests/harness/dogfooding-e2e-fixture.test.ts tests/unit/evidence-lint.test.ts tests/unit/task-capsule.test.ts tests/unit/task-create.test.ts tests/unit/task-finish.test.ts; exitCode: 0; signal: null; durationMs: 12997; stdoutHash: sha256:d876e030925cef4f97dddbd3fdbc89f97976a5f3f11f01f71a168f2b1830d4ea; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0649:15c4217a525c43a18144f4af | passed | validation | Validation "TypeScript build after regression cleanup" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 30047; stdoutHash: sha256:57c64f7bdb3d5fceff8885e869a5d5cea9fb5eade20e20b177419f60bc3ce0b1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0649:a304c064cb734dbfb8d19ba8 | passed | validation | Validation "Full npm test suite" passed from direct result; Direct timeout 300 npm test passed: 154 test files and 1132 tests passed in 145.62s after validation wrapper timed out at 120s.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0649:c1c7be61c3854332a97ea606 | passed | validation | Task finalize done-level readiness for T-0649 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:b987213b2c9645bcd4c67073cb5c7cd6897ac1b7a2d7ff573ea216d2e6a34bd9 |
| ev:T-0649:fea4ab66d9744473aa6877d9 | passed | validation | Validation "Strict release gate after full-suite cleanup" passed; command: node dist/cli/main.js release gate --mode strict --json; exitCode: 0; signal: null; durationMs: 38186; stdoutHash: sha256:202853cd10a3a47a8da6726a219ac04681220af792bd031974547847ed6d6ed5; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0649:9ebbcb47cfa4400fa863931f | passed | validation | Task finalize done-level readiness for T-0649 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:970108cd41171a43781789a03fbe0f468fa3480b2da387065e82ff547b29d0d8 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0649:86cd345133ca4886b8365d7f |
| close evidence | passed | ev:T-0649:914fee6b3c464a78b02c78d4 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0649:9719b3c407254a3f9e254acd | failed | Validation "Focused regression tests from full-suite failure" failed; command: npm test -- tests/harness/dogfooding-e2e-fixture.test.ts tests/unit/evidence-lint.test.ts tests/unit/task-capsule.test.ts tests/unit/task-create.test.ts tests/unit/task-finish.test.ts; exitCode: 1; signal: null; durationMs: 15735; stdoutHash: sha256:8d74ca8c2bc366e5dfa53ea1825fdc791a195c009888f89ecc632b0ded1fe284; stderrHash: sha256:fe580089414419a3b2f17efcc3f86fb493654449131da0ab2709ba7301f0ae3c | Resolved | ev:T-0649:fcf5b2c078474cbdaf589a14 |
| ev:T-0649:713626cfd7aa4574999979e8 | blocked | Validation "Full npm test suite" blocked; blocked because validation command timed out; command: npm test; exitCode: null; signal: SIGTERM; durationMs: 120109; stdoutHash: sha256:52e4db10a246c0b05e266fc070e259f957a711eef1faf06416a88f832075c1cc; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0649:a304c064cb734dbfb8d19ba8 |
<!-- /hadara:slot -->
