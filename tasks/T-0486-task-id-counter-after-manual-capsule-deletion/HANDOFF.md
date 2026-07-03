# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `task create` next-id allocation now uses the higher of existing task capsule directory ids and `docs/TASK_BOARD.md` row ids, so missing/deleted capsule directories do not move the counter backward. | `ev:T-0486:c4f5c6009a6a499191748196` |
| `write preflight task create` now uses the same allocator as real task creation and predicts the same id in the missing-capsule scenario. | `ev:T-0486:c4f5c6009a6a499191748196` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open dogfood output UX pass. | This is the next required pre-stable capsule after task id counter cleanup. | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md`, `docs/AGENT_HANDOFF.md`, `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Missing capsule directories are not repaired by this change. | Task Board can still report drift until a repair/remediation capsule updates missing artifacts or rows. | This capsule only prevents new task ids from moving backward; use protocol/state diagnostics for repair decisions. |
| The current allocator remains local and file-based. | It does not become a cross-process durable global sequence service. | Existing mkdir collision retry behavior remains the safety guard for local races. |
