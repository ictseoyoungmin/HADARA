# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0765 |
| Title | RC3 Release Contract and Current-State Reconciliation |
| Status | Done |
| Created | 2026-08-11 |
| Updated | 2026-08-11T15:39 |
## Last Completed

| Item | Evidence |
|---|---|
| Tracked release readiness now reports npm `next=0.5.0-rc.3`, `latest=0.4.6`, and GitHub `v0.5.0-rc.3` as a public prerelease; npm/GitHub asset targets are independent. | ev:T-0765:27a905b549d348c1803bc0b6 |
| Published npm tarball, checksum reconstruction, and manifest reconstruction all match T-0763 expected hashes; provenance is explicitly byte-identical reconstruction, not retained-original proof. | ev:T-0765:78959c08ee5a43409c1d2ef7 |
| Fresh source/public standard init reproduces eight warning-only protocol issues; the self-scaffold mismatch is classified as an rc.4-before-stable defect. | ev:T-0765:187224ea14f54698b5421bcf |
| Graphify guide portability and registry projection were corrected; full repository check passed after projection refresh. | ev:T-0765:c51b84717b0f43308238c370; ev:T-0765:d40c4b95dfba4cb18f53c8aa; ev:T-0765:81536d4748da4e4ab22b2417 |

## Current Work

The reconciliation is complete. RC3 remains a valid public prerelease, but stable promotion is deferred until a separate rc.4 remediation resolves the Init v1 self-scaffold warnings or records a reviewed explicit disposition.

## Required Close Inputs

| Item | Requirement |
|---|---|
| Release state | `docs/RELEASE_READINESS.md` matches observed npm/GitHub state and preserves T-0763's artifact-retention corrective history. |
| Provenance | Registry recovery distinguishes exact byte-identical reconstruction from unavailable retained-original files. |
| Fresh init | Source/public warning behavior and stable vs rc.4 disposition are recorded in `RECONCILIATION_REPORT.md`. |
| Portability | `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` uses `command -v graphify` or a portable user-home fallback. |
| Evidence | Evidence and validation were recorded through HADARA commands; `evidence.jsonl` was not hand-edited. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run `hadara task close --task T-0765 --dry-run --json`, review the plan, then execute the reviewed close path. | The reconciliation is complete and the remaining release decision is explicit: create an rc.4 remediation capsule before stable promotion. | `TASK.md`, `EVIDENCE.md`, `RECONCILIATION_REPORT.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Post-Close Continuation

| Disposition | Create Task | Reason |
|---|---|---|
| Required before stable | Yes, rc.4 remediation capsule | Fresh standard init warns about its own generated workflow/profile scaffold; stable promotion should wait for the runtime/scaffold contract fix and fresh warning-free verification. |

## Carry Forward Warnings

- The exact original RC3 custom GitHub asset is not to be claimed or uploaded unless tarball/checksum/manifest bytes are independently proven identical; this capsule proved reconstruction from npm, not retention of the operator files.
- Graphify remains reference-only and generated `graphify-out/` remains local ignored state.
