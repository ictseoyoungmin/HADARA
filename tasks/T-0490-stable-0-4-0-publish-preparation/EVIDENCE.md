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
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0490:a807dc3ab70e43baa13fdd3a |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
