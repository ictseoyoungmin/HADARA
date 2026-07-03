# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0494:e05199a733814fbe97abda8a | passed | validation | Ext4 container focused validation passed: npm ci; npm test -- --run tests/unit/docs-registry.test.ts tests/unit/help.test.ts (2 files, 17 tests); npm run build. Host focused test was unavailable because vitest is not installed in workspace node_modules. |
| ev:T-0494:87f93c47f42448a0a0fcdf27 | passed | validation | Built CLI smoke passed: help command docs.register and docs register --help both print controlled values; invalid docs register tokens return field, received, allowedValues, and suggestions for guide/linked/project/human-reviewed. |
| ev:T-0494:26e15e37462143e08ef4d154 | passed | note | Created and registered docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md for reviewer/dogfood functional debt targeted at 0.4.1-rc.0, including docs.complete-spec, docs.mark-drift, Required Reading lifecycle, docs separation, registry projection, and broader controlled-vocabulary audit follow-ups. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0494:9dc4dcff34ac4748b35e786e |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
