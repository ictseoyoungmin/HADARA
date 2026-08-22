# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0797:de1b9887b3e2428fb7d4d7e9 | passed | validation | Validation "Publish helper syntax and command surface" passed from direct result; bash -n scripts/release/manual-publish-rc.sh and the --help command both passed; retained artifact hash and release-input hash were verified without mutation.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0797:081ce35ded7d41f082600ee9 | passed | validation | Validation "Operator publish preflight" passed from direct result; After moving the Docker-owned ignored dist directory aside and recreating a user-owned dist directory, npm run build passed; no npm, GitHub, tag, or registry mutation occurred.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0797:0f51242241614168971a08c2 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0797:8dcf70987e8743b2a1032658 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0797:ff3cd5173b5042a28cae5221 | passed | release | Operator publication report durably recorded npm hadara@0.5.0-rc.6 before optional GitHub mutation. |
| ev:T-0797:23f1da59a6e64dd29f1d4297 | passed | release | Operator publication report recorded npm/GitHub mutation boundaries and exact v0.5.0-rc.6 release asset digests. |
| ev:T-0797:181c408e398e488e9160a91a | passed | validation | Validation "Published npm identity and dist-tag" passed from direct result; Read-only npm verification passed: hadara@0.5.0-rc.6 resolves and dist-tag next points to 0.5.0-rc.6; latest remains 0.4.6.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0797:629ef61202bf43749e3fe30e | passed | validation | Validation "Publish GitHub prerelease" passed from direct result; Operator-provided gh release edit output returned the v0.5.0-rc.6 release URL with --draft=false --prerelease; independent gh release view was unavailable in this environment due api.github.com connectivity.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 3; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0797:76b5a0cb9c6143dc8144d170 | passed | validation | Task closePlan done-level readiness for T-0797 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:6189a28dacb89fb271a50cdc60db0e33b20c9d3cdef58d8153312101dde0553e |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0797:f17991021a1c47b1a5ed70e3 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0797:18716ecddf8c441fb5c6f341 | failed | Operator publication attempt stopped during final local validation because TypeScript could not overwrite Docker-owned dist files (EACCES); no npm, GitHub, tag, or registry mutation occurred. | Resolved | ev:T-0797:081ce35ded7d41f082600ee9 |
<!-- /hadara:slot -->
