# T-0582 v0.4.4 major CLI dogfood before stable

## Identity

| Field | Value |
|---|---|
| ID | T-0582 |
| Title | v0.4.4 major CLI dogfood before stable |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify major HADARA CLI paths before stable `0.4.4` preparation. | Exercise representative repo read models, fresh init profiles, task lifecycle, validation/evidence, context, docs, and release-readiness diagnostics; fix any release-blocking bug found. |

## Scope

| Boundary | Items |
|---|---|
| In | Built CLI dogfood over major non-mutating repo commands, fresh `/tmp` basic/standard/governed projects, one governed toy task lifecycle, and release-readiness diagnostics. |
| Out | npm/GitHub stable publication, broad command-surface deletion, provider/agent-loop cleanup, or speculative refactors. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define dogfood command matrix and release-blocking criteria. | Done |
| 2 | Run repo-level major read model smoke. | Done |
| 3 | Run fresh-profile init smoke for `basic`, `standard`, and `governed`. | Done |
| 4 | Run a governed toy task lifecycle through validation evidence and finalize. | Done |
| 5 | Record findings, fix any blocker, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Repo-level major read models return valid JSON without release-blocking errors. | Met | `ev:T-0582:ae7325887a9e4a90b0db176e` | `version`, `commands`, `help`, `schema`, `docs doctor`, `status`, `task status`, release diagnostics |
| AC-2 | Fresh `basic`, `standard`, and `governed` init profiles produce usable scaffold and pass initial doctor/status checks. | Met | `ev:T-0582:ae7325887a9e4a90b0db176e` | `/tmp` dogfood projects |
| AC-3 | A fresh governed toy task can record validation evidence and close through `task finalize --execute --auto`. | Met | `ev:T-0582:ae7325887a9e4a90b0db176e` | governed `/tmp` project |
| AC-4 | Any detected bug is either fixed and revalidated or explicitly classified non-blocking before stable. | Met | `ev:T-0582:305a0964bd6c4b6c8071713b` | `DOGFOOD_REPORT.md` |
| AC-5 | Stable `0.4.4` preparation recommendation is updated based on the dogfood result. | Met | `ev:T-0582:305a0964bd6c4b6c8071713b` | `HANDOFF.md`, state docs |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Repo-level major CLI smoke | Yes | Passed | `ev:T-0582:ae7325887a9e4a90b0db176e` |
| Fresh profile init smoke | Yes | Passed | `ev:T-0582:ae7325887a9e4a90b0db176e` |
| Governed toy lifecycle smoke | Yes | Passed | `ev:T-0582:ae7325887a9e4a90b0db176e` |
| State projection regression / Docker full suite | Yes | Passed | `ev:T-0582:305a0964bd6c4b6c8071713b` |
| Docs currentness | Yes | Passed | `ev:T-0582:305a0964bd6c4b6c8071713b` |
| Task finalize | Yes | Passed | `ev:T-0582:b7b500fe7bf94283ad9a636a` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/state/current.json` | reference | active | Current release and next-work canon. |
| `docs/HADARA_WORKFLOW.md` | reference | active | CLI workflow and dogfood expectations. |
| `docs/RELEASE_READINESS.md` | reference | active | Stable-readiness status and release boundaries. |
| `tasks/T-0581-v0-4-4-stable-promotion-decision/TASK.md` | reference | active | Stable-promotion decision baseline. |

## Changes

| Area | Summary |
|---|---|
| Major CLI dogfood | Added `DOGFOOD_REPORT.md` with repo, profile, and governed lifecycle results. |
| State projection | Fixed Development Slices latest-task comparison so legacy roadmap Markdown is not treated as currentness authority unless canonical `.hadara/state/slices.json` exists. |
| Tests / dist | Refreshed `dist` through Docker sync-build after the state projection fix. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | If a release-blocking CLI bug is found, stable preparation pauses until the fix is committed and dogfood reruns. | Closed | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Mounted workspace `release gate --mode strict` remains slow, but passed; ext4 publish clone remains the release path. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Defined major CLI dogfood matrix before stable preparation. |
| 2026-07-13 | Done | Major CLI dogfood completed, one state-projection currentness bug fixed, and stable preparation remains recommended. |
