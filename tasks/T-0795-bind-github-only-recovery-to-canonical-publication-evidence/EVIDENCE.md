# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0795:3b25716af4104ee7b3dcbdcc | passed | validation | Validation "Canonical recovery regression" passed; failureClass: none; command: npm run test:hadara-dev -- --run tests/unit/manual-publish-script.test.ts; argvHash: sha256:997e1298cf0efebadab3b3f16271ed50c030c56802f77fac211ae5447fe9ae32; exitCode: 0; signal: null; durationMs: 14737; stdoutHash: sha256:4fbebb75a51dc62cde52082d667bebb3b66914cad6f964f45fae12e1b0f905fd; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0795:1fb9c2cc375446b9b5a487e7 | passed | validation | Validation "Source hygiene" passed; failureClass: none; command: bash -lc bash -n scripts/release/manual-publish-rc.sh && git diff --check; argvHash: sha256:2c33fb3334ffb84237601f923366d012810f70aa6786b7d32633832312759489; exitCode: 0; signal: null; durationMs: 52; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0795:612bfbb6a8f844bb8ad93434 | passed | validation | Task closePlan done-level readiness for T-0795 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:6bb2e331320c2284578a6f7949e2af49b31549d483937173215ce8737eb4a0ca |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0795:477eb9caceb442acbba0099d |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
