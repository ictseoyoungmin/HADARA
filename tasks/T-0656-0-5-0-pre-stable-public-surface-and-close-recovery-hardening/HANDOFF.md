# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0656 |
| Title | 0.5.0 pre-stable public surface and close recovery hardening |
| Status | Done |
| Created | 2026-07-18T22:39 |
| Updated | 2026-07-18T23:12 |
## Last Completed

| Item | Evidence |
|---|---|
| Public project status v2 now honors `--detail full` and setup/adoption actions outrank task recommendations. | `ev:T-0656:f8e6096276644bacb6df75e6` |
| Selected-task v2 compact mode avoids embedding full workbench and does not infer close-ready without close-grade checks. | `ev:T-0656:f8e6096276644bacb6df75e6` |
| Task-close transaction wrapper now records progress operation state, reuses matching operation state on retry, reclaims stale dead-owner locks, and avoids releasing locks it no longer owns. | `ev:T-0656:f8e6096276644bacb6df75e6` |
| `docs/CLI_JSON_CONTRACT.md` and `docs/PROJECT_STATE.md` were updated to match the current public `task close` and policy-controlled publish contracts. | `ev:T-0656:f8e6096276644bacb6df75e6` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run a fresh 0.5.0 stable readiness/recycle capsule before promoting stable. | Source changed after the previous rc readiness; reviewer explicitly called out that stable evidence must be fresh after T-0656. | `tasks/T-0656-0-5-0-pre-stable-public-surface-and-close-recovery-hardening/TASK.md`, `docs/CLI_JSON_CONTRACT.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `task close` is transaction-style and recovery-capable, not fully crash-safe atomic. | Release notes or docs can overclaim the implementation if wording is loose. | Use “guarded transaction-style close with locks, recovery state, idempotent retry, and proof-last evidence.” |
| Dashboard live read routes remain slow on mounted HADARA-dev workspaces. | Full suite can run for several minutes; route timeout tests now allow more time but performance debt remains. | Track `.hadara/local/feedback/T-0656-dashboard-mounted-route-timeout.md`; avoid expanding dashboard live-route scans before projected/cache-first work. |
| Full stable readiness is stale after this capsule. | 0.5.0 stable should not reuse T-0648/T-0649 evidence as final source proof. | Run release readiness/recycle from current source after T-0656 is committed. |
