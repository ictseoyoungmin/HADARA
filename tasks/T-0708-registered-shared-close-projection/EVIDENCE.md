# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0708:9a59fb2db23e458b8c8e5721 | passed | validation | Validation "Full repository validation" passed from direct result; npm run check passed 142 public files/1106 tests and 16 HADARA-dev files/129 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0708:c53a8975802c466aaa165e40 | passed | validation | Validation "Focused shared-projection regressions" passed from direct result; Focused task finish, close, workflow-doc, and current-state suites passed 4 files/46 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0708:9e610f42622e4bf3a3d9cd4e | passed | validation | Validation "Built CLI fresh Init close-plan smoke" passed from direct result; Fresh standard Init built-CLI close dry-run reported zero optional shared-document state entries or advisories.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0708:e8828b7000424068846fab77 | passed | validation | Validation "Diff and evidence hygiene" passed from direct result; git diff --check and evidence lint passed with zero issues.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0708:13890842f14f491dbaa0be15 | passed | validation | Task finalize done-level readiness for T-0708 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:a25bdfa0e9b07f26d81734a18e5fafde8616c81d8923d80bd0911b017600d9fa |
| ev:T-0708:14273b23b09a4257bbbd0883 | passed | validation | Validation "Focused shared-projection regressions" passed; command: npm run test:focused -- tests/unit/task-finish.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts tests/unit/init-v1-upgrade.test.ts; exitCode: 0; signal: null; durationMs: 1934; stdoutHash: sha256:aeea656066b452e816e893753198862692696ca9eeea63cd446b46e958e403e2; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0708:236719561b504c798608745f | passed | validation | Validation "Full repository validation" passed; command: npm run check; exitCode: 0; signal: null; durationMs: 31346; stdoutHash: sha256:92ebca0591a0ef9597bb02685cf2b7a8bc30cd970d8fc3959fa9de46bc6b9d5d; stderrHash: sha256:184337221e5ebbb9fe2b9a63d6c54e9e18c2f046759a71c12edff1cf97e56f8c |
| ev:T-0708:5c4abdd37b4347719a3d47fb | passed | validation | Docker build refreshed workspace dist; built CLI fresh standard Init close dry-run planned only TASK.md, HANDOFF.md, and Task Board writes with no optional shared documents. |
| ev:T-0708:e77c94fa33a54d769ea24fe7 | passed | validation | Final git diff --check and T-0708 evidence lint passed with zero issues after refreshed validation evidence. |
| ev:T-0708:7c43ffd03149496cb66250ab | passed | validation | Task finalize done-level readiness for T-0708 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:502521e818a696affb29367414afdf626dd4336b236f2999d5827e6166bf59bb |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0708:7445e8cc784141e3959206ad |
| close evidence | passed | ev:T-0708:defaa40a72e844178dd96797 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0708:30b0929ae5fc4ddda989e797 | failed | Validation "Full repository validation" failed from direct result; Initial npm run check found one stale HADARA_WORKFLOW wording expectation; implementation suites otherwise passed.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0708:9a59fb2db23e458b8c8e5721 |
| ev:T-0708:456aa92e5f8c4198bcfa7188 | failed | Validation "Focused shared-projection regressions" failed from direct result; A newly added generated-workflow assertion targeted text owned by a different template; implementation regressions passed.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0708:14273b23b09a4257bbbd0883 |
<!-- /hadara:slot -->
