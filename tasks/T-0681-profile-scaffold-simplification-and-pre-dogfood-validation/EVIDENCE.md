# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0681:2119a5ce8388421f8fd2bab6 | passed | validation | Validation "Focused init, registry, current-state, doctor, and template tests" passed from direct result; Corrected focused suites jointly covered 8 unique files and 123 tests, including profile output, registry, doctor, current-state, project-state update, and task-finish boundaries.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0681:de24e4995fd74537a928a9de | passed | validation | Validation "Full source check" passed from direct result; Corrected Docker npm run check passed TypeScript build plus 166 of 166 files and 1240 of 1240 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0681:17b7b5136b5d4af09bc2dd0d | passed | validation | Validation "Built CLI three-profile scaffold and doctor comparison" passed from direct result; Fresh built CLI scaffolds were materially distinct: basic 8 files, standard adds context and project state, governed adds global handoff; all doctor clean with unversioned release and no forbidden consumer prose.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0681:aeacfa2301ed49acb1d293dc | passed | validation | Validation "Task close dry-run" passed from direct result; Reviewed close plan is executable with no blocking issues; only bounded finish bookkeeping precedes deferred ready/close/audit checks.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0681:44f53c0be19649dcb6b502df | passed | validation | Task finalize done-level readiness for T-0681 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:189754754cf23279f3b8835dce52370481cc4695aab81e5a8c5eeedc46cee2f9 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0681:cce3a167117e442abc32bc25 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0681:04a228f99e87446eb1284544 | failed | Validation "Focused init, registry, current-state, doctor, and template tests" failed from direct result; Initial focused profile run found 4 stale expectations across 3 of 6 files after intentional basic scaffold reduction.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0681:2119a5ce8388421f8fd2bab6 |
| ev:T-0681:ea6ea33c46684d52acb7ba4c | failed | Validation "Full source check" failed from direct result; First full Docker check passed 164 of 166 files and 1238 of 1240 tests; two remaining fixtures assumed PROJECT_STATE existed in basic.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0681:de24e4995fd74537a928a9de |
| ev:T-0681:a96aea0b77e645d386f0d7ff | failed | Validation "Task close dry-run" failed from direct result; Close dry-runs found two capsule controlled-value issues: waiting-for-operator could not create a task, and Compatibility was not an allowed risk kind; both were corrected.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0681:aeacfa2301ed49acb1d293dc |
<!-- /hadara:slot -->
