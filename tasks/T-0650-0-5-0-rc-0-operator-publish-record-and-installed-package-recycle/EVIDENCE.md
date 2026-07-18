# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0650:e83a40c81c404d8284e695a1 | passed | validation | Validation "npm registry published rc0 metadata" passed from direct result; Direct npm view hadara@0.5.0-rc.0 version dist-tags --json returned version 0.5.0-rc.0, next 0.5.0-rc.0, latest 0.4.6 after wrapper execution failed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0650:8e33a891e3f74f1d8b76c8ae | passed | release | Verified GitHub Release v0.5.0-rc.0 is public prerelease targeting b4223f7782d813ec7420c104b883ebc48ffb71f9; url https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.5.0-rc.0. |
| ev:T-0650:b738ff91e7c64d5db95b4df7 | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0650:613eeea103b445be8bdfb083 | passed | release | Resolved the earlier package recycle network/sandbox failure after escalated installed-package recycle passed for hadara@next 0.5.0-rc.0 with reduced public evidence artifact artifacts/package-recycle/2026-07-18T10-44-35.028Z-summary.json. |
| ev:T-0650:3b3cd180ac9e4284b9c9fab2 | passed | validation | Task finalize done-level readiness for T-0650 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:d6b24a9b37a65490f7b565b60f4bc3095ff0211eb27d206a73f3531cf4c3d6c1 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0650:2562c66df18e4a398df591da |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0650:f242bbfd50ab4a30a2968f92 | failed | Validation "npm registry published rc0 metadata" failed; command: npm view hadara@0.5.0-rc.0 version dist-tags --json; exitCode: 1; signal: null; durationMs: 70359; stdoutHash: sha256:9cf9606b08a76a628dc76220c495133d2624401ae1b66478dc440fa49f7bb930; stderrHash: sha256:a2e4420a7135d528e988361c67c2dba73ed2f56c2aa850bb12ba5cd3b5f556f1 | Resolved | ev:T-0650:e83a40c81c404d8284e695a1 |
| ev:T-0650:ec5b0ec3a2264a7e9c08c764 | failed | Installed-package recycle failed with reduced public evidence. | Resolved | ev:T-0650:613eeea103b445be8bdfb083 |
<!-- /hadara:slot -->
