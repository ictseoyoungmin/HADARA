# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0796:ac12337f30834c0eb91ba498 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0796:775aa93c55ed45f2b243ac51 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0796:38d789184a4e4ecaa6b44a09 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0796:8f8a6f0708dc4f7eb56b4f5d | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0796:357e227e41de4da987408220 | passed | validation | Validation "Strict release gate" passed from direct result; fresh RC6 strict release gate passed with 0 blockers and 0 issues; artifact, package smoke, and clean-checkout evidence are schema-valid; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release gate --mode strict --json; argvHash: sha256:aeea76264717f5615450101edf499fc22e0d7b5a73bd4e4ddf449fd6fb329767; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0796:836f37c975164c959252075f | passed | validation | Validation "Release dry-run" passed from direct result; release dry-run passed and reported readiness=ready for hadara 0.5.0-rc.6; tarball provenance matched and no publish/GitHub/Docker mutation executed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release dry-run --json; argvHash: sha256:561bc7ac596120bcefdf8d827a631f07973b1b94605afb66af074d64ce61209d; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0796:1b4a0fff88f54a7da7610329 | passed | validation | Validation "Publish dry-run" passed from direct result; publish dry-run passed; npm/GitHub targets remain approval-gated, token absence is warning-only, and no release mutation executed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release publish --mode dry-run --json; argvHash: sha256:309f2b2be8b314ed12f5aa0223890454e2e2f0f453be2601b4536cde7ab74356; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0796:d6ded1df8b8347b7a9780d13 | passed | release | Clean-checkout smoke retry passed with HADARA_VITEST_TEST_TIMEOUT_MS=120000 after the default 30-second concurrent-evidence timeout; no source or release mutation occurred. |
| ev:T-0796:3d21400b0f524852a8bf52ea | passed | validation | Explicit resolution record: the initial clean-checkout timeout was environment-induced; the same retained-source retry completed clean-checkout successfully with no release mutation. |
| ev:T-0796:3419c1925b564e0f82ef93fa | passed | validation | Explicit resolution: clean-checkout retry passed with extended Vitest timeout after the default Docker contention timeout. |
| ev:T-0796:63536bb936d04a58b5027d3f | passed | validation | Task closePlan done-level readiness for T-0796 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:72957efd745176da4dfac7aa4188a71edb31d256b9ff0f63e58d6c4eda4b7ed5 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0796:871bf77f29c2419dbe47bb12 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0796:ad85142b369a420f9083cb7c | failed | Clean-checkout smoke failed with reduced public evidence. | Resolved | ev:T-0796:3419c1925b564e0f82ef93fa |
<!-- /hadara:slot -->
