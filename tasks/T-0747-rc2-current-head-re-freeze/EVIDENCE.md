# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0747:6ff7889cf1864667a25149ea | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0747:961f1c14a9d14c2188df4e5d | passed | validation | Validation "Current-head clean-checkout smoke" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts smoke clean-checkout --execute --json; argvHash: sha256:00b4707999bbb000bf80ae09717ca9f76419e51584ed1a2c44059ff521d7e6a9; exitCode: 0; signal: null; durationMs: 59980; stdoutHash: sha256:ea14523ae35bdfbfec9ca0fe7526765620c79c38ce4955301707eca35c8548bb; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0747:ecd1ed25e35944edb7aa9e73 | passed | validation | Validation "Current-head package and consumer smoke" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts smoke package --execute --from /tmp/hadara-t0747-release-artifact/hadara-0.5.0-rc.2.tgz --source-root . --evidence-root . --smoke-project-root /tmp/hadara-t0747-package-consumer --json; argvHash: sha256:23fe18a140caeb50ae38c67b425061c86f485ee371bec0c2ff36b027f68f222b; exitCode: 0; signal: null; durationMs: 2020; stdoutHash: sha256:2c9f83ca30cbdc8c8b88904511f0d91ebebe1ccb41e7bce295f4dd08c64d3199; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0747:f3f8e37f78ac4ce499604b47 | passed | validation | Validation "Current-head installed lifecycle reproducible" passed; failureClass: none; command: node --import tsx tools/dev-surface/installed-lifecycle-smoke.ts --tarball /tmp/hadara-t0747-release-artifact/hadara-0.5.0-rc.2.tgz --result tasks/T-0747-rc2-current-head-re-freeze/artifacts/installed-lifecycle/result.json --json; argvHash: sha256:79bf1eae8838f51372017e7e7d51e21da721f8a871c79fe24229b13e4710b107; exitCode: 0; signal: null; durationMs: 3214; stdoutHash: sha256:54f803053acf29f7f467122a290ab3a1d5eaae8fcd1af8cd992f9d8ec619edd8; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0747:b898be0af9a249138db2ff7d | passed | validation | Validation "Current-head full npm run check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 33649; stdoutHash: sha256:28c680e9896ccd27a2566add6dda35dffc7153cc233bf9c6e9ee388bd4504177; stderrHash: sha256:1b865a631d7a2d4fc0ad18adc9ecd4d62c080f43661ded013cc3738ec3f27bfe |
| ev:T-0747:a56a8a88f8a04a989d982a9c | passed | validation | Validation "Current-head strict release gate" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release gate --mode strict --json; argvHash: sha256:aeea76264717f5615450101edf499fc22e0d7b5a73bd4e4ddf449fd6fb329767; exitCode: 0; signal: null; durationMs: 931; stdoutHash: sha256:db42f737d8afbfbc960f43f0f1183a60560bf968fba8676ef8dedc08aecc8113; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0747:ee78d0e4ee1948bab2a7137b | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0747:209d3306d44e4fa898e0d227 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0747:c5fd2deb6b464a03bedfa418 | passed | validation | Validation "Current-head package smoke artifact" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts smoke package --execute --from /tmp/hadara-t0747-release-artifact/hadara-0.5.0-rc.2.tgz --source-root . --evidence-root . --smoke-project-root /tmp/hadara-t0747-package-consumer-final --attach-evidence --task T-0747 --json; argvHash: sha256:a19a690478c1eb01eeb37acfcd0f250841afc4cb242eb41561fce9105aa1ebed; exitCode: 0; signal: null; durationMs: 2017; stdoutHash: sha256:f1fb0c7fb40cd45d4124980792a1cd6082a539060051b09e1b9ec8c97e40298b; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0747:0829598d30214f39981e4992 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0747:11bcad3ce81548f1b745a04f | passed | validation | Validation "Current-head strict release gate after artifact refresh" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release gate --mode strict --json; argvHash: sha256:aeea76264717f5615450101edf499fc22e0d7b5a73bd4e4ddf449fd6fb329767; exitCode: 0; signal: null; durationMs: 878; stdoutHash: sha256:d8f4ec99697e5da10283dae41b65422d095f3be32e813bfa03fe4a742b17b808; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0747:ec137d9a275d4421bf983f79 | passed | validation | Validation "Current-head release dry-run" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release dry-run --json; argvHash: sha256:561bc7ac596120bcefdf8d827a631f07973b1b94605afb66af074d64ce61209d; exitCode: 0; signal: null; durationMs: 928; stdoutHash: sha256:5e5002924fbc177024907e56ac189a50ec4670eefa14aeb05de9c886f9847514; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
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
| ev:T-0747:497bc8700df8482ab4da35cb | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0747:c5fd2deb6b464a03bedfa418 |
<!-- /hadara:slot -->
