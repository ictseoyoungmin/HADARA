# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0787:74441d442b6e4dc3bc44e4ff | passed | validation | Docker build and tools typecheck passed; destination and publication-order regression passed: 4 files, 25 focused tests, plus manual publish integration 10 tests. |
| ev:T-0787:db551ad1efe741a0b0276582 | passed | release | prepare-publish-env now rewrites and verifies explicit GitHub origin; manual publish uses the same explicit remote for tag push and --repo for gh release create. Fake integration verified destination binding. |
| ev:T-0787:2c6909f0dd664d5e92c090c3 | passed | release | After npm publication and registry verification, npm-only report/evidence is written before GitHub auth. Injected gh auth failure preserved the npm report/evidence; successful draft path produced a separate final report/evidence with distinct idempotency keys. |
| ev:T-0787:b70d6df1549d4966bac89ee1 | passed | validation | Task closePlan done-level readiness for T-0787 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:1918d0ed732892ed1c0d6d683aae470361ac4f572f741bc51b24eaf3183aa756 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0787:c680e671097b47929c85ab8e |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
