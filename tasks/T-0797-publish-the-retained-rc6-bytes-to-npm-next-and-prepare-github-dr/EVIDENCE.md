# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0797:de1b9887b3e2428fb7d4d7e9 | passed | validation | Validation "Publish helper syntax and command surface" passed from direct result; bash -n scripts/release/manual-publish-rc.sh and the --help command both passed; retained artifact hash and release-input hash were verified without mutation.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0797:081ce35ded7d41f082600ee9 | passed | validation | Validation "Operator publish preflight" passed from direct result; After moving the Docker-owned ignored dist directory aside and recreating a user-owned dist directory, npm run build passed; no npm, GitHub, tag, or registry mutation occurred.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
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
| ev:T-0797:18716ecddf8c441fb5c6f341 | failed | Operator publication attempt stopped during final local validation because TypeScript could not overwrite Docker-owned dist files (EACCES); no npm, GitHub, tag, or registry mutation occurred. | Resolved | ev:T-0797:081ce35ded7d41f082600ee9 |
<!-- /hadara:slot -->
