# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0338 |
| TaskStatus | Draft |
| Last Updated | 2026-06-17 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0338 created after T-0337 published `hadara@0.3.2-rc.0` to npm. | T-0337 publish evidence |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Verify `hadara@0.3.2-rc.0` from installed package consumer paths. | T-0337 publish is complete; T-0338 must prove package behavior outside source checkout. | `docs/specs/0.3.2/capsules/T-0338_0_3_2_rc0_Post_Publish_Installed_Package_Recycle.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not use source checkout as primary proof. | Source may pass while package install path fails. | Use temp-prefix installed bin and disposable projects. |
