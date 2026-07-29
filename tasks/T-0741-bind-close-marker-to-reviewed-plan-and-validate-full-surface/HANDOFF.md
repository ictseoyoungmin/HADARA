# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0741 |
| Title | Bind close marker to reviewed plan and validate full surface |
| Status | In Progress |
| Created | 2026-07-29T23:01 |
| Updated | 2026-07-29T23:13 |

## Last Completed

| Item | Evidence |
|---|---|
| Close marker authority now binds guard/marker task-local pending expected writes to the currently reviewed close plan before mutation; focused close tests passed. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| Validation argv preview marker-reserve boundary is fixed and v1 compatibility wording is documented as additive v2-plus-argv compatibility. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Continue with T-0742 to clear retired-state/current-doc contract drift and smoke command routing before rerunning T-0741 full validation. | actionable | no | `npm run check`, package smoke, and clean-checkout smoke are blocked outside the close-marker/argv changes: stale tests still expect retired `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, and `.hadara/state/current.json` current-state surfaces, and public CLI does not route advertised `hadara smoke ...` commands. | tasks/T-0742-clear-retired-state-contracts-and-smoke-routing-drift/TASK.md; tasks/T-0741-bind-close-marker-to-reviewed-plan-and-validate-full-surface/TASK.md; ev:T-0741:b102de440e5442df9b46c215; ev:T-0741:2e59d414d1544554902b0587; ev:T-0741:b4d64d8c66d646c69cd12ae8; ev:T-0741:fb833b588fda4f7983068292; ev:T-0741:3a2c4244c8e54ff08a69c4b5 |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full `npm run check` currently fails 22 files / 59 tests plus 2 missing-module suites around retired project-current-state/default handoff contracts. | T-0741 cannot close under reviewer AC-4 until the stale contracts are updated or retired. | Next capsule acceptance must include full `npm run check` passing after removing/replacing stale state-doc tests and src references. |
| `node dist/cli/main.js smoke ...` and source `src/cli/main.ts smoke ...` print default help and exit 1 although command registry advertises those surfaces. | Reviewer-requested package/consumer smoke cannot use the public CLI route. | Either add dispatcher routing for the advertised smoke commands or correct registry/docs to point operators to `tools/dev-surfaces.ts`, then rerun package and clean-checkout smoke. |
| Dev-surface package smoke fails on installed doctor, command-surface drift, and generated init workflow checks; clean-checkout smoke fails at `npm run check`. | Release/package validation remains blocked even when using the implementation surface directly. | Fix the retired-state/current-doc contract drift and smoke routing, then rerun package smoke and clean-checkout smoke with HADARA validation evidence. |
