# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Common read-only report exposes state consistency summary. | Met | `state verify --json` emits `hadara.stateProjection.v1`; `status --json` exposes compact `stateConsistency`. |
| AC-2 | Advisory CI includes state consistency issues without hidden writes. | Met | `ci gate --mode advisory --task T-0323 --json` returned `ok:true`, `state:consistency` check, and state warnings with `fixHint`; strict rollout remains advisory. |
| AC-3 | Strict behavior is documented and conservative. | Met | `docs/COMMAND_SURFACE.md` states state consistency is advisory in `0.3.1-rc.1` and strict CI does not promote historical state drift to blockers. |
| AC-4 | Issue output is concise and includes code, severity, path, and fixHint. | Met | Built CLI smoke summarized `STATE_TASK_BOARD_ROW_MISSING` and `STATE_LATEST_CLOSE_PROOF_STALE` with paths and fix hints. |
| AC-5 | Evidence is attached and handoff is updated. | Met | `ev:T-0323:6228b5ce5ef34716a09f6ca3`, `ev:T-0323:ff9256e91d3d4c9f808599b0`, `ev:T-0323:47236a4ba7234e7d836ccb47`, `ev:T-0323:a624ebc1d48e419ab7dd6210`; HANDOFF updated. |
