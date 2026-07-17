# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0632:f2387de6d2f448869c8ddb97 | passed | validation | Validation "Release-plan structure and source-coverage audit" passed; command: bash -lc set -euo pipefail; test "$(find docs/specs/0.5 -mindepth 2 -maxdepth 2 -path "*/0.5.*/*.md" -type f / wc -l)" -eq 4; test "$(rg "^\\/ 05[0-3]-C[0-9][0-9] " docs/specs/0.5/0.5.*/*.md / wc -l)" -eq 23; test "$(rg -l "^## Capsule budget$" docs/specs/0.5/0.5.*/*.md / wc -l)" -eq 4; test "$(rg -l "^## .*Schema plan" docs/specs/0.5/0.5.*/*.md / wc -l)" -eq 4; test "$(rg -l "^## Validation and acceptance$" docs/specs/0.5/0.5.*/*.md / wc -l)" -eq 4; test -f docs/specs/0.5/README.md --json; exitCode: 0; signal: null; durationMs: 486; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0632:0087cc6d51ac4c87929a15fc | passed | validation | Validation "Markdown links and docs governance checks" passed from direct result; Direct checks passed: all five index/release-plan link targets exist; docs doctor reported health=healthy, currentnessVerdict=clean, zero currentness and semantic drift issues after child-process wrapper failure.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0632:d834cc52783844f5ac70d802 | passed | validation | Validation "Focused docs registry tests" passed; command: npm run test:focused -- tests/unit/docs-registry.test.ts tests/unit/docs-doctor.test.ts; exitCode: 0; signal: null; durationMs: 17728; stdoutHash: sha256:2f575cd9c6c592b7eff7575e14dcb52b8c684e435262740f0f30dca0314128e9; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0632:78986635b6cb4e1883c9556b | passed | validation | Task finalize done-level readiness for T-0632 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:4b5ce0bdc32839f3fa470f0ab19f05ff178d83ad8a08a56b58c1d34ff6a3da78 |
| ev:T-0632:4605bb3d3a4e40d9a5337f24 | passed | validation | Validation "Release-plan structure and source-coverage audit" passed; command: bash -lc set -euo pipefail
test "$(find docs/specs/0.5 -mindepth 2 -maxdepth 2 -path "*/0.5.*/*.md" -type f / wc -l)" -eq 6
test "$(rg "^\/ 05[0-5]-C[0-9][0-9] " docs/specs/0.5/0.5.*/*.md / wc -l)" -eq 32
test "$(rg -l "^## Capsule budget$" docs/specs/0.5/0.5.*/*.md / wc -l)" -eq 6
test "$(rg -l "^## Validation and acceptance$" docs/specs/0.5/0.5.*/*.md / wc -l)" -eq 6
test -f docs/specs/0.5/README.md
test -f docs/specs/0.5/0.5.4/HADARA_0_5_4_Dogfood_and_Hardening_Development_Plan.md
test -f docs/specs/0.5/0.5.5/HADARA_0_5_5_Stabilization_and_Promotion_Development_Plan.md
rg "six release folders" docs/specs/0.5/README.md >/dev/null
rg "0.5.5" docs/specs/0.5/README.md >/dev/null
rg "v1 status contracts remain available" docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md >/dev/null; exitCode: 0; signal: null; durationMs: 626; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0632:53374886476a48e6ab7cc3c1 | passed | validation | Validation "Markdown links and docs governance checks" passed; command: bash -lc set -euo pipefail
for p in \
  docs/specs/0.5/README.md \
  docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md \
  docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md \
  docs/specs/0.5/0.5.2/HADARA_0_5_2_Public_Close_Migration_Development_Plan.md \
  docs/specs/0.5/0.5.3/HADARA_0_5_3_Structured_State_and_Projection_Development_Plan.md \
  docs/specs/0.5/0.5.4/HADARA_0_5_4_Dogfood_and_Hardening_Development_Plan.md \
  docs/specs/0.5/0.5.5/HADARA_0_5_5_Stabilization_and_Promotion_Development_Plan.md; do
  test -f "$p"
done
node dist/cli/main.js docs doctor --scope all --json > /tmp/hadara-t0632-docs-doctor.json
node -e "const fs=require('fs'); const j=JSON.parse(fs.readFileSync('/tmp/hadara-t0632-docs-doctor.json','utf8')); if(!j.ok // j.summary.health !== 'healthy' // j.summary.currentnessVerdict !== 'clean') { console.error(JSON.stringify(j.summary)); process.exit(1); }"; exitCode: 0; signal: null; durationMs: 925; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0632:ce24580d15cc49959191a63b | passed | validation | Task finalize done-level readiness for T-0632 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:985ff931d3bb8fdd4d6fb51a1a25eaa6d25b736e6ab18beda9155018e33ab202; sourceHash=sha256:306e73c584fb225a42e98a22906a8e35da8823ee778f8f2341678b1e6b6f8152 |
| ev:T-0632:5a58d5a2a86248df99f13597 | passed | validation | Task finalize done-level readiness for T-0632 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:bb6cf329ad15ea760b5d005ba152747f73f88a276ddd8b65eb5cb65ead396e4a; sourceHash=sha256:306e73c584fb225a42e98a22906a8e35da8823ee778f8f2341678b1e6b6f8152 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0632:d63a028d0180422e8f7b7cac |
| close evidence | passed | ev:T-0632:0c0ba4a415ac4efeb8e01817 |
| close evidence | passed | ev:T-0632:1c6a0b4d28104066964775ac |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0632:0f74414b253740488ea1943e | failed | Validation "Markdown links and docs governance checks" failed; command: node -e const fs=require('fs');const cp=require('child_process');for(const p of ['docs/specs/0.5/README.md','docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md','docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md','docs/specs/0.5/0.5.2/HADARA_0_5_2_Public_Close_Migration_Development_Plan.md','docs/specs/0.5/0.5.3/HADARA_0_5_3_Structured_State_and_Projection_Development_Plan.md'])if(!fs.existsSync(p))process.exit(1);const r=cp.spawnSync(process.execPath,['dist/cli/main.js','docs','doctor','--json'],{encoding:'utf8'});const j=JSON.parse(r.stdout);if(r.status!==0//!j.ok//j.summary.health!=='healthy'//j.summary.currentnessVerdict!=='clean')process.exit(1); exitCode: 1; signal: null; durationMs: 1128; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:91fa57c0a2bf2b5b493439504c4e7615ac983e51bef3c8231bcbfcc30f5aa9ba | Resolved | ev:T-0632:0087cc6d51ac4c87929a15fc |
<!-- /hadara:slot -->
