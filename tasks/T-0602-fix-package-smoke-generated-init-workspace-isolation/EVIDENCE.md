# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0602:2d9fd4b10da44a9294931163 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0602:cd431aa3b28541b5a93706c7 | passed | release | Resolved failed package-smoke attempt ev:T-0602:2b758245cc3941eb8a939750: reran smoke package with generated-init workspace isolation and --timeout 300; generated-init-docs and feature-smoke-core passed, and strict release gate accepted latest T-0602 package-smoke evidence. |
| ev:T-0602:07de22930b074abcaaa6ae6c | passed | validation | Validation "Package smoke regression tests" passed from direct result; npx vitest run tests/unit/package-smoke-dry-run.test.ts passed: 1 file, 22 tests; generated-init-docs now runs in an isolated init-docs-project workspace.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0602:3cb6ad5f2ee14d86bacdd9f5 | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed after package-smoke generated-init workspace isolation fix.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0602:8d13919a682141f6b4c335ea | passed | validation | Validation "Docker build" passed from direct result; docker exec hadara-dev bash -lc 'cd /workspace && npm run build' passed after package-smoke generated-init workspace isolation fix.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0602:4d6cb16158b8456187b1856b | passed | validation | Validation "Package smoke" passed from direct result; node dist/cli/main.js smoke package --execute --timeout 300 --task T-0602 --attach-evidence --json passed; generated-init-docs ran in isolated init-docs-project and feature-smoke-core passed in 73626ms.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0602:1915a8a924d34fb99f14290c | passed | validation | Validation "Release gate" passed from direct result; node dist/cli/main.js release gate --mode strict --json passed and recognized latest package-smoke evidence from T-0602 at 2026-07-14T06:59:29.187Z.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0602:7e748906121241ea81805a13 | passed | validation | Task finalize done-level readiness for T-0602 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:d38e89c05f08c9da752460dac3f6aec1ff5c5b7b4245e3d451fed6ae0928763d |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0602:ca8a5c32c5f44a6a8c282cde |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0602:2b758245cc3941eb8a939750 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0602:cd431aa3b28541b5a93706c7 |
<!-- /hadara:slot -->
