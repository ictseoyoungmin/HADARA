# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0713 |
| Title | Task Close Atomicity and Evidence Integrity Hardening |
| Status | Done |
| Created | 2026-07-27T23:55 |
| Updated | 2026-07-27T23:57 |

## Last Completed

| Item | Evidence |
|---|---|
| Fixed close-atomicity preflight hardening, evidence resolution reuse, validation attempt identity, init nested-project scan fail-open, Task Board column preservation, and Docker dist-sync TOCTOU; re-closed T-0711 which had gone `closed-stale`. | `ev:T-0713:281f60216d504530a9742fe9`, `ev:T-0713:a95861c52b1d4fd2b72c70ca` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Consider a full journal-before-write close transaction (mirroring Init v1 apply) to close the remaining narrow race window between the virtual preflight and the real finish/close-evidence writes. | waiting-for-operator | no | Flagged in RF-1; materially larger scope than this capsule, worth a deliberate decision rather than folding in unprompted. | `.hadara/context/HADARA_CONTEXT.md`; `src/task/task-close-transaction.ts`; `docs/TASK_BOARD.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `scripts/dev-docker-sync-build.sh`'s dist-sync guard assumes host and in-container workspace paths resolve to the same bind-mounted files. | informational | Matches the script's existing tar/cp assumptions elsewhere; revisit if the Docker dev workflow ever stops using a direct bind mount. |
