# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0524:27c4be39ca554616b854a12e | passed | validation | Focused status JSON tests, TypeScript build, and built CLI fast/summary/state/full status smokes passed; default status --json omitted stateConsistency/knownProblems/debt scans while explicit variants preserved them. |
| ev:T-0524:5f8e4f4b758b48f38d412705 | passed | validation | Task finalize done-level readiness for T-0524 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:d0ce8de2859e291014206025bf3e360169a650fb9a3e04dce5618b312bed9e8d |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0524:5b0fdb8ab26f4d6f87affae8 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0524:4baa7e47eb454beaa70dfe06 | blocked | Full host Vitest run was attempted and blocked by environment spawn restrictions: 148 files passed, 6 files failed with spawnSync node/bash EPERM and validation wrapper reports changed to Blocked. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
