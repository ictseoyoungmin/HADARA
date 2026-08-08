# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0750:18a7dd497148451abd2aa266 | passed | validation | Validation "GitHub Release note review" passed; failureClass: none; command: bash -lc test -s tasks/T-0750-rc2-github-release-note-preparation/GITHUB_RELEASE_NOTE.md && ! rg -n "(/home///tmp//TOKEN/secret)" tasks/T-0750-rc2-github-release-note-preparation/GITHUB_RELEASE_NOTE.md && bash -n scripts/release/manual-publish-rc.sh && test -f tasks/T-0750-rc2-github-release-note-preparation/GITHUB_RELEASE_NOTE.md; argvHash: sha256:8c3ab1226efe74aff08465eaef77801ae636be671acbb94c1f6c1fffdaf90046; exitCode: 0; signal: null; durationMs: 23; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0750:7b70ed45b26346428d546e4f | passed | validation | Task closePlan done-level readiness for T-0750 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:340a14b780910133a03c9211c107b327f22fd9b340e12f790a68bffbb274f33b |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0750:419a0a7778304779bed29c0a |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
