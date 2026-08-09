# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0762:edb59c75f9a641b2b72cc037 | passed | validation | Validation "Focused Init v1 reviewer regression tests" passed; command: npm run test:focused -- tests/unit/init-v1-model.test.ts tests/unit/docs-registry.test.ts tests/unit/init-v1-upgrade.test.ts tests/unit/init.test.ts; exitCode: 0; signal: null; durationMs: 2644; stdoutHash: sha256:65e3cdbfad2357c479310f10dcd2f7fd9e12fad4222d951a29c7cf2633e67ce6; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0762:6c72feeea3fc46eda2f0bd73 | passed | validation | Validation "Full repository validation" passed; command: npm run check; exitCode: 0; signal: null; durationMs: 41385; stdoutHash: sha256:889a493282dea4bf71ec8115253494547022bb093e2dd51d04e6fa9b79fbfff5; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0762:3adfab5a3a4a41f4b390f83f | passed | validation | Validation "RC3 specification boundary alignment" passed; command: node -e const fs=require("node:fs"); const delegated=fs.readFileSync("docs/specs/0.5.0-rc3/01_RC3_Read_Routing_and_Delegated_Lifecycle.md","utf8"); const release=fs.readFileSync("docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md","utf8"); if (!delegated.includes("This is not an end-to-end task lifecycle acceptance") // !delegated.includes("does not invoke `task close`") // delegated.includes("perform the normal task lifecycle")) process.exit(1); if (!release.includes("Strict release gate runs separately after clean-checkout evidence is attached") // release.includes("and strict gate.")) process.exit(2);; exitCode: 0; signal: null; durationMs: 37; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0762:d7a81294672e42b6b5892533 | passed | validation | Validation "RC3 specification boundary alignment" passed; command: node -e const fs=require("node:fs"); const delegated=fs.readFileSync("docs/specs/0.5.0-rc3/01_RC3_Read_Routing_and_Delegated_Lifecycle.md","utf8"); const release=fs.readFileSync("docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md","utf8"); const readiness=fs.readFileSync("docs/RELEASE_READINESS.md","utf8"); if (!delegated.includes("This is not an end-to-end task lifecycle acceptance") // !delegated.includes("does not invoke `task close`") // delegated.includes("perform the normal task lifecycle")) process.exit(1); if (!release.includes("Strict release gate runs separately after clean-checkout evidence is attached") // release.includes("and strict gate.")) process.exit(2); if (!readiness.includes("Run the strict release gate after clean-checkout evidence is attached")) process.exit(3);; exitCode: 0; signal: null; durationMs: 40; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0762:bba4e245fe2743c4b3c0dacd | passed | validation | Validation "Evidence lint and git diff check" passed; command: bash -lc hadara evidence lint --task T-0762 --json >/dev/null && git diff --check; exitCode: 0; signal: null; durationMs: 127; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0762:80930e34ceb746ec8cfc0bd2 | passed | validation | Task finalize done-level readiness for T-0762 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:ffe52cbc2e0be3e54a44e5830cefaf591d03d92b3174c03c968494af9a007e19 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0762:2647f7289fcc4812bf44d5bb |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0762:d02ae4c4c387456e8634b256 | failed | Validation "Focused Init v1 reviewer regression tests" failed; command: npm run test:focused -- tests/unit/init-v1-model.test.ts tests/unit/docs-registry.test.ts tests/unit/init-v1-upgrade.test.ts tests/unit/init.test.ts; exitCode: 1; signal: null; durationMs: 3527; stdoutHash: sha256:cf601a97a74fb92366447f3ddf3f14b6243173706abe7c3cc19ac5b9a441eefb; stderrHash: sha256:9d8dc2fe6a192233398594f5bd7fef869a5629244c9286a37756377454f41558 | Resolved | ev:T-0762:edb59c75f9a641b2b72cc037 |
<!-- /hadara:slot -->
