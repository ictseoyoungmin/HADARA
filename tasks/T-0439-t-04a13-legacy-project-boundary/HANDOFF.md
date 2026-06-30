# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Applied bounded reviewer feedback before full T-04A13 mutation-boundary work. | `ev:T-0439:b7d2205ef1744eb5b87ec87c`, `ev:T-0439:86ff7918e98f424eac9686c7`, `ev:T-0439:62d3893695344992b22ca881` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement full T-04A13 legacy project mutation blocking. | This capsule hardened docs registry/read-map/finalization guidance, but did not implement `.hadara/scaffold.json` legacy detection or mutation-command fail-closed behavior. | `docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md`, `docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `docs register` metadata edit-in-place is still not implemented. | New registrations persist v2 metadata, but existing entries still return `already-registered` without applying metadata updates. | Add a later docs registry hardening capsule if update-in-place is required. |
| Full T-04A13 legacy mutation boundary remains open. | 0.4 mutation commands are not yet blocked on legacy scaffold detection. | Make this the next capsule and cover init/task/evidence/docs mutation command families. |
