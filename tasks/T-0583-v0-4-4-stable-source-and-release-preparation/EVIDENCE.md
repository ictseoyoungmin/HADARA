# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0583:401590ab577448928dc01488 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0583:e388674d09bb4786bc9a98f5 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0583:5518f956424c431a96f9206a | passed | validation | Validation "stable 0.4.4 source metadata and docs" passed from direct result; package.json/package-lock/dist report 0.4.4; README, Getting Started, release notes/readiness, helper examples, and GITHUB_RELEASE_NOTE.md were retargeted to stable 0.4.4; npm view hadara@0.4.4 returned expected E404 before publish.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0583:7124c5762ff64ec5b166cb69 | passed | validation | Validation "stable 0.4.4 release validation baseline" passed from direct result; Docker sync-build/full suite passed 153 files and 1068 tests with dist refreshed; package smoke passed after approved npm-cache EROFS rerun; clean-checkout smoke passed; docs doctor was healthy/currentness clean; strict release gate passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0583:2a75e8e6ad0d432895a67fc1 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0583:dfdcd307bd2b40e2bbf9df80 | passed | release | Final stable 0.4.4 release readiness checks passed: release artifact, release dry-run, publish dry-run, strict release gate, package smoke, and clean-checkout smoke are green; earlier dirty-worktree artifact and sandbox npm-cache failures are resolved by clean commit artifact evidence and approved package-smoke rerun. |
| ev:T-0583:5723e0f57f404a2cab627cef | passed | validation | Docs registry profile hotfix validation passed: document profiles are now limited to basic/standard/governed, docs list/doctor reject hadara-dev in entry profiles, focused docs/init tests passed, and Docker sync-build full suite passed 153 files / 1069 tests with dist refreshed. |
| ev:T-0583:f0ed9b5cb09f429198437689 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0583:308d82caa20f47a59cbc9415 | passed | release | Approved package smoke rerun resolved the sandbox npm-pack failure after the docs-registry profile hotfix; installed package smoke passed with init docs sanity and command-surface drift checks. |
| ev:T-0583:6ef3051d7e7948d4a614c11e | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0583:21cef95476e142c49e884b63 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0583:7b86c5b10f054f9d9a8be71d | passed | release | Final stable 0.4.4 readiness after docs-registry profile hotfix passed: package smoke, clean-checkout smoke, release artifact, release dry-run, publish dry-run, strict release gate, and docs doctor all passed on commit 4db58a4a; npm/GitHub publication remains operator-controlled. |
| ev:T-0583:6ca7e2bbf8e4461993b2d5e4 | passed | validation | Task finalize done-level readiness for T-0583 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:3b7721a23ec6e8986e0aa1727af5fd796ace12c81e094d350f150d7f4b06d5df |
| ev:T-0583:f0a2f330a2824878b26d0643 | passed | validation | Task finalize done-level readiness for T-0583 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:7c559daae10ee210b9abdf76a5415c9d8abe647b7261fab4ff99c4b9505bcc20 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0583:d025448895ed457c9d31a74d |
| close evidence | passed | ev:T-0583:b08c25c37c324093a1e1ba60 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0583:b4c516001bd248fabf5fe8f3 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0583:dfdcd307bd2b40e2bbf9df80 |
| ev:T-0583:4754c41ee2b94ee8828b4ae9 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0583:dfdcd307bd2b40e2bbf9df80 |
| ev:T-0583:67d195824c104c61bbd4d475 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0583:308d82caa20f47a59cbc9415 |
<!-- /hadara:slot -->
