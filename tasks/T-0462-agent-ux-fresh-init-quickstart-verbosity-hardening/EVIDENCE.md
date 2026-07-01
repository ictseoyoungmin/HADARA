# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0462:ca54a04cfc91403f91eb81b5 | passed | validation | Fresh governed init smoke passed: built CLI created 15 files in /tmp/hadara-t0462-init-mP9Dg1, docs/HADARA_WORKFLOW.md has Quickstart at line 9 before Minimal Loop at line 21, workflow/context/agent docs total 373 lines, and init doctor returned ok:true with no issues. |
| ev:T-0462:84b3176bc6cd4cde96c34534 | passed | validation | Scoped Docker validation passed: init and schema-fixtures tests completed 2 files / 14 tests, followed by TypeScript build passing in /tmp/hadara. |
| ev:T-0462:1d80cfb0d819461d86a75c47 | passed | validation | Resolved broad validation residual for T-0462: scoped init/schema validation and fresh governed init smoke passed, while docs-doctor fixture failures are outside this quickstart scaffold change and should be handled by a later fixture cleanup capsule if needed. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0462:34b5fd23bc4a4a7196debe0a |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0462:e0c87ae662b84f8fa20128cc | failed | Broad focused validation attempt failed when docs-doctor.test.ts was included: init and schema-fixtures passed, but docs-doctor historical fixtures failed on unregistered Required Reading and missing DEVELOPMENT_SLICES expectations that are outside this quickstart scaffold change. | Resolved | ev:T-0462:1d80cfb0d819461d86a75c47 |
<!-- /hadara:slot -->
