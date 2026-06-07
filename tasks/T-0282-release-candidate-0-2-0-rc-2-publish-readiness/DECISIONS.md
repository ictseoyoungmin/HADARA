# Decisions

| Decision | Reason |
|---|---|
| Prepare npm `hadara@0.2.0-rc.2` only. | User requested npm release readiness; Python bridge/PyPI remains a separate published preview surface. |
| Keep publish execution operator-gated. | The manual helper requires npm auth, clean worktree, final dry-runs, and explicit typed confirmation. |
| Use Docker validation/build as baseline. | Host Node dependencies are not reliable in this workspace. |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
