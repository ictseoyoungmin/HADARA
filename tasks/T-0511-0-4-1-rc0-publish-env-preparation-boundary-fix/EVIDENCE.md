# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0511:05bc85c32e2a4e52b8b3d09a | passed | validation | Validation "prepare help text" passed from direct result; bash scripts/release/prepare-publish-env.sh --help printed updated boundary guidance and opt-in --run-helper-dry-run option.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0511:4494d2cd339e4e4bb362165c | passed | validation | Validation "build" passed from direct result; npm run build passed (tsc -p tsconfig.json).; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0511:38e1c8a3228b49b7b8d50905 | passed | validation | Validation "focused release script tests" passed from direct result; docker exec hadara-dev bash -lc 'cd /workspace && npx vitest run tests/unit/manual-publish-script.test.ts --reporter=dot' passed 1 file / 6 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0511:77ba1d73ad6840138ffe9056 | passed | validation | Validation "prepare script syntax" passed from direct result; bash -n scripts/release/prepare-publish-env.sh passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0511:b1403dcd7fab4302b6bdf509 | passed | validation | Task finalize done-level readiness for T-0511 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:d42d719700df62e4c176ee7e858f8d621b041ddcbb239f242fed325323a198c7 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0511:fe741d68fec846aea3c86b20 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
