# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0738:a2b68c4e27964adc8afccc6b | passed | validation | Validation "Focused docs registry tests" passed; failureClass: none; command: npx vitest run tests/unit/docs-registry.test.ts; exitCode: 0; signal: null; durationMs: 2240; stdoutHash: sha256:eb5a863511cc8298063c111cec02ad1ca5e4282d9e6dd2babf60cee678e85bb7; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0738:034d842cd14346e3a115544d | passed | validation | Validation "Registry parse schema render" passed; failureClass: none; command: node -e const fs=require("fs"); const {spawnSync}=require("child_process"); const registry=JSON.parse(fs.readFileSync(".hadara/docs-registry.json","utf8")); const removed=[".hadara/state/current.json","docs/AGENT_HANDOFF.md","docs/PROJECT_STATE.md"]; const present=registry.documents.filter(d=>removed.includes(d.path)).map(d=>d.path); if (present.length) throw new Error("removed registry paths still present: "+present.join(",")); const doctor=spawnSync(process.execPath,["--import","tsx","src/cli/main.ts","docs","doctor","--scope","registry","--json"],{encoding:"utf8"}); if (doctor.status!==0) throw new Error("docs doctor failed: "+doctor.stdout+doctor.stderr); const doctorJson=JSON.parse(doctor.stdout); if (!doctorJson.ok) throw new Error("docs doctor not ok"); const render=spawnSync(process.execPath,["--import","tsx","src/cli/main.ts","docs","render","--json"],{encoding:"utf8"}); if (render.status!==0) throw new Error("docs render failed: "+render.stdout+render.stderr); const renderJson=JSON.parse(render.stdout); if (renderJson.action!=="already-current") throw new Error("docs render drift: "+render.stdout); const projection=fs.readFileSync("docs/DOC_REGISTRY.md","utf8"); for (const removedPath of removed) if (projection.includes("`"+removedPath+"`")) throw new Error("removed projection path still present: "+removedPath); console.log("registry parse, doctor, render, and removed path checks passed");; exitCode: 0; signal: null; durationMs: 665; stdoutHash: sha256:f64551ef57334f02f25f343ac3a810570e2915161339c0ba9df65af6df1edc7d; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0738:47d8b0d6199c49b6b1de1123 | passed | validation | Validation "TypeScript no-emit" passed; failureClass: none; command: npx tsc --noEmit; exitCode: 0; signal: null; durationMs: 5194; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0738:898bee889e324be0b3e41d7c | passed | validation | Validation "Focused hotfix regression tests" passed; failureClass: none; command: npx vitest run tests/unit/docs-registry.test.ts tests/unit/task-close.test.ts tests/unit/validation-run.test.ts tests/unit/ta[REDACTED].test.ts --reporter=dot; exitCode: 0; signal: null; durationMs: 7290; stdoutHash: sha256:cbce342432b425ccb2db040a809814ee77275237cd9e0451b7271ed50f6123bc; stderrHash: sha256:1b865a631d7a2d4fc0ad18adc9ecd4d62c080f43661ded013cc3738ec3f27bfe |
| ev:T-0738:7ceb0258ca3741a787d97658 | passed | validation | Task closePlan done-level readiness for T-0738 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:32546f36a4080d70adf4aac574ad7a264c7240874e97d175db25d881b33eb413 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0738:6a354a65252f46c7aeab9498 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0738:f18adb6e34214e43ac2f0f65 | failed | Validation "Registry parse schema render" failed; failureClass: assertion; command: node -e const fs=require('fs'); const {spawnSync}=require('child_process'); const registry=JSON.parse(fs.readFileSync('.hadara/docs-registry.json','utf8')); const removed=['.hadara/state/current.json','docs/AGENT_HANDOFF.md','docs/PROJECT_STATE.md']; const present=registry.documents.filter(d=>removed.includes(d.path)).map(d=>d.path); if (present.length) throw new Error('removed registry paths still present: '+present.join(',')); const doctor=spawnSync(process.execPath,['--import','tsx','src/cli/main.ts','docs','doctor','--scope','registry','--json'],{encoding:'utf8'}); if (doctor.status!==0) throw new Error('docs doctor failed: '+doctor.stdout+doctor.stderr); const doctorJson=JSON.parse(doctor.stdout); if (!doctorJson.ok) throw new Error('docs doctor not ok'); const render=spawnSync(process.execPath,['--import','tsx','src/cli/main.ts','docs','render','--json'],{encoding:'utf8'}); if (render.status!==0) throw new Error('docs render failed: '+render.stdout+render.stderr); const renderJson=JSON.parse(render.stdout); if (renderJson.action!=='already-current') throw new Error('docs render drift: '+render.stdout); const projection=fs.readFileSync('docs/DOC_REGISTRY.md','utf8'); for (const removedPath of removed) if (projection.includes('')) throw new Error('removed projection path still present: '+removedPath); console.log('registry parse, doctor, render, and removed path checks passed');; exitCode: 1; signal: null; durationMs: 681; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:1cf8cf50275425e74c4da1e1c369ab8262a8ed8622a7f2021c81848a3b3b4963 | Resolved | ev:T-0738:034d842cd14346e3a115544d |
<!-- /hadara:slot -->
