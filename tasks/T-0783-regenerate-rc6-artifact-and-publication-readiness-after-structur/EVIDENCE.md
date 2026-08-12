# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0783:7b4b45160d11467cb68de0a6 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0783:3606b5bea9ae49beb5a1d1d9 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0783:c0b88ff71bcf4230ae3f07de | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0783:0805a5338ba34c87aefe2100 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0783:a73305de831142dfa4faa695 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0783:c5950329c26a495fb8dad272 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0783:f12f21e3e0884a24ade77e45 | passed | release | RC6 exact artifact retention, package and clean-checkout smokes, managed-state strict gate, release dry-run, and publish dry-run passed without external mutation. |
| ev:T-0783:ef391acdcc3c4eb582916d3a | passed | validation | Evidence lint verified all eight RC6 preparation records and their byte-bound artifacts with zero integrity issues; the failed reused-path smoke remains preserved and superseded by a fresh-path pass. |
| ev:T-0783:6fe4d833f7ea4a8ba910af64 | passed | validation | Task closePlan done-level readiness for T-0783 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:c71867ead8ea021f080549d4cec83c8886555af76f7f4ec38ae6c6016347097c |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0783:24abd11443b24c02b025ff35 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0783:9ec98fa06a184bf5a8c2549f | failed | Package smoke local failed with reduced public evidence. | Resolved | TASK.md#Risks / Follow-ups |
<!-- /hadara:slot -->
