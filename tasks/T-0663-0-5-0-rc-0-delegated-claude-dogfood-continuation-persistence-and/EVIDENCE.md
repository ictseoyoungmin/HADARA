# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0663:be062fced01e42739aafe693 | passed | validation | Validation "npm run build + npm pack" passed from direct result; npm run build clean; npm pack produced /tmp/hadara-0.5.0-rc.0.tgz (484.2kB, 293 files) including T-0658-T-0662; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0663:1f58adf7d7c0409599ef33b4 | passed | validation | Validation "External project install/init/multi-session dogfood" passed from direct result; Installed candidate under /mnt/f/NowWorking/dev/driftlog via npm install --prefix .hadara-install --no-bin-links; hadara init --profile governed --adopt --execute succeeded; two independently-started Claude subagents completed T-0001/T-0002/T-0003, all closed-valid; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0663:48ea8a8b50f84dd793c26ade | passed | validation | Validation "Independent verification (test suite, CLI smoke, git log)" passed from direct result; Re-ran python3 -m unittest discover in driftlog independently: 21/21 passed; manual CLI smoke of add/log/list/streak/report and unknown-habit exit code 1 all correct; git log shows 3 commits, docs/TASK_BOARD.md shows 3 Done rows; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0663:235f55389deb472c85cdb902 | passed | validation | Task finalize done-level readiness for T-0663 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:ebe02f6bbdd8570ce5faa4cf4ac69b216e7ae656260220e902e8b7232c8ae95c |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0663:e7683839e8a84e1e8c168ac0 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
