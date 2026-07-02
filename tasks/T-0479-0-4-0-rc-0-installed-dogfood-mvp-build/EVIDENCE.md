# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0479:cd8f8b6dcd5b491da343e78e | passed | validation | Fresh unmounted container hadara-rc-dogfood-0479 installed hadara@0.4.0-rc.0 globally; hadara version --json reported packageVersion 0.4.0-rc.0 and distLooksStale false. |
| ev:T-0479:44d172a854d844fca613b484 | passed | validation | Dogfood project generated in fresh unmounted container and copied back as artifact: 12 HADARA capsules, FlowForge specs, structured report, and 5397 non-document software LOC. |
| ev:T-0479:5d1dd05f6e384512abe57030 | passed | validation | FlowForge MVP smoke passed in the unmounted container and again from copied artifact with elevated localhost bind; npm run smoke returned readiness 46 and 10 seeded items. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0479:9f19a4f4b6da485595e0d59c |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
