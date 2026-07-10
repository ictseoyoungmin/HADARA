# HADARA 0.3.1-rc.1 Status Governance Implementation Plan

## Status

Planned rc1 implementation line.

## Goal

Implement the first Phase 8 slice set: status token governance, task-local handoff close-state clarity, installed-package recycle findings cleanup, read-only state projection, and advisory state verification.

## Capsule Sequence

| Order | Candidate Capsule | Primary Spec | Outcome |
|---:|---|---|---|
| 1 | Status Token Policy and Document Ownership | `rc1/01_Status_Token_Policy_and_Document_Ownership.md` | Current docs and generated guidance define TaskStatus, CloseState, DocStatus, EvidenceOutcome, ownership, and write boundaries. |
| 2 | Task Handoff Current-State and CloseState | `rc1/02_Task_Handoff_Current_State_and_CloseState.md` | New task handoffs persist TaskStatus only; CloseState is derived through read models; validation detects stale pending-close wording, persisted CloseState drift, and plan drift. |
| 3 | Installed-Package Findings Cleanup | `rc1/03_Installed_Package_Findings_Cleanup.md` | T-0317 exact npx and governed docs doctor findings are resolved or downgraded with clear guidance. |
| 4 | State Consistency Projection Read Model | `rc1/04_State_Consistency_Projection_Read_Model.md` | Read-only state projection service/report detects state drift across core artifacts. |
| 5 | State Verify, Doctor, and CI Integration | `rc1/05_State_Verify_Doctor_and_CI_Integration.md` | Projection issues surface through existing read-only/advisory operator paths. |

## Release Boundary

These capsules do not publish.

After they close valid, a separate release-readiness capsule may decide whether to prepare `hadara@0.3.1-rc.1`.

## Required Reading for rc1 Workers

Read first:

```text
docs/specs/0.3.1/00_HADARA_0_3_1_Phase_8_State_Governance_Program.md
docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md
the specific rc1 spec for the capsule
docs/TASK_WORKFLOW_COMMANDS.md
docs/IMPLEMENTATION_SOP.md
```

Read only if needed:

```text
docs/specs/tmp_dir_hadara_work_items_architecture_specs/
docs/specs/0.3.0/
```

The temporary Work Item notes and completed 0.3.0 specs are source history, not default implementation instructions.

## Validation Baseline

For docs-only capsules:

```bash
git diff --check
hadara docs doctor --json
hadara harness validate --task T-XXXX --level done --json
```

For runtime capsules:

```bash
npm run test:focused -- <touched focused tests>
npm run dev:docker-sync-build
git diff --check
hadara task ready --task T-XXXX --level done --json
```

If Docker is unavailable, record the fallback path and residual risk in the capsule.

## Worker Convenience Rules

Each rc1 capsule should avoid mixing:

```text
docs policy + runtime validators + state projection + CI integration
```

in one task.

Prefer one of these shapes:

```text
documentation/policy task
template/scaffold task
task-local validator task
read-only projection task
integration/advisory task
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | rc1 implementation is split into small capsule candidates. |
| AC-2 | Each candidate has a primary spec and validation plan. |
| AC-3 | Runtime implementation is deferred to future capsules, not this staging task. |
| AC-4 | Release readiness/publish is explicitly separate. |
