# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0741 |
| Title | Bind close marker to reviewed plan and validate full surface |
| Status | Done |
| Created | 2026-07-29T23:01 |
| Updated | 2026-08-01T18:44 |

## Last Completed

| Item | Evidence |
|---|---|
| Close marker authority now binds guard/marker task-local pending expected writes to the currently reviewed close plan before mutation; focused close tests passed. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| Validation argv preview marker-reserve boundary is fixed and v1 compatibility wording is documented as additive v2-plus-argv compatibility. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Reviewed close of T-0741 using the current plan hash. | waiting-for-operator | no | T-0742 blockers are resolved; host full check, installed package smoke, and clean-checkout smoke pass. The next operation is the reviewed close transaction for this capsule. | tasks/T-0741-bind-close-marker-to-reviewed-plan-and-validate-full-surface/TASK.md; ev:T-0741:5a4590fece4f41e9aa375056; ev:T-0741:415cb1d782ee4e49a8cc96b3; ev:T-0741:c4ad7bbd70e8424d9b164659 |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical full-check and smoke failures remain in the append-only evidence log. | They no longer block close because current host passes explicitly resolve them. | Preserve the failed records and their `resolves:` projections; do not delete evidence history. |
| Smoke command surface is repo-local dev-surface tooling rather than a primary `hadara smoke` lifecycle command. | Direct public-route attempts are not the current acceptance command. | Use the documented `node --import tsx tools/dev-surfaces.ts smoke ...` commands for package and clean-checkout acceptance. |
