# Phase 8.0 - Planning Staging and Registration Reset

## Status

Planned docs-first staging specification.

## Problem

The stable 0.3.0 line is published and recycled, but two follow-up classes are now active:

```text
1. status/close-state drift discovered while closing T-0317
2. stable recycle findings from exact npx behavior and governed docs doctor warnings
```

The temporary Work Item A/F notes are useful but are not yet organized as an implementation line. Completed 0.3.0 implementation specs should not remain the active route for new workers.

## Goal

Stage the Phase 8 / 0.3.1 specs and align current project guidance so future work starts from the new status-governance plan.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Implement runtime status validation. | Phase 8.1 and Phase 8.2. |
| Implement state projection. | Phase 8.4. |
| Fix npx or governed docs warnings. | Phase 8.3. |
| Delete completed 0.3.0 specs. | Historical planning files should remain available when linked. |
| Publish 0.3.1. | Release work requires future readiness and operator approval. |

## Files to Add

Add root Phase 8 specs:

```text
docs/specs/0.3.1/00_HADARA_0_3_1_Phase_8_State_Governance_Program.md
docs/specs/0.3.1/01_Phase_8_0_Planning_Staging_and_Registration_Reset.md
docs/specs/0.3.1/02_Phase_8_1_Status_Token_and_Document_Ownership_Governance.md
docs/specs/0.3.1/03_Phase_8_2_Task_Handoff_Close_State_Governance.md
docs/specs/0.3.1/04_Phase_8_3_Installed_Package_Recycle_Findings_Cleanup.md
docs/specs/0.3.1/05_Phase_8_4_State_Consistency_Projection.md
docs/specs/0.3.1/06_Phase_8_5_State_Verify_and_Advisory_Gates.md
```

Add rc1 implementation specs:

```text
docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md
docs/specs/0.3.1/rc1/01_Status_Token_Policy_and_Document_Ownership.md
docs/specs/0.3.1/rc1/02_Task_Handoff_Current_State_and_CloseState.md
docs/specs/0.3.1/rc1/03_Installed_Package_Findings_Cleanup.md
docs/specs/0.3.1/rc1/04_State_Consistency_Projection_Read_Model.md
docs/specs/0.3.1/rc1/05_State_Verify_Doctor_and_CI_Integration.md
```

## Existing Surface Integration

| Surface | Required Action |
|---|---|
| `docs/IMPLEMENTATION_SOP.md` | Remove active Required Reading rows for completed 0.3.0 implementation specs and register the Phase 8 program plus rc1 plan. |
| `docs/PROJECT_STATE.md` | Add Phase 8 / 0.3.1 as the next planned line. |
| `docs/AGENT_HANDOFF.md` | Set next recommended work to Phase 8.1 or the first rc1 capsule after staging. |
| `docs/DEVELOPMENT_SLICES.md` | Add Phase 8.0 through Phase 8.5 planned rows. |
| `.hadara/docs-registry.json` | Do not hand-edit. Use registry-capable commands when available; otherwise keep SOP Required Reading explicit. |

## Worker Instructions

Use this task title for staging:

```bash
hadara task create "Stage Phase 8 0.3.1 status governance specs" --json
```

Read first:

```text
docs/specs/tmp_dir_hadara_work_items_architecture_specs/shared/00_Shared_Schema_Glossary.md
docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/A_Stable_Recycle_Findings_Cleanup_and_Status_Governance.md
docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/F_State_Consistency_Projection.md
docs/specs/0.3.0/00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md
docs/specs/0.3.0/01_Phase_7_0_Repo_State_Reconciliation_and_Planning_Staging.md
```

Do not implement code in Phase 8.0.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | Phase 8 root and rc1 spec files exist. |
| AC-2 | Completed 0.3.0 implementation specs are no longer active Required Reading rows. |
| AC-3 | Phase 8 program and rc1 plan are registered in Required Reading. |
| AC-4 | Project State, Agent Handoff, and Development Slices route next work to Phase 8. |
| AC-5 | No runtime code or package metadata is changed. |

## Validation

```bash
git diff --check
hadara docs required-reading --json
hadara docs doctor --json
hadara harness validate --task T-0318 --level draft --json
```
