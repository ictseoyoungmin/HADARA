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
| Fixed close-atomicity ordering (Done written last), evidence resolution reuse, validation attempt identity, init nested-project scan fail-open, Task Board column preservation, and Docker dist-sync TOCTOU; re-closed T-0711 which had gone `closed-stale`. | `ev:T-0713:c3a9d0e1f2a34b5c8d6e7f01`, `ev:T-0713:full-check` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Consider a full journal-before-write close transaction (mirroring Init v1 apply) to close the remaining narrow race window between the virtual preflight and the real finish/close-evidence writes. | waiting-for-operator | no | Flagged in RF-1; materially larger scope than this capsule, worth a deliberate decision rather than folding in unprompted. | `.hadara/context/HADARA_CONTEXT.md`; `src/task/task-close-transaction.ts`; `docs/TASK_BOARD.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `scripts/dev-docker-sync-build.sh`'s dist-sync guard assumes host and in-container workspace paths resolve to the same bind-mounted files. | informational | Matches the script's existing tar/cp assumptions elsewhere; revisit if the Docker dev workflow ever stops using a direct bind mount. |
