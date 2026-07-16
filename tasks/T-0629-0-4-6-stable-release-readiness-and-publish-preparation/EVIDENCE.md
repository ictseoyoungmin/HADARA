# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0629:1bbd0107c26d4ff788b22da3 | passed | validation | Docker sync-build refreshed dist for 0.4.6: npm ci and TypeScript build passed in the hadara-dev container, dist was synced to the workspace, built CLI reported packageVersion 0.4.6 and distLooksStale=false. |
| ev:T-0629:5b8a1002bd774ac38481d46c | passed | validation | Stable version preflight passed: node dist/cli/main.js version returned 0.4.6, and npm view hadara@0.4.6 returned E404 as expected before operator publication. |
| ev:T-0629:78e72e046cdf499787751567 | passed | validation | Release package smoke passed for hadara@0.4.6: npm pack/install/core smoke completed successfully; warnings were limited to expected empty-stdout fallback metadata for installed doctor, command-surface, and core smoke capture. |
| ev:T-0629:ebdc4d27b38643448ef95176 | passed | validation | Strict release gate passed for hadara@0.4.6 source readiness: node dist/cli/main.js release gate --mode strict --json returned ok:true with no issues. |
| ev:T-0629:0470c074c3914064a6241d90 | passed | validation | Task finalize done-level readiness for T-0629 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:a58268971f81d0c6abb21091d6d71097d3239d0144dea919a7b4ae3f5df4008d |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0629:6b08e0e76a2d459c9b63c036 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
