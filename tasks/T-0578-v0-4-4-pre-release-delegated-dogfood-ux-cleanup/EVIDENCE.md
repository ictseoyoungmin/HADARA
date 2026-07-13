# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0578:d6aa3fa64f014b958a3a59e2 | passed | validation | Validation "Focused unit tests" passed from direct result; npm test -- tests/unit/init.test.ts tests/unit/docs-doctor.test.ts tests/unit/task-workbench.test.ts tests/unit/project-current-state.test.ts tests/unit/task-selection.test.ts tests/unit/session-start.test.ts tests/unit/runtime-version.test.ts passed: 7 files, 83 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0578:f86f092587994b3399a3c3b6 | passed | validation | Validation "Docker full check and dist sync" passed from direct result; npm run dev:docker-sync-build passed under Docker: npm run check completed 153 test files and 1067 tests, then refreshed dist; version verbose reported distLooksStale false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0578:8ced49066f7845fabc5ffffc | passed | validation | Validation "Built CLI scaffold smoke" passed from direct result; Built CLI governed init in /tmp/hadara-t0578-smoke used package name/description in PROJECT_STATE, omitted empty Last 3 Completed/TBD handoff rows, docs doctor returned healthy clean, and T-0577 task status reported readiness.status closed-valid-current-not-checked.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0578:4c77bcf59dec46b9a7397130 | passed | validation | Task finalize done-level readiness for T-0578 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:f936e0360c437e441771bdece0dadd62bc75a3895605c0d88cd4bd5b54844c5c |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0578:8b36d544d5774076b52409a5 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
