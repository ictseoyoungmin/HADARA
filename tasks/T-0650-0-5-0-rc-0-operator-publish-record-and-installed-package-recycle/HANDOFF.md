# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0650 |
| Title | 0.5.0-rc.0 operator publish record and installed-package recycle |
| Status | Done |
| Created | 2026-07-18T19:39 |
| Updated | 2026-07-18T19:47 |
## Last Completed

| Item | Evidence |
|---|---|
| npm registry metadata verified `hadara@0.5.0-rc.0`, `next=0.5.0-rc.0`, and `latest=0.4.6`. | ev:T-0650:e83a40c81c404d8284e695a1 |
| GitHub Release `v0.5.0-rc.0` verified public prerelease targeting `b4223f7782d813ec7420c104b883ebc48ffb71f9`. | ev:T-0650:8e33a891e3f74f1d8b76c8ae |
| Installed-package recycle passed for `hadara@next` from npm with reduced public evidence. | ev:T-0650:b738ff91e7c64d5db95b4df7 |
| Earlier sandbox/network package recycle failure was resolved by passing recycle evidence. | ev:T-0650:613eeea103b445be8bdfb083 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Finalize this capsule, then use `hadara status --json` to select the next 0.5.x hardening or stable-promotion task. | Publication and installed-package recycle are recorded; no source changes are required in this capsule. | `.hadara/state/current.json`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Tool-host child process or sandboxed network calls can fail while direct/escalated commands pass. | Release evidence may include failed attempts that need exact resolution evidence. | Keep failed records, rerun through the working path, and attach `resolves:<id>` evidence as done in T-0650. |
