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
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0583:b4c516001bd248fabf5fe8f3 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Unresolved | evidence.jsonl |
| ev:T-0583:4754c41ee2b94ee8828b4ae9 | failed | Package smoke local failed with reduced public evidence. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
