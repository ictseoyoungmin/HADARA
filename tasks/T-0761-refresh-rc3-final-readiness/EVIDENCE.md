# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0761:5ad65cc3c0bd47eeabb6c697 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0761:3ea412124e9044079edabd1d | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0761:257b635afb2a4d3ea9fc8c98 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0761:4626bb2935134a84beb34ef4 | passed | validation | Validation "Full repository validation" passed; command: npm run check; exitCode: 0; signal: null; durationMs: 36640; stdoutHash: sha256:82ce88351d15e22479d23a4abbef649a69c85bc10a1bc95a033ed2c011846689; stderrHash: sha256:1b865a631d7a2d4fc0ad18adc9ecd4d62c080f43661ded013cc3738ec3f27bfe |
| ev:T-0761:c7ab31e649cf41e2b6122074 | passed | validation | Validation "Strict release gate" passed; command: node --import tsx tools/dev-surfaces.ts release gate --mode strict --json; exitCode: 0; signal: null; durationMs: 871; stdoutHash: sha256:caae559d8f6e316487544caa2d3d8ae3c31999eea44e44eb5d62856ca6eb8615; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0761:c5f6c9222d5d486f80aff945 | passed | validation | Validation "Release dry-run" passed; command: node --import tsx tools/dev-surfaces.ts release dry-run --json; exitCode: 0; signal: null; durationMs: 1016; stdoutHash: sha256:c5f1e4dc6a457985512391547581125456f85f197456909b1f673030a4131116; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0761:db676098038f40bbae98329d | passed | validation | Validation "Publish dry-run" passed; command: node --import tsx tools/dev-surfaces.ts release publish --mode dry-run --approval-actor local-operator --approval-reason T-0761 RC3 readiness refresh --json; exitCode: 0; signal: null; durationMs: 1015; stdoutHash: sha256:6fc1b429498563c1d795c8ec6a000f459dc26e354484b706c410dc5ede3f7266; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0761:d6256460ed964503ac4171f5 | passed | validation | Task finalize done-level readiness for T-0761 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:9b5c6c35b816cae50af98a1f4ed8c8516f5358733ac8ce0d474280a8975b1d4e |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0761:073a6e1ecbd54082a237c7bd |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
