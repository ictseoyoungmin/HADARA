# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0710:4bfd272309984fedbfd5ed6a | passed | validation | Validation "Real Docker low-resource smoke" passed from direct result; home-mounted hadara-home-dev ran public help-routing focused validation with serial=true, maxWorkers=1, 1024 MiB Node heap, and npmJobs=1.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0710:6dc32fbb76e9416999acdf44 | passed | validation | Validation "Focused tools and script regressions" passed from direct result; Tools typecheck, public help 3 tests, HADARA-dev Docker 11 tests, shell syntax, and diff check passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0710:86dc5dfc9ce843c79c86681e | passed | validation | Validation "Full repository validation" passed from direct result; npm run check passed 142 public files/1107 tests and 16 HADARA-dev files/131 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0710:5386a019fa8a4dedb00f0b27 | passed | validation | Validation "Diff, scope, and evidence hygiene" passed from direct result; No src diff; bash syntax, git diff --check, and evidence lint passed with zero issues.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0710:68df494476eb4c10bdda55cc | passed | validation | Task finalize done-level readiness for T-0710 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:f1b5ea7b33f27f41a0c4d5c1affcde1f1cf07d18ca268f9a22d8bbafe4b61d5d |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0710:26d5ea5b9c30467e981e294d |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0710:43597b1de9534efc874e5ccf | failed | Validation "Real Docker low-resource smoke" failed from direct result; First low-resource run selected a HADARA-dev-only file through the public focused config, which exited with no matching tests.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0710:4bfd272309984fedbfd5ed6a |
<!-- /hadara:slot -->
