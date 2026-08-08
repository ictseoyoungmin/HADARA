# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0755:93462dbab13e4618bbcacff8 | passed | validation | Validation "Focused legacy status surface regression" passed; failureClass: none; command: npx vitest run tests/unit/context-routing-e2e-smoke-script.test.ts tests/unit/schema-fixtures.test.ts tests/unit/task-workbench.test.ts tests/unit/status-json.test.ts tests/unit/command-registry.test.ts tests/unit/package-recycle.test.ts; argvHash: sha256:71a57fd4f3c265ae43e82d66454ec6660bd8c358d416a6ec09f0283258ec029a; exitCode: 0; signal: null; durationMs: 2601; stdoutHash: sha256:ef456e1e53ba5731c1f06dd5fbe11e59950103f22ec94aa42c2b83f1cf3fa467; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0755:8456660f5da74eaeabc6e73f | passed | validation | Validation "Full repository check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 33731; stdoutHash: sha256:c72a5c511d0dc2ad78fb252c389b8761dd56b490fa824757e5b58d855d8901d6; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0755:a3d116ae6935490e874eba5e | passed | validation | Validation "Current status command surface" passed; failureClass: none; command: node dist/cli/main.js task status --json; argvHash: sha256:3fc2560876012a3b089d70e146e47c13415a838954d8d8431f5e91ffc40d3cbe; exitCode: 0; signal: null; durationMs: 148; stdoutHash: sha256:d33b539b13d668c9da141015911f6f60791135d2590ba7ecc7ddc4c8f6af0de0; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0755:bc52e1468ae848dd9827896b | passed | validation | Validation "Current status command surface" passed; failureClass: none; command: node dist/cli/main.js task status --json; argvHash: sha256:3fc2560876012a3b089d70e146e47c13415a838954d8d8431f5e91ffc40d3cbe; exitCode: 0; signal: null; durationMs: 147; stdoutHash: sha256:c0a167d7bf7f296afdfa8d50f785ce6a9745208a5efb40565a91de251ac6f621; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0755:2d31f99cd8a74068ba93011d | passed | validation | Task closePlan done-level readiness for T-0755 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:ab90441f0fb4de0acc028cc5ab00113784221d1e8348dddfd7c4d0dfc0051939 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0755:b7aa1e9b2ba2434293e140f4 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0755:52de54d73c34409caa0fed9b | failed | Validation "Current status command surface" failed; failureClass: assertion; command: node -e const {spawnSync}=require('node:child_process'); const status=spawnSync(process.execPath,['dist/cli/main.js','status','--json'],{encoding:'utf8'}); if(status.status===0) process.exit(1); const task=spawnSync(process.execPath,['dist/cli/main.js','task','status','--json'],{encoding:'utf8'}); if(task.status!==0) process.exit(2); const report=JSON.parse(task.stdout); if(report.compatibility // report.schemaVersion==='hadara.project.status.v2') process.exit(3);; argvHash: sha256:d31d1529d78a55b1861efe6c123a80420ab78a9a4eebd351868545f35fdb28e7; exitCode: 1; signal: null; durationMs: 249; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e8887f3268f17ebf215d6efff5053a055092dd3ab07ab9fef0107f4954362f19 | Resolved | ev:T-0755:bc52e1468ae848dd9827896b |
<!-- /hadara:slot -->
