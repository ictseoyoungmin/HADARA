# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0606:e7754dccad1e43edaf889b01 | passed | validation | Antigravity onboarding dogfood report completed from observed delegated attempts; public hadara@0.4.5 install verified, blockers and follow-ups documented in DOGFOOD_REPORT.md. |
| ev:T-0606:49944107f2174836a11063d4 | passed | validation | Task finalize done-level readiness for T-0606 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:5bfe1215367c6cc4b2e972c336bc95dba94cdd7da4a50982f911f9fc89aa4e17 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0606:0019bb9490004cc7badcd1b8 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0606:d4741b74fb4045f4adc21b82 | blocked | First Antigravity delegated onboarding attempt did not reach HADARA; it drifted into broad user-directory package discovery and was interrupted after timeout. | Unresolved | evidence.jsonl |
| ev:T-0606:243c79328dfc4093b2cacdf2 | blocked | Second Antigravity delegated onboarding attempt ignored the /tmp project cwd, inspected Antigravity scratch/worktree paths and another repository, and was interrupted before useful HADARA lifecycle work. | Unresolved | evidence.jsonl |
| ev:T-0606:77a2d2ba4f9645eba98bd1e4 | blocked | Installed public hadara@0.4.5 globally and verified hadara doctor reports packageVersion 0.4.5; fresh Antigravity retry with absolute /tmp project path could not run because agy quota was exhausted. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
