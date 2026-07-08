# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0513:55abd88e46ce40d88a5942fb | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0513:ae53bafd8e564ba597b38975 | passed | validation | Validation "npm registry metadata" passed from direct result; npm view hadara@0.4.1-rc.0 version dist-tags.latest dist-tags.next dist.shasum returned version=0.4.1-rc.0, latest=0.4.0, next=0.4.1-rc.0, shasum=8ced2baaf6bbc6e7d407fb9525cf6080109daa8f.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0513:5ee5be16ef224c38a0baa6ca | passed | validation | Validation "package recycle focused tests" passed from direct result; npx vitest run tests/unit/package-recycle.test.ts --reporter=dot passed 1 file / 5 tests after switching recycle smoke from removed task lifecycle to task status.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0513:e885ae3e849243a2bb065fa9 | passed | validation | Validation "build" passed from direct result; npm run build passed after package recycle helper update.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0513:7a391266ff654f32a823d2b7 | passed | release | Resolved installed-package recycle failures: the first attempt hit npm registry DNS EAI_AGAIN, the second exposed stale package recycle use of removed task lifecycle; after switching the recycle smoke to task status, package recycle passed for hadara@next expected 0.4.1-rc.0. |
| ev:T-0513:43a25a83247d4823aad8475a | passed | validation | Validation "installed package recycle" passed from direct result; node dist/cli/main.js package recycle --execute --package hadara@next --expected-version 0.4.1-rc.0 --task T-0513 --attach-evidence --json passed after helper switched from removed task lifecycle to task status; package observedVersion=0.4.1-rc.0, latest=0.4.0, next=0.4.1-rc.0.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0513:ca2c2e24f62c43ceaa07b5bd | passed | validation | Task finalize done-level readiness for T-0513 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:b3641ae5bef6d464bbad3ca59bb401ab31c4383fe07471adb4bf80c80f909e07 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0513:a8a875d94039496ea4a571e4 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0513:6232d04e369d4b499c676e4e | failed | Installed-package recycle failed with reduced public evidence. | Resolved | ev:T-0513:7a391266ff654f32a823d2b7 |
| ev:T-0513:ae1957bab4bc4da7ad4ffb70 | failed | Installed-package recycle failed with reduced public evidence. | Resolved | ev:T-0513:7a391266ff654f32a823d2b7 |
<!-- /hadara:slot -->
