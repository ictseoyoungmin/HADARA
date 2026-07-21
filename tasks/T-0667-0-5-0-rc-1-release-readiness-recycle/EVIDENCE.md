# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0667:87eb2cd5efa747458b8e749f | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0667:d533bf36c9e74741a12398f3 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0667:e2c5104a4bfc4df6abb0300c | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0667:17932d8a4a684db18a62dbe8 | passed | release | Docker release-readiness recycle: fresh node:22-bookworm image digest sha256:5647be709086c696ff32edaaf1c70cd26d1da6ab2b39c32f3c7b4c4a31957e37, recreated hadara-dev container d031e781b9af, Docker sync-build passed, package smoke passed with --timeout 300 after two recorded 120s timeout failures, clean-checkout smoke passed, release artifact passed from clean ext4 clone, strict release gate passed, release dry-run ready/blockers 0, publish dry-run ok with token warnings only, npm registry still next=0.5.0-rc.0 latest=0.4.6. |
| ev:T-0667:eed4dba170744234a38924bf | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0667:af0b1df9f11c47a0a7e0691c | passed | release | Final rc1 release-readiness confirmation: strict release gate passed with latest package smoke T-0667 2026-07-21T11:14:33Z, clean-checkout smoke T-0667 2026-07-21T11:18:00Z, and release artifact T-0667 2026-07-21T11:34:03Z; release dry-run returned ready with blockers 0 and warnings 0 for git commit bd25aed975baca68d8b80030402e04e7d6394a6a; publish dry-run returned ok with NPM/GitHub token warnings only and no mutation. |
| ev:T-0667:8849c4d3e5b14831940efd41 | passed | validation | Task finalize done-level readiness for T-0667 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:c7c3fe0ffaefff86de724c400a9ce3965d99e96fcff2b59e896605f7a84d9ec6 |
| ev:T-0667:b6a72501b58b422da31a4dc9 | passed | validation | Task finalize done-level readiness for T-0667 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:9d43dcc8540150df3a690c3f82d9bd4fb630ffb492913b01459624f767d5ccab |
| ev:T-0667:8cc8205c568f4051907f6eb3 | passed | validation | Task finalize done-level readiness for T-0667 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:0154cacc360ef0cfd0e72a23cfa22608c6f690c33e4acbfe256b4e3a4bf7f389 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0667:5d1fe36fcba54c04b57d20ff |
| close evidence | passed | ev:T-0667:070ce8ff09ca4fcc9618a0ae |
| close evidence | passed | ev:T-0667:102435698b0048f2ba4c56f9 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0667:0ef3e80d0395484f94c3ef7e | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0667:17932d8a4a684db18a62dbe8 |
| ev:T-0667:4888dda40f634271a9579c82 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0667:17932d8a4a684db18a62dbe8 |
| ev:T-0667:d8d2a550ac6048cab2f2b097 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0667:17932d8a4a684db18a62dbe8 |
| ev:T-0667:cd56c4e5bb614b0f8f4eed00 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0667:17932d8a4a684db18a62dbe8 |
<!-- /hadara:slot -->
