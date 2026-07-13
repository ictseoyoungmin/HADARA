# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0580:aab1eee8f7b449148907312c | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0580:27a8f81a98ab49b28f8c87d2 | passed | validation | Validation "npm rc publication" passed from direct result; npm view hadara@0.4.4-rc.0 returned version 0.4.4-rc.0; dist-tags are latest=0.4.3 and next=0.4.4-rc.0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0580:82f354a6e17a4fe08b737138 | passed | validation | Validation "GitHub rc release publication" passed from direct result; gh release view v0.4.4-rc.0 verified public GitHub Release isDraft=false, isPrerelease=true, targetCommitish=5c75323e8c3a5cd22a0957ac9a88decacbd74f07, url=https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.4.4-rc.0. The release was corrected from prerelease=false to prerelease=true during this capsule.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0580:7533b0e288624e9fb8710306 | passed | validation | Task finalize done-level readiness for T-0580 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:3e51574ee84ae87f25455ded925828a4589d5cb1ca3cd84e1c2283a13d50c3e7 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0580:df6b51559c2149b7912937d3 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
