# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0558:a0106f42bca342ca8341a17c | passed | validation | Validation "Docker full repository validation" passed from direct result; Resolved run passed 149 test files and 1034 tests; TypeScript build, dist sync, version smoke, and freshness check passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0558:2189cb84302145689de0f8cc | passed | validation | Validation "Focused compact-state regression" passed from direct result; Four focused files and 28 tests passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0558:c5b24e7f72c143dd89e22d7c | passed | validation | Validation "Governed P1 toy lifecycle" passed from direct result; Disposable governed project /tmp/hadara-p1-toy-5rUHpj completed init, docs doctor, session start, task status, evidence, and closed-valid finalize.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0558:8ac7eeb68db34f7a824f944b | passed | validation | Validation "Historical snapshot routing" passed from direct result; Project docs doctor reports currentnessIssues=0 and read-map routes both pre-T0558 snapshots to doNotReadByDefault.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0558:6799c3fd1fd740609d5c16c8 | passed | validation | Task finalize done-level readiness for T-0558 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:c9fb14aa7e7eb23913fd6a7555f3ec4676c467ad1519c847f4f371b7e5eb03ff |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0558:d2730f4662b54586a52dd202 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0558:edd4a3a2e51a40d3bfefb532 | failed | Validation "Docker full repository validation" failed from direct result; First Docker run: 148 files passed and current-state-docs had one environment-dependent assertion failure.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0558:a0106f42bca342ca8341a17c |
<!-- /hadara:slot -->
