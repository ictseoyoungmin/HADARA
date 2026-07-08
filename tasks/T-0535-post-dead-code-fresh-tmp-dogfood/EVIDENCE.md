# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0535:790f953ae3674eeda652dbf2 | passed | validation | Validation "Docker sync-build" passed from direct result; Docker sync-build refreshed workspace dist after T-0534; npm ci, TypeScript build, full Vitest, dist copy, and built version smoke passed with distLooksStale:false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0535:229bd625b59d4eeea0007435 | passed | validation | Validation "Fresh /tmp dogfood lifecycle" passed from direct result; Fresh governed project /tmp/hadara-t0535-dogfood-XzmP7N initialized cleanly; toy T-0001 implemented word-stats tests, recovered validation wrapper EPERM via direct-result evidence, and closed with task finalize --execute --auto as closed-valid.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0535:ce3a1f50232c4a7388216e72 | passed | validation | Validation "Dogfood report review" passed from direct result; DOGFOOD_REPORT.md documents environment, command coverage, positives, findings, artifacts, and conclusion; high-priority follow-up is stale task finish fix hints in task status --detail full.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0535:653237d3c5454a3db68b07d7 | passed | validation | Task finalize done-level readiness for T-0535 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:5cee8bb94d60be4a10549d18d9437349bfb70e18aa06ea5c4aa818df22bbcec5 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0535:401a0586ca304ff08342d4c1 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
