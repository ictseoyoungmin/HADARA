# T-0625 Dogfood Report

## Summary

Verdict: do not promote `0.4.6-rc.1` to stable yet.

The current source package installed and initialized successfully in a fresh external project, but delegated Codex could not close the first HADARA task capsule without hand-editing lifecycle-owned status fields. The Quant Battle Arena MVP work did not start because the baseline capsule was blocked.

## Setup

| Item | Value |
|---|---|
| External project | `/mnt/f/NowWorking/dev/hadara-046rc1-current-codex-dogfood` |
| Package source | `/tmp/hadara-0.4.6-rc.1.tgz` packed from current source |
| Installed entrypoint | `.hadara-install/node_modules/hadara/dist/cli/main.js` |
| Package version | `0.4.6-rc.1` |
| Source commit included | `93d28cff` |
| Init profile | `governed` |
| Delegated agent | Codex CLI, project-local prompt |

## What Worked

| Area | Result |
|---|---|
| Package install | Installed from the current source tarball with `--no-bin-links`. |
| Init adoption | `init --profile governed --adopt --execute --plan-hash ...` completed and `init doctor` reported no issues. |
| Task selection | `task status --json` selected the adoption-baseline task. |
| Context commands | `session start`, `context pack`, and `context slice` were usable from generated docs. |
| Evidence | `validation run --update-task` recorded `ev:T-0001:07522e2900724d2fb9e0fc87`. |
| Generated fallback docs | The no-bin-links direct entrypoint guidance was visible and the delegated prompt could use it. |

## Blocker

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| B-1 | Stable blocker | A normal delegated agent could not close the first task capsule. `task finalize --execute --auto --json` wrote/encouraged task-local Done state, but the Task Board stayed `Draft`; subsequent dry-runs blocked on `HARNESS_TASK_BOARD_STATUS_NOT_DONE`. The docs also tell agents not to hand-edit lifecycle-owned status, so the delegated agent stopped. | External `DOGFOOD_NOTES.md`; reproduced `task finalize --task T-0001 --json` exit 6. |

The relevant finalizer state included:

| Field | Observed |
|---|---|
| `ok` | `false` |
| `state` | `blocked` |
| `partialExecutionRisk` | `true` |
| blocker | `HARNESS_TASK_BOARD_STATUS_NOT_DONE` |
| blocker | `HARNESS_TASK_SCAFFOLD_PLACEHOLDER` for a validation row containing `Not Run` / `TBD` |
| delegated decision | stopped rather than hand-editing `docs/TASK_BOARD.md` |

## UX Notes

| ID | Severity | Finding |
|---|---|---|
| U-1 | High | The generated lifecycle note says not to hand-edit `TASK.md` Identity Status or `docs/TASK_BOARD.md` Status, but the finalizer fix hint says to update the Task Board status cell when repairing partial finalize. This is ambiguous for first-time agents. |
| U-2 | High | `task finalize --json` can recommend `--execute --auto` while warning about deferred checks and partial execution risk. A normal agent interpreted that as the canonical path, but the path left it blocked. |
| U-3 | Medium | Installing HADARA inside the project under `.hadara-install` before init makes init treat the repository as brownfield. This is manageable, but first-user docs should either recommend init first or explain the adoption dry-run when using an in-project install prefix. |
| U-4 | Medium | Done-level placeholder detection treats a validation row for the finalizer itself (`Not Run` / `TBD`) as scaffold-like. Agents may naturally include the final close command as a planned validation row before it has evidence. |

## Stable Readiness

| Gate | Result |
|---|---|
| Current package installs | Passed |
| Fresh governed init | Passed after explicit brownfield adoption execute |
| Delegated agent can close baseline capsule | Failed |
| Delegated agent can start MVP task capsules | Not reached |
| Stable promotion | Blocked |

## Recommended Fix Before Stable

Fix the first-capsule close path before stable:

- `task finalize --execute --auto` should not leave normal users in a state that requires direct lifecycle-owned status edits.
- The dry-run recommendation should be stricter when `partialExecutionRisk=true`: either block execution until ready/close blockers are resolvable, or make the partial-write repair path machine-owned and unambiguous.
- Finalizer validation should not classify a deliberate pre-close validation row (`Result=Not Run`, `Evidence=TBD`) as a generic scaffold placeholder unless the row is actually scaffold residue.
- Generated docs and fix hints should agree on whether lifecycle-owned status can ever be repaired manually.

After the fix, rerun this same delegated Codex dogfood from a clean external project and require the delegated agent to close the baseline capsule and at least one MVP feature capsule.
