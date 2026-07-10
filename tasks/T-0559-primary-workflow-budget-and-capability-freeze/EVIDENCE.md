# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0559:4f9b167c4ca24aec8f4d007d | passed | validation | Validation "Primary workflow measured toy" passed from direct result; Standard temp project /tmp/hadara-primary-workflow-Rp4c4q completed exactly six measured invocations in 13125.89 ms and reached closed-valid within the 15000 ms target.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0559:ace8a95f299341b8b6fc1773 | passed | validation | Validation "Primary workflow focused regressions" passed from direct result; Four focused files and 20 tests passed, including exact four-command freeze and six-step harness contract.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0559:7ad5dab1394b4be584b73235 | passed | validation | Validation "Docker full repository validation" passed from direct result; Docker TypeScript build and full suite passed 150 files and 1037 tests; dist was refreshed and version smoke reported distLooksStale=false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0559:56e246ae04dc4bf093832de7 | passed | validation | Task finalize done-level readiness for T-0559 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:97a0687afa1a62427ded7c5e65bd66ff1769b7b07e393f4c91ddfaa762a28441 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0559:ba0f6b8a6a974261983c9c61 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0559:5b3569f8913b49bab7de81ce | blocked | Validation "Primary workflow measured toy" blocked from direct result; Initial in-sandbox measurement could not spawn the built CLI because the tool host returned EPERM.; blocked by operator-supplied direct result; command: direct-result; exitCode: null; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0559:4f9b167c4ca24aec8f4d007d |
| ev:T-0559:e9c9fb1c29dd4986bac02652 | failed | Validation "Primary workflow measured toy" failed from direct result; First escalated run exposed a harness assumption: finalize review can be actionable and executable while reporting Task Board finish work.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0559:4f9b167c4ca24aec8f4d007d |
<!-- /hadara:slot -->
