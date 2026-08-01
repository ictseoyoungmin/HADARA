# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0743:be2f858bebdc4c6fafae1eb7 | passed | validation | Validation "Status and close module focused tests" passed; failureClass: none; command: ./node_modules/.bin/vitest run tests/unit/status-json.test.ts tests/unit/clean-checkout-smoke.test.ts tests/unit/package-recycle.test.ts tests/unit/task-close.test.ts tests/unit/task-close-source.test.ts tests/unit/session-start.test.ts; argvHash: sha256:8ca373d8162fe58f1ada9ced44017c18e03ad59d9bb7aac1b02cce3f65dd7ea0; exitCode: 0; signal: null; durationMs: 7502; stdoutHash: sha256:71aa1b8b1c3c293b38c62ca3f052f978d480d0edca60169a0a0188a3c756793f; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0743:d0c6c89b595946e69b02f8f5 | passed | validation | Validation "Full npm check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 34823; stdoutHash: sha256:e1e4adb88bac3652bef4e3f5357906c15801f0ad41cad638711722ce6fba4fa3; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0743:2ddd0c0a5b6c45079d0c7b51 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0743:b39ad82a49164d37bcee14a9 | passed | release | Host package smoke passed after sandbox child-process EPERM diagnostic; resolves the earlier sandbox-restricted smoke result. |
| ev:T-0743:5b4e41cff4d64d8a954c7bad | passed | validation | Validation "Final status and close module focused tests" passed; failureClass: none; command: ./node_modules/.bin/vitest run tests/unit/status-json.test.ts tests/unit/clean-checkout-smoke.test.ts tests/unit/package-recycle.test.ts tests/unit/task-close.test.ts tests/unit/task-close-source.test.ts tests/unit/session-start.test.ts; argvHash: sha256:8ca373d8162fe58f1ada9ced44017c18e03ad59d9bb7aac1b02cce3f65dd7ea0; exitCode: 0; signal: null; durationMs: 8228; stdoutHash: sha256:e624e29812a453b1a0acb38c6244fd9ed589de0b0757c423a2fb477ea5b8a2e5; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0743:8f0c6d7b9eb5459d8d1bc5f8 | passed | validation | Validation "Final full npm check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 43342; stdoutHash: sha256:c77a74bb1b0f0ac129640c7c334e2934de22873ac0400c73c191c3eada206e1f; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0743:a8d7db4202ed48ae8f8cc320 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0743:8d54be6c2847497698d889d9 | passed | validation | Task closePlan done-level readiness for T-0743 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:32ac2a3d688b4f94fe8f659a4643feaee1a4802ba8fe38a14fc7ba1591253945 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0743:02085bad699649cebfa6cd9f |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0743:d54a66661b734092b031197d | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0743:b39ad82a49164d37bcee14a9 |
<!-- /hadara:slot -->
