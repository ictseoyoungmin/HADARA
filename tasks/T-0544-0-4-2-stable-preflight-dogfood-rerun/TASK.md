# T-0544 0.4.2 stable preflight dogfood rerun

## Identity

| Field | Value |
|---|---|
| ID | T-0544 |
| Title | 0.4.2 stable preflight dogfood rerun |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Re-run the fresh-project dogfood after T-0543 and decide whether the same stable-blocking UX findings recur. | Use the current built `dist` from commit `0828c9fd` against new `/tmp` projects, cover all init profiles, and write a structured report before stable `0.4.2` readiness. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh `/tmp` init for `basic`, `standard`, and `governed`; generated workflow review; first-task `task status --json`; `context pack`; `context slice`; handoff/open-task matching; one governed toy lifecycle through `validation run --direct-result` and `task finalize --execute --auto`; dogfood report. |
| Out | npm/GitHub publish, installed npm stable proof, broad command portfolio cleanup, source code changes unless the dogfood exposes a stable-blocking defect. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define dogfood contract from T-0542/T-0543 findings. | Done |
| 2 | Initialize fresh projects for all three profiles and inspect generated guidance/status. | Done |
| 3 | Exercise context pack/slice and handoff matching in a governed toy project. | Done |
| 4 | Complete a small governed toy task through current lifecycle. | Done |
| 5 | Write `DOGFOOD_REPORT.md`, record evidence, update handoff/state, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `basic`, `standard`, and `governed` fresh init projects start cleanly and their initial `task status --json` recommends first-task creation without stale removed-command guidance. | Done | `ev:T-0544:e44e395885524fb8802c6756` | T-0543 AC-2 |
| AC-2 | Fresh consumer `context pack` no longer reports missing HADARA source-checkout files or release-readiness docs. | Done | `ev:T-0544:e44e395885524fb8802c6756` | T-0543 AC-1 |
| AC-3 | `context slice` EOF clamp remains non-truncated. | Done | `ev:T-0544:e44e395885524fb8802c6756` | T-0543 AC-4 |
| AC-4 | Handoff/open-task matching reuses a similar open task instead of suggesting duplicate task creation. | Done | `ev:T-0544:e44e395885524fb8802c6756` | T-0543 AC-3 |
| AC-5 | A governed toy task can be validated with direct-result evidence and closed with `task finalize --execute --auto`. | Done | `ev:T-0544:e44e395885524fb8802c6756` | Current workflow |
| AC-6 | `DOGFOOD_REPORT.md` records whether each T-0542 finding is fixed, improved, still present, or newly replaced by another issue. | Done | `ev:T-0544:e44e395885524fb8802c6756` | `DOGFOOD_REPORT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docker build and focused profile tests | Yes | Passed | ev:T-0544:a004da2bfd5f48b390477f2c |
| Fresh three-profile dogfood rerun | Yes | Passed | ev:T-0544:e44e395885524fb8802c6756 |
| Workspace diff check | Yes | Passed | ev:T-0544:2e103343b2f647d3b3faef66 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0542-0-4-2-rc0-installed-toy-project-dogfood-across-init-profiles/artifacts/DOGFOOD_REPORT.md` | implementation-source | active | Original RC dogfood findings to retest. |
| `tasks/T-0543-0-4-2-stable-preflight-dogfood-finding-fixes/TASK.md` | implementation-source | active | Fix contract and expected improvements. |
| `docs/HADARA_WORKFLOW.md` | constraint | active | Generated workflow path to follow in the toy project. |
| `AGENTS.md` | constraint | active | Requires HADARA lifecycle and evidence. |

## Changes

| Area | Summary |
|---|---|
| Dogfood | Re-ran fresh `/tmp` dogfood across `basic`, `standard`, and `governed`; exercised init, status, context pack/slice, handoff matching, validation direct-result, and governed auto finalize; wrote `DOGFOOD_REPORT.md`. |
| Context graph | Made `extractAgentHandoff` profile-aware so `basic` and `standard` projects do not receive missing-hand-off state warnings for a document their scaffold intentionally omits. |
| Task selection | Limited recommended required-reading docs to files that exist in the target project profile, avoiding absent `AGENT_HANDOFF.md` and `DEVELOPMENT_SLICES.md` guidance in fresh `basic`/`standard` projects. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | If source-built dogfood passes, repeat installed-package recycle/dogfood after stable `0.4.2` publish. | Open | Stable release line |
| RF-2 | Follow-up | New profile-optional document friction found during this rerun was recorded and fixed in the same capsule. | Closed | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Re-running fresh-project dogfood after T-0543 stable-preflight fixes. |
| 2026-07-09 | Done | Dogfood rerun passed, profile-specific context/status guidance fixes landed, and stable `0.4.2` readiness can proceed to release preparation. |
