# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0509:0c312d0668114f02aeebf4b4 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0509:580e544b0e2e4484b3fdacfb | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0509:9f1f8cbc00cc405384db41f3 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0509:34a2f44b3e3e4918a551415a | passed | validation | Validation "npx vitest run tests/unit/task-finalize.test.ts --reporter=dot" passed from direct result; Focused finalize-auto and package-smoke regression tests passed: 2 files / 35 tests, including clean auto close, blocker zero-write refusal, and plan mismatch refusal.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0509:d75bd5d8cf5b45fab7a8ce29 | passed | validation | Validation "npm run build" passed from direct result; TypeScript build passed for hadara@0.4.1-rc.0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0509:985a38847a4e47b6856f2280 | passed | validation | Validation "node dist/cli/main.js version" passed from direct result; Built CLI reported 0.4.1-rc.0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0509:c6e8cacc44814a249c5da181 | passed | validation | Validation "node dist/cli/main.js smoke package --execute --timeout 300 --json" passed from direct result; Docker package smoke passed for hadara@0.4.1-rc.0 with npm pack/install, doctor, command-surface drift, generated init docs, core feature smoke, cleanup, and evidence attachment.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0509:67c6d3713b684b6abeff192e | passed | validation | Validation "node dist/cli/main.js release gate --mode strict --json" passed from direct result; Strict release gate passed and now points at latest T-0509 package-smoke, clean-checkout, and release-artifact evidence.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0509:8d224267508c4883ae29027a | passed | validation | Validation "node dist/cli/main.js release dry-run --json" passed from direct result; Release dry-run passed for hadara@0.4.1-rc.0 with readiness status ready, blockers 0, warnings 0; mounted strict-release-gate stage was slow but non-blocking.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0509:5b14389630774f87b9481533 | passed | validation | Validation "node dist/cli/main.js release publish --mode dry-run --json" passed from direct result; Publish dry-run passed: release dry-run and metadata checks passed; NPM/GitHub token absence reported only as warnings; no mutation executed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0509:ff851321183342729b17293e | passed | release | npm view hadara@0.4.1-rc.0 returned E404, confirming the RC has not been published yet and publish remains an operator action. |
| ev:T-0509:b53a52f365724072a494f4ba | passed | validation | Resolved package-smoke and release-artifact transient failures: host npm cache EROFS and host Node spawn EPERM were environment-specific, release artifact dirty-worktree refusals were expected guard behavior, and later Docker package-smoke plus clean-worktree release artifact passed. |
| ev:T-0509:4c08661d17bb4db486e90f48 | passed | validation | Task finalize done-level readiness for T-0509 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:e64990cf9828a00d179d8e6ebd59d5e3f5a6b593aeb87a1857bbb22f843b8296 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0509:6e3fe80539a64725b57c7680 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0509:ca69f3eac320443baaf0434b | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0509:b53a52f365724072a494f4ba |
| ev:T-0509:8ea0e7e3477d40b5ab1c3d4e | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0509:b53a52f365724072a494f4ba |
| ev:T-0509:b121060e0f2c4de5bb2d7fd3 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0509:b53a52f365724072a494f4ba |
| ev:T-0509:57318dd2c824493ba2577181 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0509:b53a52f365724072a494f4ba |
| ev:T-0509:0eebc7c4c3d44d0bb1aefc34 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0509:b53a52f365724072a494f4ba |
| ev:T-0509:38fc45b93b634d3bb69a18ad | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0509:b53a52f365724072a494f4ba |
<!-- /hadara:slot -->
