# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0581:2fa7e82f776f4d3082838e71 | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0581:c12cc972684444f2b9023b91 | passed | validation | Validation "npm rc registry stability" passed from direct result; npm view hadara@0.4.4-rc.0 returned version 0.4.4-rc.0 with dist-tags latest=0.4.3 and next=0.4.4-rc.0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0581:19f58deba6a2488fac943120 | passed | validation | Validation "docs currentness stability" passed from direct result; docs doctor --json returned ok=true, health=healthy, currentnessVerdict=clean, missingRegisteredDocuments=0, unregisteredActiveLookingDocuments=0, semanticDriftIssues=0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0581:db4d2427123447558a5b5a8f | passed | validation | Validation "GitHub rc release stability" passed from direct result; gh release view v0.4.4-rc.0 verified isDraft=false, isPrerelease=true, targetCommitish=5c75323e8c3a5cd22a0957ac9a88decacbd74f07, url=https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.4.4-rc.0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0581:514bdc712de34ed69be28ac2 | passed | validation | Task finalize done-level readiness for T-0581 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:d1345f2844b71e5c05e35eb8eb0c79ec17506de9b61977388a46489967fc0a5c |
| ev:T-0581:eea60ae267184597bc8e6473 | passed | validation | Task finalize done-level readiness for T-0581 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:9281d6262b2d15e7233a4bc3ab104cb0d733760004014bab7e52d0dc9ab0ae27 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0581:fb3249c892644bbb97f35ada |
| close evidence | passed | ev:T-0581:179b8021136344019207b68b |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
