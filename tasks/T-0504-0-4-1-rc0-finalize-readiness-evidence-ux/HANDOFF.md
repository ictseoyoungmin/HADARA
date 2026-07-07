# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Auto-finalize readiness evidence UX is implemented. | `ev:T-0504:76a66b51ccd3435a8875f5a1`, `ev:T-0504:da758ce735d74a35802f3081` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue to `0.4.1-rc.0` release smoke or the next selected docs-governance/command-surface cleanup. | The routine close loop no longer needs a separate `validation run -- ... harness validate ...` only for readiness proof; `harness validate` remains available for blocker debugging. | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Explicit `--plan-hash` finalize keeps the externally reviewed write plan and does not add auto readiness evidence. | Operators using external review still need to decide which validation evidence they want before carrying a plan hash. | Use `validation run` for real test commands and reserve explicit `--plan-hash` for human/automation review boundaries. |
