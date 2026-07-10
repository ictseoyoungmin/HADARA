# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0560:fe28198bab0640608e906b9e | passed | validation | Validation "Archive focused regressions" passed from direct result; Resolved run passed four focused files and 26 tests covering archive boundary, docs doctor, command links, and workflow budget.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0560:87f2998b851445bbaf91fe99 | passed | validation | Validation "Docs archive currentness" passed from direct result; docs doctor improved from 75 unregistered active-looking documents to 0; health=healthy, missing=0, currentnessIssues=0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0560:421bacf7fa7f4a3185d4ad9c | passed | validation | Validation "Multi-profile external-style dogfood" passed from direct result; Basic /tmp/hadara-primary-workflow-IoIEFM (10.09s), standard /tmp/hadara-primary-workflow-WJ0sgM (9.14s), and governed /tmp/hadara-primary-workflow-QdIZFd (8.99s) each used six invocations, passed docs doctor, and reached closed-valid.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0560:a9119e06127c423e93a5b5c0 | passed | validation | Validation "Docker full repository validation" passed from direct result; Docker TypeScript build and full suite passed 151 files and 1041 tests; dist refreshed and version smoke reported distLooksStale=false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0560:23ab891a8a3c4530a100e7ce | passed | validation | Validation "Archive read routing" passed from direct result; All registered docs/archive paths are status=historical, readWhen=never-default, readTier=historical; task read-map places them only in doNotReadByDefault.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0560:de9f8dd1a7474274808665b9 | passed | validation | Task finalize done-level readiness for T-0560 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:26c7c0dda37bb7fc3543d22bbbe5d95bcd3870a357841ccf9154e6e3632e218b |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0560:a32c8fe7ed6545a1a4b27522 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0560:13fb4eeafab441028b1bacd4 | failed | Validation "Archive focused regressions" failed from direct result; First focused run found the new archive-candidate test assumed a generated REFACTOR_LOG that governed scaffolds do not create.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0560:fe28198bab0640608e906b9e |
<!-- /hadara:slot -->
