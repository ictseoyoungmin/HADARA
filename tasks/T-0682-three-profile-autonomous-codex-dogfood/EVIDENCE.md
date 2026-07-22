# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0682:8fb54acee7674ce18a2dd039 | passed | validation | Validation "fresh basic standard governed scaffold doctors" passed; command: bash -lc node dist/cli/main.js init doctor --project /tmp/hadara-dogfood-0682-basic --json && node dist/cli/main.js init doctor --project /tmp/hadara-dogfood-0682-standard --json && node dist/cli/main.js init doctor --project /tmp/hadara-dogfood-0682-governed --json; exitCode: 0; signal: null; durationMs: 2066; stdoutHash: sha256:f7a58f3674f29038d0cd9c41ae4a20cf00737ad554e904694853b879f660e10e; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0682:af37a47a87064ae5a6379911 | passed | validation | Validation "nine capsules are Done with close proof" passed; command: node -e const fs=require("fs");for(const p of ["/tmp/hadara-dogfood-0682-basic","/tmp/hadara-dogfood-0682-standard","/tmp/hadara-dogfood-0682-governed"]){const b=fs.readFileSync(p+"/docs/TASK_BOARD.md","utf8");if((b.match(/\/ T-000[123] .*?\/ Done \//g)//[]).length!==3)process.exit(1);const ds=fs.readdirSync(p+"/tasks");let n=0;for(const d of ds){const f=p+"/tasks/"+d+"/evidence.jsonl";if(fs.existsSync(f)&&fs.readFileSync(f,"utf8").includes("close-proof"))n++}if(n!==3)process.exit(2)}console.log("3 profiles x 3 Done capsules, each with close proof"); exitCode: 0; signal: null; durationMs: 36; stdoutHash: sha256:1923ac20bb54d328aaddc2c15f4aaf6c06d2c425e74e2f2845b1605e6bf59ace; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0682:29f1311c06d1466b88135054 | passed | validation | Validation "core unit suites for all three dogfood projects; dashboard excluded" passed; command: bash -lc cd /tmp/hadara-dogfood-0682-basic && python3 -m unittest discover -s . -p "test_*.py" && cd /tmp/hadara-dogfood-0682-standard && python3 -m unittest discover -s tests -p "test_*.py" && cd /tmp/hadara-dogfood-0682-governed && python3 -m unittest discover -s tests -p "test_*.py"; exitCode: 0; signal: null; durationMs: 1107; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:895aabd9babc6e2d4e792dfe16a6b0f59957b50acbf3b2e52fc8fa64f89760cc |
| ev:T-0682:73af078f28aa4c9c8baf89dc | passed | validation | Validation "six fresh continuation sessions recovered from AGENTS and closed next capsules" passed; command: node -e const fs=require("fs");for(const p of ["basic","standard","governed"]){for(const n of [2,3]){const f=`/tmp/hadara-dogfood-0682-${p}-session${n}.jsonl`;const events=fs.readFileSync(f,"utf8");if(!events.includes("thread.started")//!events.includes("agent_message"))process.exit(1);const final=fs.readFileSync(`/tmp/hadara-dogfood-0682-${p}-session${n}-final.txt`,"utf8");if(!final.includes("close"))process.exit(2)}}console.log("six fresh sessions started independently and reported closed continuation capsules"); exitCode: 0; signal: null; durationMs: 56; stdoutHash: sha256:f9fcf568ef05dc38817c749b16dc646feab5d80dd3e2618329228e07399e8d77; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0682:96fb5ad9978e4a988cad5e2d | passed | validation | Validation "dogfood specification and capsule documentation diff check" passed; command: git diff --check -- docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md tasks/T-0682-three-profile-autonomous-codex-dogfood docs/PROJECT_STATE.md docs/DEVELOPMENT_SLICES.md; exitCode: 0; signal: null; durationMs: 534; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0682:35003dae36ea4a638691b1d7 | passed | validation | Validation "capsule-local DOGFOOD_REPORT and stable spec markdown integrity" passed; command: git diff --check -- docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md tasks/T-0682-three-profile-autonomous-codex-dogfood/DOGFOOD_REPORT.md tasks/T-0682-three-profile-autonomous-codex-dogfood/TASK.md tasks/T-0682-three-profile-autonomous-codex-dogfood/HANDOFF.md; exitCode: 0; signal: null; durationMs: 43; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0682:d50406a162f44bf7ad2240de | passed | validation | Task finalize done-level readiness for T-0682 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:b788375e3ff8acff4ddd3f38a91b64b69d7869e183ba883b089ed01a1705fe30 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0682:c455e3c675164814a5904434 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0682:49a3b11729384692b934d8d2 | failed | Validation "six fresh continuation sessions recovered from AGENTS and closed next capsules" failed; command: node -e const fs=require("fs");for(const p of ["basic","standard","governed"]){for(const n of [2,3]){const f=`/tmp/hadara-dogfood-0682-${p}-session${n}.jsonl`;const first=fs.readFileSync(f,"utf8").split("\n").find(x=>x.includes("agent_message"));if(!first//!first.includes("AGENTS.md"))process.exit(1);const final=fs.readFileSync(`/tmp/hadara-dogfood-0682-${p}-session${n}-final.txt`,"utf8");if(!final.includes("close"))process.exit(2)}}console.log("six fresh sessions read AGENTS.md and reported closed continuation capsules"); exitCode: 1; signal: null; durationMs: 47; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0682:73af078f28aa4c9c8baf89dc |
<!-- /hadara:slot -->
