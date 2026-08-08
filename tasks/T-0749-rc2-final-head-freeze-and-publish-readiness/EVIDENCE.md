# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0749:4566954aa8e44dd686fa277f | passed | validation | Validation "Full npm check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 54478; stdoutHash: sha256:142eca5abce008dde84f96ddcb61b86b3504204d979e9e5844f315575cac120e; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0749:55888462d6254c2bad4509cc | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0749:3e8e20944c0542f488cd6ced | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0749:57a22f77275147c3bdc3def4 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0749:18293ac8813a4cd18b527bd3 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0749:795cd0cbd3de403387961990 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0749:0973493e484e4b1d8374f47f | passed | validation | Validation "Strict release gate" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release gate --mode strict --json; argvHash: sha256:aeea76264717f5615450101edf499fc22e0d7b5a73bd4e4ddf449fd6fb329767; exitCode: 0; signal: null; durationMs: 852; stdoutHash: sha256:65cc6a83e011bae4228d61ecb9b49347d350a2416851e1d736cbf8c7e255b00b; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0749:b1f515044957444d9a6f6bf7 | passed | validation | Validation "Release dry-run" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release dry-run --json; argvHash: sha256:561bc7ac596120bcefdf8d827a631f07973b1b94605afb66af074d64ce61209d; exitCode: 0; signal: null; durationMs: 1017; stdoutHash: sha256:c92082cfaf906424c36e4a1d2b123010dff30f362cbfe40e9899367715994c6c; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0749:779a4494fdce4bd6a2b8dc5a | passed | validation | Validation "Publish dry-run" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release publish --mode dry-run --json; argvHash: sha256:309f2b2be8b314ed12f5aa0223890454e2e2f0f453be2601b4536cde7ab74356; exitCode: 0; signal: null; durationMs: 980; stdoutHash: sha256:3d6df2e6d388727aa99fc3353330d351c0291e5f39c2604347435d5788a77854; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0749:f872d39216cd4f4aaae0afe4 | passed | validation | Validation "Installed lifecycle" passed; failureClass: none; command: node --import tsx tools/dev-surface/installed-lifecycle-smoke.ts --tarball /tmp/hadara-t0749-release-artifact-final/hadara-0.5.0-rc.2.tgz --result tasks/T-0749-rc2-final-head-freeze-and-publish-readiness/artifacts/installed-lifecycle/result.json --json; argvHash: sha256:a144c65f0034aaefc8aca03968ba26dcd19cfb8e4148fc4e9ad01d3287133f04; exitCode: 0; signal: null; durationMs: 3507; stdoutHash: sha256:161bbb4618f616eaa660c1dcee41fcd23e10fba63dd5f279e881a9df5c91f62a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0749:6c87c0b4f32944888388949b | passed | release | Final clean-checkout smoke passed and supersedes the earlier self-referential strict-gate failure. |
| ev:T-0749:061d582213be4e89851ef78e | passed | audit | Reviewed final close dry-run plan; proof-last execute is authorized for the current plan. |
| ev:T-0749:a8104e7c3f15487a93e66ae0 | passed | validation | Task closePlan done-level readiness for T-0749 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:698c232912a705796fedaf77841e223cf5ca0fe3c2d22b36f713fb579391fb38 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0749:0aae5c93ad754bafb4c28889 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0749:3ffd0d29650148c49f774f7a | failed | Clean-checkout smoke failed with reduced public evidence. | Resolved | ev:T-0749:6c87c0b4f32944888388949b |
<!-- /hadara:slot -->
