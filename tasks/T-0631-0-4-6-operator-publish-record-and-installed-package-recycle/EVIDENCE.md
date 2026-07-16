# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0631:c31dd280f6af48d6b8918b02 | passed | release | Operator published hadara@0.4.6 to npm and GitHub Release v0.4.6 publicly; local registry verification observed hadara@0.4.6 version 0.4.6 with dist-tags latest=0.4.6 and next=0.4.6-rc.1. |
| ev:T-0631:511bb997c92146bf8ffaf02e | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0631:598918ef009146cc95d3a0f0 | passed | observation | Resolved initial installed-package recycle failure: sandboxed npm metadata subprocesses timed out, but the approved rerun completed registry lookup, isolated install, installed CLI version, command surface, lifecycle help, init, task status, session start, finalize dry-run, context pack, and context slice successfully for hadara@latest 0.4.6. |
| ev:T-0631:77c0791a98714002971c7bc4 | passed | validation | Task finalize done-level readiness for T-0631 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:51ad291aa4033760d53c6a6871d3894e7dfc0975ec604a6f9a83efa35324e719 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0631:19cb3a753942491c8fe03f40 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0631:b52cc9306f00410390727103 | failed | Installed-package recycle failed with reduced public evidence. | Resolved | ev:T-0631:598918ef009146cc95d3a0f0 |
<!-- /hadara:slot -->
