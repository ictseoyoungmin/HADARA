# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0685:099c2def415e48d6808d413d | passed | validation | Validation "Docs doctor all scope" passed; command: hadara docs doctor --scope all --json; exitCode: 0; signal: null; durationMs: 1567; stdoutHash: sha256:1f92a32666af209b6df27cce51579712779ce2a70c805017e4440cf50405ab05; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:ddac5f89ab3b4b45966353a7 | passed | validation | Validation "TypeScript build" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 22925; stdoutHash: sha256:7aed6ac8a9ce0b0198c52b14afe18478b6df6ea43229a63d34a783d26170d3e1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:9b3c3ed1ab30438fbd5eca6a | passed | validation | Validation "Built task status selection" passed; command: node dist/cli/main.js task status --json; exitCode: 0; signal: null; durationMs: 2766; stdoutHash: sha256:f8693d004eb7ce1594e3389c12d70c262b8affbbcb8b4fac3facfbad890cf1b4; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:d5276c1ecdff40d0bd97aef4 | passed | validation | Validation "Focused precedence tests" passed; command: npx vitest run tests/unit/task-selection.test.ts tests/unit/ta[REDACTED].test.ts tests/unit/task-workbench.test.ts tests/unit/operational-debt.test.ts; exitCode: 0; signal: null; durationMs: 11444; stdoutHash: sha256:9bd5ecee5521bdde1732aa491c9f9a51f446e078efeecee1afd3ad169e60e93f; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:a316ebac7a1a4c3ab1874d8d | passed | validation | Validation "TypeScript build after precedence fix" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 15945; stdoutHash: sha256:7aed6ac8a9ce0b0198c52b14afe18478b6df6ea43229a63d34a783d26170d3e1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:0c78ad4adc5a4b25ba7a5f8d | passed | validation | Validation "Strict release gate after readiness fix" passed; command: node dist/cli/main.js release gate --mode strict --json; exitCode: 0; signal: null; durationMs: 44619; stdoutHash: sha256:886a96e03e344ed5b04310e06691a379775e6457e911b44926ad1bfed07ee9b7; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:404504aac0304899abc2f9c6 | recorded | validation | Release dry-run failure was analyzed: strict release gate regression is fixed and strict gate now passes; remaining release dry-run blocker is expected current-commit release artifact freshness, which belongs to a later release-readiness/artifact refresh capsule. |
| ev:T-0685:8a93bab213ea414f86d75bd6 | passed | validation | Validation "Built task status active precedence" passed; command: node dist/cli/main.js task status --json; exitCode: 0; signal: null; durationMs: 2261; stdoutHash: sha256:acbc998fb927d2585511e1a0013aaf4807bd9a4503e5b602b4c7869ec3733df3; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:ae0d9bf84c404730a778601d | passed | validation | Validation "Built docs doctor all scope" passed; command: node dist/cli/main.js docs doctor --scope all --json; exitCode: 0; signal: null; durationMs: 1158; stdoutHash: sha256:1f92a32666af209b6df27cce51579712779ce2a70c805017e4440cf50405ab05; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:d027a4b78aca492bb84fb7e3 | passed | validation | Validation "Post-doc focused validation" passed from direct result; npx vitest run tests/unit/task-selection.test.ts tests/unit/ta[REDACTED].test.ts tests/unit/task-workbench.test.ts tests/unit/operational-debt.test.ts tests/unit/current-state-docs.test.ts passed: 5 files, 77 tests; git diff --check passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0685:44eb6e8423d948c8a244daed | passed | validation | Task finalize done-level readiness for T-0685 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:8c3518522134c2efbb2fdba7b124e6993dd16d3bc7ec031ce3f31e6633e9bcd6 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0685:af260f1aaee44f3c9c135569 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0685:4120a478c8fd436f94682346 | failed | Validation "Release dry-run readiness" failed; command: node dist/cli/main.js release dry-run --json; exitCode: 6; signal: null; durationMs: 69312; stdoutHash: sha256:43bd0966d5c45613113a62f3df4d5a9d2cc855c518dc9f586188dfa6a5646de7; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0685:404504aac0304899abc2f9c6 |
<!-- /hadara:slot -->
