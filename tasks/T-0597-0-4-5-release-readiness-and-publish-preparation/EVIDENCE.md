# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0597:087815326dff48f6b8a3e647 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0597:dc01645fec90418db3e3bb72 | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed on host and Docker build passed with timeout 120 docker exec hadara-dev bash -lc 'cd /workspace && npm run build'.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0597:6fd6a9c608c544c9aecfb7eb | passed | validation | Validation "Docker build" passed from direct result; Docker /workspace build passed after package-smoke cache hardening and version retargeting.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0597:1db86afa631d4d13891f009c | passed | validation | Validation "Docs and init doctor" passed from direct result; docs doctor --scope all returned health=healthy/currentnessVerdict=clean; init doctor returned ok=true with known HADARA-dev legacy warnings.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0597:7ef239b757d24c36a0f8c150 | passed | validation | Validation "Package smoke" passed from direct result; Docker /workspace package smoke passed with --execute --attach-evidence --task T-0597; installed package smoke, command-surface drift, generated init docs, and core feature smoke passed. Host direct package smoke remains affected by known child-process spawn limitations.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0597:60d4ee55202944daab3308bd | passed | validation | Validation "Release artifact and strict gate" passed from direct result; release gate --mode strict returned ok=true after T-0597 package-smoke evidence; release artifact execute correctly refused the dirty pre-commit worktree and remains assigned to the clean publish clone/manual helper after this source-preparation commit.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0597:07e3478a7f9d49e1874c0df2 | passed | validation | Validation "Package smoke cache regression" passed from direct result; npx vitest run tests/unit/package-smoke-dry-run.test.ts passed (21 tests), including pack/install NPM_CONFIG_CACHE env coverage.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0597:26de9c1a43544243b49f5834 | passed | validation | Task finalize done-level readiness for T-0597 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:505423f9b92514e86b4e6d0f71866741f6a6a00d11bb15cfa7fdb8d8581ecd40 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0597:5b632fde757b47afa34191e5 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
