# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0490:612ac562b8564f12b3881032 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0490:767408285ae34a27b334aa5d | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0490:5bc67bef93e744289490bfb6 | passed | validation | Stable 0.4.0 prep validation: exact npm hadara@0.4.0 lookup returned not found as expected before publish; package.json and package-lock target 0.4.0; ext4 validation copy passed npm ci, npm run check with 150 files / 997 tests, npm run build, and built CLI version reported packageVersion 0.4.0 with distLooksStale false; workspace built CLI version also reported packageVersion 0.4.0 with distLooksStale false; strict release gate returned ok:true; release dry-run recognized current T-0490 package-smoke and clean-checkout-smoke evidence but remained blocked until release artifact evidence is regenerated from a clean commit by the publish helper. |
| ev:T-0490:a50470bfe0944c59aa980cda | passed | validation | Final T-0490 document validation passed: git diff --check returned clean and hadara harness validate --task T-0490 --level done --json returned ok:true with no issues. |
| ev:T-0490:9bff847b4185492cb51c4345 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0490:80adc8e2a1a74c78a0d08deb | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0490:cd3e8afff47a4fba8f8bb117 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0490:40deeacaa24640d499a498c4 | passed | release | Published hadara@0.4.0 to npm and verified npm view returned 0.4.0; GitHub Release draft requested: false. |
| ev:T-0490:4d5e44912eae4936ac5faab1 | passed | validation | Post-publish workspace verification passed: copied clean publish-clone release artifact, package-smoke, clean-checkout, and npm publish evidence into the workspace; npm view hadara@0.4.0 returned version 0.4.0, latest=0.4.0, next=0.4.0-rc.0, shasum 6268abfd73f60ca2e1dc3b32d8196e6876065948; release dry-run returned ready with blockers 0; release publish dry-run returned ok:true with no mutation executed and token warnings only. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0490:a807dc3ab70e43baa13fdd3a |
| close evidence | passed | ev:T-0490:354f4e6036494f52ba3cc964 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
