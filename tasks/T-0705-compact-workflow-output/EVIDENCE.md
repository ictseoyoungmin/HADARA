# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0705:b836324ba03349609da40acf | passed | validation | Validation "Full repository validation" passed from direct result; npm run check passed build, source/tools type-check, 142 public files/1102 tests, and 16 HADARA-dev files/129 tests in the home ext4 clone.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0705:41bc27f1695944708e56e13c | passed | validation | Validation "Focused output regressions" passed from direct result; Five focused status/close/workflow/dogfood files passed 74 tests after compact-default and full-detail contract updates.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0705:7e7df6481737405e9431844f | passed | validation | Validation "Built CLI compact and full smoke" passed from direct result; Built status default returned summary.v1 with one TASK.md read/edit focus; status full returned task.status.v2 at 32485 bytes. Close default returned close.summary.v1; close full returned close.v2 at 11720 bytes with finalize source.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0705:fb9501c035f046e5975b1509 | passed | validation | Validation "Diff and evidence hygiene" passed from direct result; git diff --check and evidence lint passed; evidence projection has zero errors or warnings.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0705:d0c7a7644b6d45beac943d60 | passed | validation | Task finalize done-level readiness for T-0705 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:b6f3b7f21cd211cda053617bae6e6490d96db36b8d36eb943c9f120d59bc24b4 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0705:8e2d192f68f043b39ca7f48e |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0705:b903f3b8a6b84b8685a97b05 | failed | Validation "Full repository validation" failed from direct result; First npm run check passed build and tools type-check, then found four expected contract-test mismatches after changing default status/close JSON to compact summaries.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0705:b836324ba03349609da40acf |
<!-- /hadara:slot -->
