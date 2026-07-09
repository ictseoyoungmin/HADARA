# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0544:a004da2bfd5f48b390477f2c | passed | validation | Validation "Docker build and focused profile tests" passed from direct result; Docker direct validation passed: npm run build, focused Vitest for context-graph-document-extractors, context-pack, and task-selection passed 3 files / 27 tests, and built version smoke reported distLooksStale:false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0544:e44e395885524fb8802c6756 | passed | validation | Validation "Fresh three-profile dogfood rerun" passed from direct result; Fresh /tmp dogfood initialized basic/standard/governed profiles, verified first-task guidance, context pack source leakage fix, profile-aware handoff/context fixes, EOF slice non-truncation, governed toy lifecycle close, and handoff fuzzy matching; see DOGFOOD_REPORT.md.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0544:2e103343b2f647d3b3faef66 | passed | validation | Validation "Workspace diff check" passed from direct result; git diff --check passed after T-0544 code, task capsule, and shared-state document updates.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0544:248fdc231cee47cdbd9ee643 | passed | validation | Task finalize done-level readiness for T-0544 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:db2ef92399283cc4db7586205e3da7ffff10f62d71dcfab719104e8a71355255 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0544:fb800fee92ac452ab0f01e42 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
