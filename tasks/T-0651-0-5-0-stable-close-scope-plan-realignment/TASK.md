# T-0651 0.5.0 stable close scope plan realignment

## Identity

| Field | Value |
|---|---|
| ID | T-0651 |
| Title | 0.5.0 stable close scope plan realignment |
| Status | Done |
| Created | 2026-07-18T19:50 |
| Updated | 2026-07-18T19:56 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0651 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Align 0.5.x planning docs with the decision that 0.5.0 stable includes public task close. | `0.5.0-rc.0` remains a status-ingress snapshot, but stable promotion now requires the close transaction, public `task close` migration, and installed/delegated close dogfood. |

## Scope

| Boundary | Items |
|---|---|
| In | Update 0.5 planning index, 0.5.0 plan, folded 0.5.1/0.5.2 design modules, combined agent-loop plan, lifecycle/use-case plan, and dependent post-0.5.0 baseline references. |
| Out | Implementing `task close`, changing package version, publishing, or deleting the retained design module files. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reclassify 0.5.1 task-close and 0.5.2 public-close plans as folded into 0.5.0 stable scope. | Done |
| 2 | Extend the 0.5.0 plan with close transaction, public migration, and stable dogfood capsules. | Done |
| 3 | Update combined rollout, lifecycle/use-case, and post-0.5.0 dependency references. | Done |
| 4 | Validate that stale separate-release close references are removed or explicitly historical. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The 0.5 index clearly states that 0.5.0 stable absorbs close transaction and public close migration. | Done | ev:T-0651:a58e66ed3614418ea48f32e7 | `docs/specs/0.5/README.md` |
| AC-2 | The 0.5.0 plan blocks stable promotion on `task close` implementation, public migration, and installed/delegated dogfood. | Done | ev:T-0651:a58e66ed3614418ea48f32e7 | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` |
| AC-3 | The former 0.5.1 and 0.5.2 plans are retained as design modules, not future-version promises. | Done | ev:T-0651:a58e66ed3614418ea48f32e7 | `docs/specs/0.5/0.5.1/`, `docs/specs/0.5/0.5.2/` |
| AC-4 | Combined rollout and post-0.5.0 baseline references do not imply that stable can ship before public close. | Done | ev:T-0651:a58e66ed3614418ea48f32e7 | `docs/specs/0.5/all/` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Stale close-scope reference search | Yes | Passed | ev:T-0651:a58e66ed3614418ea48f32e7 |
| git diff --check | Yes | Passed | ev:T-0651:38fb8a9885a742bda5fe2bd9 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User scope decision | decision | active | 0.5.0 stable scope now includes close. |
| docs/specs/0.5/README.md | implementation-source | active | 0.5.x plan index. |
| docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md | implementation-source | active | 0.5.0 stable gate owner. |
| docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md | reference | active | Folded transaction design module. |
| docs/specs/0.5/0.5.2/HADARA_0_5_2_Public_Close_Migration_Development_Plan.md | reference | active | Folded public migration design module. |

## Changes

| Area | Summary |
|---|---|
| 0.5 planning | Reframed 0.5.0 stable as status ingress plus task-close transaction and public close migration. |
| 0.5.1/0.5.2 modules | Added status-update banners and changed language from separate future release to folded stable workstream. |
| Combined docs | Updated rollout, working conclusion, lifecycle close gate, and post-0.5.0 baseline references. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Implement C07-C09 as the next 0.5.0 stable-blocking capsules. | Open | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Reclassified close transaction and public close migration into 0.5.0 stable scope. |
| 2026-07-18 | Done | Updated 0.5 planning docs and validated stale close-scope references plus diff whitespace. |
