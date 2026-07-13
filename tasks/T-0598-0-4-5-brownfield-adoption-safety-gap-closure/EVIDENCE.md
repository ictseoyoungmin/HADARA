# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0598:fb26285cf9694d9db8108e45 | passed | validation | Validation "Init safety regression tests" passed from direct result; npx vitest run tests/unit/init.test.ts passed: 31 tests, covering explicit --adopt, partial fail-closed, root-entry brownfield detection, symlink/marker/owner/task collision blockers, project-authored core doc ownership, and dynamic createdWith.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0598:7b83914e23c4437fbd528bf1 | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed after brownfield adoption safety hardening.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0598:d5619e3b362d48fd9e96c6bc | passed | validation | Validation "Docker build" passed from direct result; timeout 120 docker exec hadara-dev bash -lc 'cd /workspace && npm run build' passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0598:0f0db9fa78814ee3b6443004 | passed | validation | Validation "Direct CLI safety fixtures" passed from direct result; Direct dist CLI /tmp fixtures passed: explicit --adopt required, partial state fail-closed, single-file main.py brownfield zero-write, symlink unsafe, malformed marker fail-closed, and tasks/T-* collision fail-closed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0598:f8605ebd18f845ccb2451960 | passed | validation | Task finalize done-level readiness for T-0598 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:9adf0cc61e5a4261ddc5a3bfe443b9d84f069ffdd2c4adb94257979b7b7fdba4 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0598:db3d4fca5baf4d59a276c16b |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
