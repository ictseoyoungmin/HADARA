# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0584:8ffea7cd42504ea5a177a54f | passed | release | Operator completed public v0.4.4 release: npm publish reported + hadara@0.4.4 and npm view verified 0.4.4; GitHub Release v0.4.4 was created and published publicly at https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.4.4. Publish clone evidence reported ev:T-0583:b22569d50c644f50aca3ca5b. |
| ev:T-0584:36991318909d46e59d2fce17 | passed | validation | Validation "npm and GitHub release verification" passed from direct result; npm view hadara@0.4.4 version returned 0.4.4; npm view hadara@latest version returned 0.4.4; gh release view v0.4.4 returned isDraft=false, isPrerelease=false, targetCommitish=d5fd35c96bbec7976e1d032ac6adf8141ed7f17d.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0584:2058d34afba84221849ae6ab | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0584:f5144ae595fa4be8b77cc94e | passed | validation | Task finalize done-level readiness for T-0584 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:b5f630445909cb3edb9e99e018c24a56f81b9b071c7823c0ec4f757519fef92b |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0584:f63f862d590c4048956af662 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
