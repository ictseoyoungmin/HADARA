# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0337 |
| TaskStatus | Done |
| Last Updated | 2026-06-17 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0337 capsule created and scoped for approval-gated npm publish. | `ev:T-0337:67d9ffcaf2b74ee1b2901ae1` |
| README reviewed as appropriate for staged rc0 package-facing release posture; capsule-local release note added. | `RELEASE_NOTE.md` |
| `hadara@0.3.2-rc.0` published to npm with no GitHub Release draft. | `ev:T-0337:26b2d2a2606c40ab81ca31f3` |
| Registry verification passed: `latest=0.3.0`, `next=0.3.2-rc.0`, README and tarball metadata visible. | `ev:T-0337:ba28cd4d16fb4952ab3aefd7` |
| Done-level readiness passed before close. | `ev:T-0337:d23bb3db3fd9407e9b125931` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0338 post-publish installed-package recycle. | Published rc0 is visible on npm; recycle must verify installed consumer paths and Evidence v2 workflows from the package. | `docs/specs/0.3.2/capsules/T-0338_0_3_2_rc0_Post_Publish_Installed_Package_Recycle.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| T-0338 proof must come from installed package paths, not source checkout. | Source checkout can mask packaging regressions. | Use temp-prefix installed bin as primary proof. |
