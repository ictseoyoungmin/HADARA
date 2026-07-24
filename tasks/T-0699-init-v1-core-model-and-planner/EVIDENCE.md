# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0699:b09d3c290b564921891ae5cf | passed | validation | AJV CLI v5 compiled hadara.project.v1, hadara.documents.v1, hadara.init.plan.v1, and hadara.init.report.v1 successfully under Draft 2020-12 with the repository x-hadara extension allowed. |
| ev:T-0699:e91afd1964a64f89817de83c | passed | validation | Clean Docker ext4 npm run check passed build, tools typecheck, 139 public files / 1080 tests, and 16 HADARA-dev files / 127 tests. |
| ev:T-0699:05a40e5c71724071badc21bf | passed | validation | Refreshed dist built CLI produced identical standard greenfield plan hashes, applied=0, zero target-root writes, CLI_UNKNOWN_OPTION with --execute suggestion, and INIT_PRESET_UNKNOWN. |
| ev:T-0699:1bf1fbc7c4b44366a4e63818 | passed | validation | Init v1 model, planner, schema runtime, args, schema fixtures, and legacy init regression passed in Docker: 6 focused files / 41 tests plus legacy init 35/35. |
| ev:T-0699:56198d1528c349c1b2173468 | passed | validation | Init v1 model, planner, schema runtime, args, and schema fixture focused suite passed in Docker: 5 files / 41 tests; legacy init regression separately passed 1 file / 35 tests. |
| ev:T-0699:ff27c69e3ce9457e83f28c4d | passed | validation | Task finalize done-level readiness for T-0699 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:00a3fe3b5a425046ff9eef9745a2b1313957934bed985b440f3314134fc2015d |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0699:f4c4f5bb498249af9232f9d2 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
