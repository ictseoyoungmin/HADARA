# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0723 |
| Title | Enforce Close Proof Last |
| Status | Done |
| Created | 2026-07-28T18:39 |
| Updated | 2026-07-28T18:46 |

## Last Completed

| Item | Evidence |
|---|---|
| Required-bookkeeping close path now enforces physical proof-last ordering. | ev:T-0723:f4f9e6187cd04a8ead32f7e7 |
| Full check passed after updating the archive-boundary test for current rc2 specs. | ev:T-0723:53025d43248648a08cb0b808 |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Continue rc2 task-close transaction hardening against the remaining fault matrix, especially durable marker persistence counts and installed-package dogfood. | actionable | yes | T-0723 fixed the immediate proof-last ordering violation but did not claim the entire rc2 fault matrix. | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md; docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Broader rc2 acceptance remains larger than this capsule. | Do not treat T-0723 as full close-transaction promotion proof. | Create separate scoped capsules for marker persistence counts, recovery fault injection, and installed-package dogfood if not already covered. |
