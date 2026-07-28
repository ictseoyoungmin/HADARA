# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0711:28e345a6c1694deb87556ca7 | passed | validation | Validation "Focused failure-class regressions" passed from direct result; Validation/schema 37 tests and HADARA-dev Docker 10 tests passed for assertion, timeout, environment-setup, and none.; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0711:e9a0df9c546c4394a65c13c3 | passed | validation | Validation "Full repository validation" passed from direct result; npm run check passed 142 public files/1108 tests and 16 HADARA-dev files/132 tests.; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0711:f22cf345859e4a4dbfe7e219 | passed | validation | Validation "Built CLI classification smoke" passed from direct result; Fresh minimal Init built CLI classified real non-zero, deadline, and missing-command runs as assertion, timeout, and environment-setup.; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0711:437f9e056f7f46b2b55ef37c | passed | validation | Validation "Diff and evidence hygiene" passed from direct result; git diff --check and evidence lint passed with zero issues.; failureClass: none; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0711:6c3bf6e3fc5d495eaa2ce80b | passed | validation | Task finalize done-level readiness for T-0711 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:3c64b0799385ba37fac1eb7ac1a2bad8b8c16e9d20c05d431208b4897eff46c4 |
| ev:T-0711:85da91bf031b4aafa6e01ee7 | passed | validation | After restoring dist ownership, final npm run check passed 142 public files/1108 tests and 16 HADARA-dev files/132 tests. |
| ev:T-0711:6fcb7ae8c3944b1a9b1cbe91 | passed | validation | Final src/tools typechecks passed; validation/help/registry focused suites passed 3 files/27 tests and Docker classification passed 1 file/10 tests, including guarded preflight environment-setup and timeout guidance. |
| ev:T-0711:136513ed265f4c97b2983f37 | passed | validation | Task finalize done-level readiness for T-0711 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:dbaab30e28d4a80cad7d1986950d447f664fc0667e74781df306b4dbed980852 |
| ev:T-0711:a3f33a1a843846a1b26f25bb | passed | validation | Task finalize done-level readiness for T-0711 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:e839a3d0caa11df0393188c2b89a2b70ede976da93a092b050ba73a037c61bd1 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0711:5b6a47d5ddac4e2089248558 |
| close evidence | passed | ev:T-0711:b304bb2a3a574d589b41cfcd |
| close evidence | passed | ev:T-0711:eaeb207d7da4474cab7e5510 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0711:30ac95f658f4460586d4fa79 | blocked | Final full validation was initially blocked by environment setup: Docker-synced dist files were root-owned, so host TypeScript emit returned EACCES. | Resolved | ev:T-0711:85da91bf031b4aafa6e01ee7 |
<!-- /hadara:slot -->
