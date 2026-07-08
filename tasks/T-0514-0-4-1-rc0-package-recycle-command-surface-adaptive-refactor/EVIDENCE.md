# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0514:1083145ebdba460894fab691 | passed | validation | Validation "Focused package recycle and schema tests" passed from direct result; npx vitest run tests/unit/package-recycle.test.ts tests/unit/schema-fixtures.test.ts --reporter=dot passed: 2 files / 7 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0514:dd3b69febfc54c98aeeb4741 | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed with tsc -p tsconfig.json.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0514:8c6f62d144b74da281d7880f | passed | validation | Validation "Built CLI package recycle dry-run" passed from direct result; node dist/cli/main.js package recycle --package hadara@next --expected-version 0.4.1-rc.0 --json passed and included the planned command-surface step plus task-status smoke.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0514:6f2e25d078e2407d88f486f8 | passed | validation | Task finalize done-level readiness for T-0514 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:ffb82b82728dc5866908d1a5e364e8783a5061a338a913659ec076b258a89190 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0514:35d91a1ae9d944508b1fa87c |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
