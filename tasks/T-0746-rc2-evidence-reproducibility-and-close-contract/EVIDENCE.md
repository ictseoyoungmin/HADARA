# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0746:8802c6a3aed740c3a2fe4170 | passed | validation | Validation "Installed RC2 lifecycle reproducible" passed; failureClass: none; command: node --import tsx tools/dev-surface/installed-lifecycle-smoke.ts --tarball /tmp/hadara-t0746-pack-clean/hadara-0.5.0-rc.2.tgz --result tasks/T-0746-rc2-evidence-reproducibility-and-close-contract/artifacts/installed-lifecycle/result.json --json; argvHash: sha256:77aafd25eb69b45bf7d2e3f9248d02cafee0f1b0b764f8b88b944c81344e1108; exitCode: 0; signal: null; durationMs: 3165; stdoutHash: sha256:4009e4720948db0ada464dbbb4fa55298958599cec13f3b84eb9ba5ad4bdc102; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0746:258885859e774a67b7b960a4 | passed | validation | Validation "Installed RC2 lifecycle reproducible" passed; failureClass: none; command: node --import tsx tools/dev-surface/installed-lifecycle-smoke.ts --tarball tasks/T-0746-rc2-evidence-reproducibility-and-close-contract/artifacts/installed-lifecycle/hadara-0.5.0-rc.2.tgz --result tasks/T-0746-rc2-evidence-reproducibility-and-close-contract/artifacts/installed-lifecycle/result.json --json; argvHash: sha256:8c6821d1f7b0fd3e22a112203accd760dd8cc5a092ed4a8225d3dfd6387cf472; exitCode: 0; signal: null; durationMs: 2960; stdoutHash: sha256:a91c2aa363b55b944ca9cc5f5b99f45aef3739bc839c2b0ac7373fee4f61acc2; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0746:59b3f8fb4ee64ef5bbba9134 | passed | validation | Validation "Selection regression suite" passed; failureClass: none; command: npm test -- --run tests/unit/task-selection.test.ts tests/unit/task-selection-continuation.test.ts; argvHash: sha256:ae0d924a25116eb88a2803f377896bb28ce290d3b42ed4462d3f36cc2907eace; exitCode: 0; signal: null; durationMs: 1966; stdoutHash: sha256:f0f7335589ef4a88cccd65c105b61b3e45cef712b55d191676951c85c6ab995b; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0746:51c20a56c0644747a0c33a56 | passed | validation | Validation "Close model import audit" passed; failureClass: none; command: node -e const fs=require('node:fs'); const text=fs.readFileSync('src/task/close/model.ts','utf8'); if (/from ['\"]\.\/(?:plan/proof)['\"]/.test(text)) process.exit(1); console.log('close model owns shared types; no plan/proof imports'); argvHash: sha256:c33f30f08ff3e097c87e4449a9a7f56def4b5ec0ded28669de9873458c43c1eb; exitCode: 0; signal: null; durationMs: 41; stdoutHash: sha256:072033b35f52146e9bd4add3835cd0fee1a562646701936c81c93087d5723b48; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0746:4093fae038ad45c8ae45fcd3 | passed | validation | Validation "Init template contract" passed; failureClass: none; command: npm test -- --run tests/unit/init.test.ts; argvHash: sha256:d8fab2c876f67babd499f32010886737697daf69568d86af3e69a54acce33b03; exitCode: 0; signal: null; durationMs: 2016; stdoutHash: sha256:af7316d531edfb4be86b33144c12b25cb822a676028abafe8c4173ff3c30a51c; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0746:3e67d4a475db4724a6f022c0 | passed | validation | Validation "Full npm run check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 35855; stdoutHash: sha256:f99f3c645c062019ff1bafb116927b4fce3683c148dcd3aad78c1760bfeb6a7b; stderrHash: sha256:1b865a631d7a2d4fc0ad18adc9ecd4d62c080f43661ded013cc3738ec3f27bfe |
| ev:T-0746:abc691b4fded41f382ab13e5 | passed | validation | Validation "Package core and consumer smoke" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts smoke package --execute --from tasks/T-0746-rc2-evidence-reproducibility-and-close-contract/artifacts/installed-lifecycle/hadara-0.5.0-rc.2.tgz --source-root . --evidence-root . --smoke-project-root /tmp/hadara-t0746-package-consumer --json; argvHash: sha256:c7c2bf18b08acca6f6233d5d2150118795e5b791e090593b16e2516d8fe404ed; exitCode: 0; signal: null; durationMs: 1916; stdoutHash: sha256:5d0fa3819bbe093de45ec9f874b37f0fd0fc428765e9717c5d43b6670816cd6b; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0746:ee9c789b06bb4faf8a7a3bf2 | passed | validation | Validation "Handoff phase contract" passed; failureClass: none; command: npm test -- --run tests/unit/task-selection.test.ts tests/unit/task-selection-continuation.test.ts tests/unit/task-close-source.test.ts tests/unit/task-capsule.test.ts tests/unit/mcp-tools.test.ts; argvHash: sha256:0df863fffd329b8520abd0df623d656530b6fe4de89961e868f3d8f1b7c82181; exitCode: 0; signal: null; durationMs: 2546; stdoutHash: sha256:26bc51797b46535f3a1b964905472cc0d1f9d07e29d80932f516d296f797b0cd; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
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
| ev:T-0746:1ffa0aea7d5f4815837d270a | failed | Validation "Full npm run check" failed; failureClass: assertion; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 1; signal: null; durationMs: 31708; stdoutHash: sha256:ac077020bc84eb7b8ec2dfe39adab6b2639c004721bb7fcc1d02eee26ad7ae82; stderrHash: sha256:4d07335bc9aea30b25d16af9dec59bf7d25b722e96403ea4fb0564694efb638b | Resolved | ev:T-0746:3e67d4a475db4724a6f022c0 |
<!-- /hadara:slot -->
