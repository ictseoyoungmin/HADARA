# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| npm registry still resolves `hadara@0.4.4-rc.0`; dist-tags are `latest=0.4.3` and `next=0.4.4-rc.0`. | `ev:T-0581:c12cc972684444f2b9023b91` |
| GitHub Release `v0.4.4-rc.0` is public prerelease. | `ev:T-0581:db4d2427123447558a5b5a8f` |
| Installed-package recycle from `hadara@next` expected `0.4.4-rc.0` passed from consumer paths. | `ev:T-0581:2fa7e82f776f4d3082838e71` |
| Docs currentness remains clean. | `ev:T-0581:19f58deba6a2488fac943120` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Prepare stable `0.4.4` source/release capsule. | T-0581 found no release-blocking RC stability issue; actual npm/GitHub mutation must remain a separate operator-controlled step. | `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, `tasks/T-0581-v0-4-4-stable-promotion-decision/TASK.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not treat this capsule as stable publication. | `latest` remains `0.4.3`; no stable npm/GitHub mutation was executed here. | Create a dedicated stable preparation/publish capsule. |
| `task status --detail full` was slow on the mounted WSL workspace. | Interactive agent loop can stall before finalize. | Prefer bounded status paths and use direct validation evidence when tool-host spawn friction appears. |
