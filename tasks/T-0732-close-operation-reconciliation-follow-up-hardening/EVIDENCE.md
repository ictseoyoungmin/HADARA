# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0732:4afe3e28706f4ecbbaf9b939 | passed | validation | Validation "Focused close/schema tests" passed; failureClass: none; command: npx vitest run tests/unit/task-close.test.ts tests/unit/task-close-source.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts tests/unit/docs-registry.test.ts; exitCode: 0; signal: null; durationMs: 6344; stdoutHash: sha256:ef9f2fa2a095d91f7752c79392fc5a5d0f58fc46adab211c84dfc4241a8db0c2; stderrHash: sha256:35c71f644ada4cde94fbffefc526b09bac987625c3b0068816a6c477613e1b92 |
| ev:T-0732:33639c1adfba44b19d73d32b | passed | validation | Validation "TypeScript source no-emit" passed from direct result; ./node_modules/.bin/tsc -p tsconfig.json --noEmit passed; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0732:8ac494d5883f435eba10faa8 | passed | validation | Validation "Tools typecheck" passed from direct result; npm run typecheck:tools passed; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0732:56f20fa21b86488093d44538 | passed | validation | Validation "Public unit suite" passed from direct result; npm test passed: 137 files, 1092 tests; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0732:0d096a2efd8c4c62b7ecce49 | passed | validation | Task closePlan done-level readiness for T-0732 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:7ceef0c821b63d5b51f0fd699798373250b68da721a0fdbfda131d76eec8321b |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0732:051091685a5e473bbcac18ed |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
