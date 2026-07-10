# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0564:f044cd06cd674977a473c5c9 | passed | validation | Validation "Positioning/onboarding focused tests" passed from direct result; Docker focused validation passed 6 files and 36 tests; direct bash syntax check passed. Host Vitest passed 35 assertions but its nested bash launch was blocked by known EPERM, so Docker is authoritative.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0564:fe7f2a90beb045e793a8a63d | passed | validation | Validation "Full Docker sync-build and docs currentness" passed from direct result; Docker sync-build passed 153 files and 1052 tests with distLooksStale=false; docs doctor reports health healthy, currentness clean, and zero semantic drift. This resolves the earlier clean-copy test-fixture failure.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0564:7766f428db4a4ac98c025ca8 | passed | validation | Task finalize done-level readiness for T-0564 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:111ade622c99edd0eb3e821bee1d117ea4d33eb5a56a97be299280213f52fd14 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0564:5035980b17564c83876951c2 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0564:be3b5a1ed97a4ae0b7b57698 | failed | Validation "Full Docker sync-build and docs currentness" failed from direct result; Docker clean-copy full suite passed 152 files/1051 tests but positioning-docs incorrectly required .hadara/context in the clean-copy fixture; 1 test failed with ENOENT before dist sync.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0564:fe7f2a90beb045e793a8a63d |
<!-- /hadara:slot -->
