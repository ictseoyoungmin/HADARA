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
| ev:T-0667:0ef3e80d0395484f94c3ef7e | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0667:17932d8a4a684db18a62dbe8 |
| ev:T-0667:4888dda40f634271a9579c82 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0667:17932d8a4a684db18a62dbe8 |
| ev:T-0667:d8d2a550ac6048cab2f2b097 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0667:17932d8a4a684db18a62dbe8 |
| ev:T-0667:cd56c4e5bb614b0f8f4eed00 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0667:17932d8a4a684db18a62dbe8 |
<!-- /hadara:slot -->
