# T-0581 v0.4.4 stable promotion decision

## Identity

| Field | Value |
|---|---|
| ID | T-0581 |
| Title | v0.4.4 stable promotion decision |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Decide whether `v0.4.4-rc.0` is stable-promotion ready. | This capsule verifies RC publication health and installed-package behavior; it does not publish `0.4.4`. |

## Scope

| Boundary | Items |
|---|---|
| In | Re-check npm/GitHub RC publication state, run installed-package recycle from `hadara@next`, verify current repo documentation/readiness status, and record the stable-promotion recommendation. |
| Out | Publishing stable `0.4.4`, changing source code, deleting dead code, or broad refactoring. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define stable-promotion readiness criteria. | Done |
| 2 | Verify RC registry and GitHub release state. | Done |
| 3 | Run installed-package recycle from `hadara@next`. | Done |
| 4 | Verify repo docs/readiness state remains clean after RC publication. | Done |
| 5 | Record recommendation and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry still resolves `hadara@0.4.4-rc.0` and `next=0.4.4-rc.0` while `latest=0.4.3`. | Met | `ev:T-0581:c12cc972684444f2b9023b91` | `npm view hadara@0.4.4-rc.0 version dist-tags --json` |
| AC-2 | GitHub Release `v0.4.4-rc.0` remains public prerelease. | Met | `ev:T-0581:db4d2427123447558a5b5a8f` | `gh release view v0.4.4-rc.0` |
| AC-3 | Installed-package recycle from `hadara@next` expected `0.4.4-rc.0` passes. | Met | `ev:T-0581:2fa7e82f776f4d3082838e71` | `package recycle --execute` |
| AC-4 | Current repo docs/readiness checks are clean enough for stable preparation. | Met | `ev:T-0581:19f58deba6a2488fac943120` | `docs doctor`, `task status` |
| AC-5 | Stable recommendation is recorded without claiming stable publication. | Met | `ev:T-0581:2fa7e82f776f4d3082838e71` | `TASK.md`, `HANDOFF.md`, state docs |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm RC registry verification | Yes | Passed | `ev:T-0581:c12cc972684444f2b9023b91` |
| GitHub RC release verification | Yes | Passed | `ev:T-0581:db4d2427123447558a5b5a8f` |
| Installed-package recycle | Yes | Passed | `ev:T-0581:2fa7e82f776f4d3082838e71` |
| Docs currentness | Yes | Passed | `ev:T-0581:19f58deba6a2488fac943120` |
| Task readiness/finalize | Yes | Passed | `ev:T-0581:514bdc712de34ed69be28ac2` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/state/current.json` | reference | active | Current release and next-work canon. |
| `tasks/T-0580-v0-4-4-rc-0-operator-publish-and-installed-package-recycle/TASK.md` | reference | active | RC publication and installed-package recycle evidence. |
| `tasks/T-0579-v0-4-4-rc-0-release-readiness-and-publish-preparation/TASK.md` | reference | active | Source readiness baseline for the RC. |
| `docs/RELEASE_READINESS.md` | reference | active | Release status and validation baseline. |
| `docs/RELEASE_NOTES.md` | reference | active | Public release-note status. |

## Changes

| Area | Summary |
|---|---|
| Release readiness | Verified `0.4.4-rc.0` remains stable-promotion ready: npm `next` points to the RC, GitHub Release is public prerelease, installed recycle passes, and docs doctor is clean. |
| Recommendation | Proceed to a separate stable `0.4.4` release-preparation capsule; do not mutate npm/GitHub from this capsule. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Stable publication remains a separate operator-controlled capsule. | Open | `docs/RELEASE_READINESS.md` |
| RF-2 | Follow-up | `task status --detail full` took 13.3s on the mounted WSL workspace, matching the known context/status latency class. | Open | `.hadara/local/feedback/T-0581-status-detail-full-slow.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Defined RC stability verification and stable-promotion decision scope. |
| 2026-07-13 | Done | Verified RC registry/GitHub state, installed-package recycle, docs currentness, and recorded stable-preparation recommendation. |
