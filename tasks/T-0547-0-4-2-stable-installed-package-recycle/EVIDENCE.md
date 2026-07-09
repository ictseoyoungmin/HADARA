# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0547:bb537cb84fd6482192255ecf | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0547:8eb1722fe60f435e991924f9 | passed | validation | package recycle dry-run planned installed-package recycle for hadara@latest expected 0.4.2 without registry/install execution. |
| ev:T-0547:ef3570370ab749aabb92b37d | passed | release | Approved network rerun resolved the sandbox npm registry lookup failure; package recycle passed for hadara@latest expected 0.4.2. |
| ev:T-0547:44a840e0a5df4e0ab2d4c704 | passed | validation | git diff --check passed after T-0547 recycle evidence and release state documentation updates. |
| ev:T-0547:a8ee7035cf704f738bc6c40d | passed | validation | Task finalize done-level readiness for T-0547 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:885b2745eee2d15110dd6015de7e69fe0b7d437151e497a909ae39340578f147 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0547:e867fa76bc084af4b697620f |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0547:61981a0f8eef4ceeb2dadf02 | failed | Installed-package recycle failed with reduced public evidence. | Resolved | ev:T-0547:ef3570370ab749aabb92b37d |
<!-- /hadara:slot -->
