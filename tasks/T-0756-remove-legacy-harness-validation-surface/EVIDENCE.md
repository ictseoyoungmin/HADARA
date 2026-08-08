# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0756:7f9b2034131940ac806af057 | passed | validation | Validation "Removed harness validation surface regression" passed; failureClass: none; command: npx vitest run tests/unit/task-validation.test.ts tests/unit/task-workbench.test.ts tests/unit/schema-runtime.test.ts tests/unit/cli-help-routing.test.ts tests/unit/command-registry.test.ts tests/unit/mcp-server.test.ts tests/unit/mcp-tools.test.ts tests/contract/cli-mcp-service-parity.test.ts tests/contract/mcp-bridge-contract.test.ts tests/contract/hermes-compatibility-fixture.test.ts tests/unit/status-json.test.ts tests/unit/tui-read-model.test.ts tests/unit/tui-snapshot.test.ts tests/unit/task-workflow-docs.test.ts; argvHash: sha256:f2dfe647717972de939aa4c9500d29f0875a7475aa1fa031b374af750c3853d6; exitCode: 0; signal: null; durationMs: 4299; stdoutHash: sha256:7b94bc86576301602df9367c69d56bae6deb32689a79cb0c844b73d6729291cd; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0756:574cbb4ea6a14b4b89f3227b | passed | validation | Validation "Full repository check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 50526; stdoutHash: sha256:6c24d8ef477fdc189ee9d745640c3d188b29cf4375bcfa7bc393cc7fe174bb98; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0756:97dfeb5190cf4983a4313ee9 | passed | validation | Validation "Full repository check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 37558; stdoutHash: sha256:6c249cbc505fcd4ad78b0ab4206b3db1dd9ee3a563881280ebdee3a7d87905c8; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0756:a880c86b356d4cfd907aa5f4 | passed | validation | Task closePlan done-level readiness for T-0756 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:72de38c96f8cba53c0c28703de549952306b74c6e59330223ff6c2f793d3863d |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0756:2648e6e32d4f4844a2d83fd5 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0756:2563556a0a23476da887a70c | failed | Validation "Full repository check" failed; failureClass: assertion; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 1; signal: null; durationMs: 36817; stdoutHash: sha256:d5ba85609d007edcc5f24b73fed8eb9d4f6b91355ca15b5f0a0d02025b007f30; stderrHash: sha256:96b7745f281e3e4cd71602c5fe391a22e99a6c932d9098e9a00975e1f88deb59 | Resolved | ev:T-0756:574cbb4ea6a14b4b89f3227b |
<!-- /hadara:slot -->
