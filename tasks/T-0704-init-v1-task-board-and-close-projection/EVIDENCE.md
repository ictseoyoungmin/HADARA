# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0704:34963cd6a53849c3980b1c8c | passed | validation | Validation "Focused Task Board regressions" passed from direct result; Docker focused tests passed task-board-v1 4/4, task-create 12/12, and task-finish 15/15 after the final target-source change.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0704:70c89bcc1c3d458a9c4bc958 | passed | validation | Validation "Built CLI Init v1 smoke" passed from direct result; Docker sync-build refreshed dist with distLooksStale:false; built CLI created a v1 task with ordered release/component targets in both TASK.md and the six-column Board, and close dry-run stayed read-only with slow:false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0704:dc7d443f64cd467ca667cb3e | passed | validation | Validation "Full Docker validation" passed from direct result; Corrected serial Docker validation passed build, tools type-check, all 142 public files/1102 tests (the one state-source fixture passed after restoring the tracked .hadara input), and all 16 HADARA-dev files/129 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0704:925266b4540f415a954f07ef | passed | validation | Validation "Repository hygiene" passed from direct result; git diff --check passed and evidence lint reported 4 records with zero errors or warnings; the earlier Docker timeout evidence is resolved by the final serial pass.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0704:4b45d4bee7404f21b4758c77 | passed | validation | Task finalize done-level readiness for T-0704 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:5c4ab92e9dee80bf00aa701979aeb74ad8d6b19309d77412bf133f04fafa5aa7 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0704:2b04903e9cc74db995021dce |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0704:db9064a959124e36b5e8e140 | failed | Validation "Full Docker validation" failed from direct result; Parallel full Docker attempt passed build/tools checks but timed out one task-close test under mounted Docker resource contention: 141/142 public files and 1101/1102 tests passed.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0704:dc7d443f64cd467ca667cb3e |
<!-- /hadara:slot -->
