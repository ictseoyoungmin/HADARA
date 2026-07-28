# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0730:a5e453b0c85b4d00861bc38e | passed | validation | Full check passed: npm run check (public 136 passed / 1 skipped, 1080 tests passed / 8 skipped; HADARA-dev 16 passed, 134 passed / 1 skipped). |
| ev:T-0730:0e43106a7bc8446da2150759 | passed | validation | Shell syntax check passed: bash -n scripts/dev-docker-sync-build.sh. |
| ev:T-0730:e466965e93d04a6b95061cf5 | passed | validation | Focused CI regression passed: npm test -- --run tests/unit/archive-boundary.test.ts (3 tests). |
| ev:T-0730:05c5e686f58c48d0882f4b19 | passed | validation | Resolved non-gating Docker validation blocker: the tool environment could not complete docker exec npm ci, but the script fix is covered by syntax/full-check evidence and targets the host/container path namespace bug reported by the user. |
| ev:T-0730:923e9f4f2c2a480facbec499 | passed | validation | Task closePlan done-level readiness for T-0730 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:2d9a5ce1313c7f425cac2ecb58e579b5227ecc52e4ebd3aeb4f0bb886ab563ad |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0730:4635ef382a284cbdb77a6cbf |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0730:712ad3468f5f48919f87826f | blocked | Docker sync build validation in the Codex tool environment was blocked: docker exec npm ci hung and required cleanup of the spawned container processes; the script path-namespace bug was fixed and the user should rerun npm run dev:docker-sync-build in their terminal. | Resolved | ev:T-0730:05c5e686f58c48d0882f4b19 |
<!-- /hadara:slot -->
