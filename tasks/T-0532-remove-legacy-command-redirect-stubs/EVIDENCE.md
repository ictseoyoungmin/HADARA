# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0532:4ae792591df14134ac3fc56d | passed | validation | Validation "Focused legacy routing/schema/docs tests" passed from direct result; Host focused tests passed: 9 files / 43 tests for legacy routing, lifecycle parity, handoff/write/run-state service tests, task workflow docs, schema fixtures, help, and command registry. Host manual publish script test was excluded because Node spawnSync bash is EPERM in this sandbox; Docker full validation covered it.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0532:7fe349e74ca84badbc96c6f5 | passed | validation | Validation "TypeScript build" passed from direct result; Host npm run build passed with tsc -p tsconfig.json after removing redirect-only CLI handlers and commandRemoved schema.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0532:d1a6f5e679bc411f9b98d2f3 | passed | validation | Validation "Docker sync-build" passed from direct result; Docker dev:docker-sync-build passed: npm ci, build, full vitest 154 files / 1032 tests, and dist refresh; built version report showed distLooksStale false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0532:7c4d6212107b4a19b3d73071 | passed | validation | Validation "Built CLI legacy command smoke" passed from direct result; Built CLI representative retired routes task finish, package smoke, and handoff suggest returned ordinary default help with exit 1 and no commandRemoved payload; commands registry grep found no retired ids for lifecycle, handoff/write/policy/harness/run/run-state/package smoke surfaces.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0532:cf207fd54ec04fc69ef236bd | passed | validation | Task finalize done-level readiness for T-0532 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:89a66e293068e0dedd056697b4bc18a0c2ce6cd1ba0f0a1c19910db75e38d7b2 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0532:afed4b8f565e46b2a8b47b6b |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
