# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0707:a20e025f62764413bcdd8b09 | passed | validation | Validation "Full repository validation" passed from direct result; npm run check passed build, source/tools type-check, 142 public files/1104 tests, and 16 HADARA-dev files/129 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0707:9bb6afc26d1645a9b6cf8d15 | passed | validation | Validation "Focused Validation regressions" passed from direct result; Four focused Validation, Task Capsule, workbench, and harness files passed 77 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0707:8d63f3565923487a9fff636f | passed | validation | Validation "Built CLI status/detail smoke" passed from direct result; Built validation run emitted separate status and detail fields and updated the five-column TASK.md Validation row.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0707:d7dd091dd41c407590f65eda | passed | validation | Validation "Diff and evidence hygiene" passed from direct result; git diff --check and evidence lint passed with zero issues.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0707:86c625b4c62448a6b35a91fb | passed | validation | Task finalize done-level readiness for T-0707 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:9db225990b2a634f5da06191be74aa0735862badd8709bfae2e418aa84311a45 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0707:b0b7a87c0150414b9e4b14e6 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0707:599237a8e44140e79581dcd9 | failed | Validation "Full repository validation" failed from direct result; First npm run check found three stale Validation-table fixtures after the new Status and Detail columns landed.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0707:a20e025f62764413bcdd8b09 |
<!-- /hadara:slot -->
