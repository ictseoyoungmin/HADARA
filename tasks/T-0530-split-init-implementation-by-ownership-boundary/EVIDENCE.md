# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0530:add0563b2b744306b93d5716 | passed | validation | Validation "TypeScript build" passed from direct result; Direct npm run build passed after validation wrapper launch failure.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0530:c12315aa60ef43f1b3a15616 | passed | validation | Validation "Focused init tests" passed from direct result; Direct focused Vitest passed: tests/unit/init.test.ts tests/unit/docs-registry.test.ts tests/unit/legacy-boundary.test.ts tests/unit/package-smoke-dry-run.test.ts, 4 files / 48 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0530:f8a04f134be34f3281c2aa67 | passed | validation | Validation "Built init smoke" passed from direct result; Built CLI governed init and init doctor passed in /tmp/hadara-t0530-init-smoke; generated docs had no removed command strings in the checked set.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0530:d8d7c9cb370d4a6daef61942 | passed | validation | Validation "Docker sync-build" passed from direct result; Docker dev:docker-sync-build passed: npm ci, TypeScript build, full Vitest 154 files / 1036 tests, workspace dist refresh, and built init doctor smoke returned ok true with existing HADARA-dev warnings.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0530:64d26b917eb04abea8e8c8da | passed | validation | Validation "Diff whitespace" passed from direct result; git diff --check passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0530:7dce24b78ef5477a8d708b22 | passed | validation | Task finalize done-level readiness for T-0530 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:fd97be523f517a534dc183ed3537bca3951823f84aa711bdd2bf320ce7c8944a |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0530:1984886333834c8392a1a0bd |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0530:f2b8917c86e243288c8cfbac | blocked | Validation "TypeScript build" blocked; blocked because validation command could not be launched (EPERM): spawnSync npm EPERM; command: npm run build; exitCode: 0; signal: null; durationMs: 14378; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0530:add0563b2b744306b93d5716 |
<!-- /hadara:slot -->
