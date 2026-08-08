# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0751:10370fbfbce64ed0b605de45 | passed | validation | Validation "Post-publish helper and registry observation" passed; failureClass: none; command: bash -lc bash -n scripts/release/manual-publish-rc.sh && ! rg -n "run_hadara" scripts/release/manual-publish-rc.sh && test "$(npm view hadara@0.5.0-rc.2 version)" = "0.5.0-rc.2" && test "$(npm view hadara dist-tags.next)" = "0.5.0-rc.2" && test "$(gh release view v0.5.0-rc.2 --repo ictseoyoungmin/HADARA --json isDraft,tagName --template "{{.isDraft}} {{.tagName}}")" = "false v0.5.0-rc.2"; argvHash: sha256:addf4d2b5eef96ac3a256471f633ac150b43cd413d296d714fe7695957807ec2; exitCode: 0; signal: null; durationMs: 1293; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0751:8dca57c9a08e49bb9795bdff | passed | validation | Resolved the initial post-publish observation quoting failure; corrected observation passed. |
| ev:T-0751:a147aef515804ab9b768ad93 | passed | validation | Task closePlan done-level readiness for T-0751 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:2b95e5ee9596a81257c97b1c019d5fc444b90cc471a638642c5b33f3ba1f71d7 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0751:44369baeafc842f2a12f9a3c |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0751:58cdef54a399423790e61965 | failed | Validation "Post-publish helper and registry observation" failed; failureClass: assertion; command: bash -lc bash -n scripts/release/manual-publish-rc.sh && ! rg -n "run_hadara" scripts/release/manual-publish-rc.sh && test "$(npm view hadara@0.5.0-rc.2 version)" = "0.5.0-rc.2" && test "$(npm view hadara dist-tags.next)" = "0.5.0-rc.2" && test "$(gh release view v0.5.0-rc.2 --repo ictseoyoungmin/HADARA --json isDraft,tagName --jq "\\(.isDraft) \\(.tagName)" )" = "false v0.5.0-rc.2"; argvHash: sha256:0005650ab210630a835adeeb4f82b1f65c6cf15d5156f98de3b998bc51a5df1c; exitCode: 1; signal: null; durationMs: 1395; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:241d175153667bf24606927758279adee0348e6d770bd5dc2e3213c9043f88b9 | Resolved | ev:T-0751:8dca57c9a08e49bb9795bdff |
<!-- /hadara:slot -->
