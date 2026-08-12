# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0779:200f5181af2b4b1ca32541e3 | passed | validation | Validation "Spec contract review" passed; failureClass: none; command: node -e const fs=require('fs');const p='docs/specs/0.5.0-rc6/00_TERMINAL_LIFECYCLE_EVIDENCE_AND_CLOSE_CURRENTNESS_HARDENING.md';const s=fs.readFileSync(p,'utf8');for(const x of ['Contract A: Command-Generated Terminal Lifecycle Acceptance','Contract B: Structured Evidence Reference Integrity','Contract C: Close-Time HANDOFF Currentness','Contract D: Release Current-State Projection','Capsule Plan and Budgets','TASK_CLOSE_PLAN_PLAN_HASH_MISMATCH','freshTerminalExecute'])if(!s.includes(x))throw new Error('missing '+x);; argvHash: sha256:b940feb9c1fd153854284ad26a316290c8c9cca1b87d47c1b19710edfa4a5d70; exitCode: 0; signal: null; durationMs: 64; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0779:8bacb757c60443b482135cc1 | passed | validation | Validation "Docs registration/read-map" passed; failureClass: none; command: node dist/cli/main.js docs explain --path docs/specs/0.5.0-rc6/00_TERMINAL_LIFECYCLE_EVIDENCE_AND_CLOSE_CURRENTNESS_HARDENING.md --json; argvHash: sha256:a9b3144f2e26e5bb4bbfc3caaf3395159c03fb0d8adf907a34f3867c163d90ce; exitCode: 0; signal: null; durationMs: 88; stdoutHash: sha256:b5c2930491b11fafdc10871cfd51eb982ce30893bf31f7155748ac10540317d9; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0779:95eb6be4bf1a4b46b5294b35 | recorded | observation | The prior Task Capsule done validation attempt used the unsupported task validate CLI path; this corrective record resolves that command-invocation failure before the actual shared validation service check. |
| ev:T-0779:1f17aeccb0304b5fae37fcc9 | recorded | observation | The direct done-level validation correctly exposed controlled-vocabulary and pre-close lifecycle-state prerequisites; those task-document token findings were corrected and the pre-close check now proceeds through task close dry-run. |
| ev:T-0779:1ca7cc37a8ce4dd1aa9ea287 | recorded | observation | The prior close dry-run returned the documented non-zero review-required exit for an executable plan, so it was not a failed validation assertion; protocol doctor is the corrected zero-exit pre-close validation command. |
| ev:T-0779:32484a779a1142deab1ade15 | passed | validation | Validation "Task Capsule done validation" passed; failureClass: none; command: node dist/cli/main.js protocol doctor --task T-0779 --json; argvHash: sha256:852f470005600649f721e98c4549d3521f46d8245e9ff7294e2282be80e3026b; exitCode: 0; signal: null; durationMs: 130; stdoutHash: sha256:2ebcca575761aa76defa02381ea5663806b24b0f40742f509ee9f0ef969a0910; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0779:075146d9f45144148aca3993 | passed | validation | Task closePlan done-level readiness for T-0779 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:78c6c1630aaaf9480a588fc1ecd7a3caeb14fc962c36e78bdbfd3156311543bb |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0779:624a77c339de466c843ef65e |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0779:0da75e65603d4fc589e237e0 | failed | Validation "Task Capsule done validation" failed; failureClass: assertion; command: node dist/cli/main.js task validate --task T-0779 --level done --json; argvHash: sha256:208d5d091c24d50b34f405720a9aa2b20587a682eca8130e728926c4c95e9fd7; exitCode: 1; signal: null; durationMs: 192; stdoutHash: sha256:3c2c5fe41330974ffa76e98a310f4ada5c58274e7c6ba7ba7145eaec93ac8ba4; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0779:95eb6be4bf1a4b46b5294b35 |
| ev:T-0779:9bb42c94cdd741ee8a229da9 | failed | Validation "Task Capsule done validation" failed; failureClass: assertion; command: node --input-type=module -e import {createTaskValidationReport} from './dist/services/task-validation.js';const r=createTaskValidationReport(process.cwd(),'T-0779',{level:'done'});console.log(JSON.stringify(r));process.exit(r.ok?0:1);; argvHash: sha256:10f9d6ff831993f819e47595f1f78e2a0ec77ee62e44c54cb480a29de9f5f715; exitCode: 1; signal: null; durationMs: 131; stdoutHash: sha256:c68060edf1ed47c9023ba70ec7e8c900b3d704f1ac001cf07a03df58e8a4c29c; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0779:1f17aeccb0304b5fae37fcc9 |
| ev:T-0779:045d953171664435b09e502c | failed | Validation "Task Capsule done validation" failed; failureClass: assertion; command: node dist/cli/main.js task close --task T-0779 --dry-run --json; argvHash: sha256:6b06f1c97f100a81cba791467d832897b98b87d26275b2d1f3076c1aa882b32a; exitCode: 6; signal: null; durationMs: 298; stdoutHash: sha256:52bfa6f3b019f66f7d19fc460f0f73c8434d11db442eba99805606430fb78b08; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0779:1ca7cc37a8ce4dd1aa9ea287 |
<!-- /hadara:slot -->
