# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Added TASK.md token aliases: `Acceptance State=Done` and `Inputs / Constraints State=active`. | ev:T-0508:145f99b5933d4f1cab7f022c |
| Updated default and template task scaffolds to use `active` for input constraints. | ev:T-0508:145f99b5933d4f1cab7f022c |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue `0.4.1-rc.0` release smoke/readiness. | T-0508 is a narrow UX alias cleanup; no additional release blockers introduced. | docs/HADARA_WORKFLOW.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full canonical/alias metadata is still future scope. | If more aliases are added later, a flat allowed-token list may become harder to explain. | Keep `Met` as canonical in examples where proof precision matters; consider explicit alias metadata in 0.5 state-first schema work. |
