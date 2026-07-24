# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0698:c0674d3596854c7c9aa8bcce | passed | validation | Validation "Current init focused tests" passed from direct result; Docker ext4 fixture: tests/unit/init.test.ts passed 35/35 on the pre-redesign baseline.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0698:224dd481d6f441f5b5b8527e | recorded | operation | Built CLI characterization reproduced legacy immediate JSON greenfield writes and silent --excute acceptance with writes; this is recorded baseline behavior, not Init v1 acceptance. |
| ev:T-0698:e50ddbf7c32d4b9dbf549607 | passed | validation | Validation "Requirement and capsule coverage audit" passed from direct result; Static audit mapped acceptance A-S, E2E, REG, and NF to exactly eight ordered capsules; source specification SHA-256 hashes were captured.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0698:69fd006597b242c3af3a06d1 | passed | validation | Validation "Full repository Docker check" passed from direct result; Corrected Docker ext4 copy including portable .hadara state passed build, tools typecheck, 137 public files/1069 tests, and 16 HADARA-dev files/127 tests; it resolves the wrapper-copy failure.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0698:48892bfd148b4f88bd235052 | passed | validation | Task finalize done-level readiness for T-0698 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:e3a07e790a96e9b4b9cb3baad934cf735dd9880a8aa2b2cc521fbb86403d6909 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0698:0939cedf28a745cca44e1780 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0698:3a503cf81fc342dc9078a6bc | failed | Validation "Full repository Docker check" failed from direct result; npm run dev:docker-check produced 136 passed files / 1068 passed tests and one failure because its copy path excluded .hadara required by status-current-state-source.test.ts.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0698:69fd006597b242c3af3a06d1 |
<!-- /hadara:slot -->
