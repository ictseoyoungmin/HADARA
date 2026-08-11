# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0763:84c5bf346e9748e4a61286d0 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0763:f6c9879e8ad7453dbc88ace5 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0763:e65676daf07649f69624dfd4 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0763:43796b9113ff4961a6ee82bc | passed | validation | Validation "Full repository validation" passed; command: npm run check; exitCode: 0; signal: null; durationMs: 37860; stdoutHash: sha256:5ed7e3f976fb0369564b7f4f4c4c1bdada58ce2baaf534525cc057f77bac7b00; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0763:0bd3e18ee8494dde83167b71 | passed | validation | Validation "Strict release gate" passed; command: node --import tsx tools/dev-surfaces.ts release gate --mode strict --json; exitCode: 0; signal: null; durationMs: 951; stdoutHash: sha256:8beb3cedbd1f2feed4739f7bd7d0fe6b2347c955d9428c828ceb7aa1ac6e7256; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0763:146d2746d9804bccbf0fac09 | passed | validation | Validation "Release dry-run" passed; command: node --import tsx tools/dev-surfaces.ts release dry-run --json; exitCode: 0; signal: null; durationMs: 1032; stdoutHash: sha256:f695647c9d9f312deac220057e02e97ecb9b1942ee3991e8588191de2af7d748; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0763:58578ea3cb38403283b90c64 | passed | validation | Validation "Publish dry-run" passed; command: node --import tsx tools/dev-surfaces.ts release publish --mode dry-run --approval-actor local-operator --approval-reason T-0763 RC3 publish preparation --json; exitCode: 0; signal: null; durationMs: 983; stdoutHash: sha256:6fc1b429498563c1d795c8ec6a000f459dc26e354484b706c410dc5ede3f7266; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0763:4e57d6cc591649488d6053a1 | passed | validation | Validation "Exact tarball npm publish dry-run" passed; command: npm publish /tmp/hadara-t0763-artifact/hadara-0.5.0-rc.3.tgz --dry-run --registry=https://registry.npmjs.org --tag=next --json; exitCode: 0; signal: null; durationMs: 1176; stdoutHash: sha256:7980ab43eca85e4ba964bbfae0195b0a8285d82caed7d5bd1e4f6178bd53d98e; stderrHash: sha256:270d9f2a2e3deb26a74fed3a651c50d42c11fc4ea9f7d57fc5fca72358a4a1b5 |
| ev:T-0763:9d34929d0f82454aaf4d553b | passed | release | Operator reported npm publish completed; read-only npm view hadara@next returned 0.5.0-rc.3. |
| ev:T-0763:14975c72acda4514a8497233 | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0763:04c70bb575b640cdb621f7c7 | passed | operation | Installed hadara@next 0.5.0-rc.3 deep dogfooding passed: fresh consumer init, T-0001 validation/evidence, close returned closed-valid, same-close retry was idempotent with zero writes, and fresh task status returned idle with no recommendation. |
| ev:T-0763:210c16f6b2da4ee5a46bdef9 | passed | validation | Validation "Installed RC3 dogfooding report" passed from direct result; hadara@next 0.5.0-rc.3 installed, recycled, and completed a closed-valid consumer lifecycle with idempotent close retry and terminal fresh status.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
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
| ev:T-0763:a3ca34fc604a4b0f8aa52e0c | failed | Read-only GitHub check found v0.5.0-rc.3 exists with isDraft=false, isPrerelease=false, and no assets; the RC3 prerelease and artifact-attachment contract is not met. | Unresolved | evidence.jsonl |
| ev:T-0763:6247d461e5b94d5bbb6acf01 | failed | Installed-package recycle failed with reduced public evidence. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
