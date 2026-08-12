# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0778:da43a3e5cb8b490b94891d25 | passed | release | Prepared the Docker ext4 publish clone and verified the retained exact RC5 tarball, checksum, and manifest by SHA-256; no external mutation performed. |
| ev:T-0778:0fb7269586c4445e8228083d | passed | release | hadara release artifact --execute generated and attached the RC5 tarball/checksum/manifest report; retained release bytes match the expected RC5 artifact set. |
| ev:T-0778:79f63f1f7c6b4ce98d2c60e7 | passed | release | Public-package candidate package smoke passed with reduced evidence. |
| ev:T-0778:6236b462099849edab8ca1f1 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0778:c4798cf9909f42b6a97493d7 | passed | release | Operator publication report recorded npm hadara@0.5.0-rc.5, npm dist-tag transitions, and exact release asset digests; GitHub mutation was completed separately by the operator. |
| ev:T-0778:a14983a2a9ba4e99a0c2b527 | passed | release | GitHub v0.5.0-rc.5 is public prerelease with exactly three uploaded assets whose observed digests and byte lengths match the retained RC5 tarball, checksum, and manifest; npm latest/next tags remain correct. |
| ev:T-0778:94dc7fb15ce34d7c9d273cce | passed | release | Public hadara@next RC5 lifecycle acceptance passed in a Codex CLI disposable consumer: init/doctor, validation/evidence, close execute closed-valid terminal, post-close retry zero-write, and fresh idle status without stale continuation. |
| ev:T-0778:3fec6c1dff5141de808b815e | passed | validation | Task closePlan done-level readiness for T-0778 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:91903eaefdbe67fa290039f55daff1323d9c936aea3447d125029d1533815ec0 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0778:f7efadee26d946dd98f23154 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
