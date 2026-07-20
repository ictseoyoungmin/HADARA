# T-0666 Promote validation baseline and current release to 0.5.0-rc.1 (T-0658 through T-0665)

## Identity

| Field | Value |
|---|---|
| ID | T-0666 |
| Title | Promote validation baseline and current release to 0.5.0-rc.1 (T-0658 through T-0665) |
| Status | Done |
| Created | 2026-07-20T23:12 |
| Updated | 2026-07-20T23:18 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0666 --json`.

## Goal

| Goal | Notes |
|---|---|
| Promote `.hadara/state/current.json`'s `validationBaseline` and `currentRelease` to reflect the current source (T-0658 through T-0665, `0.5.0-rc.1`), since operator review found the trusted baseline still pointed at T-0649/`0.5.0-rc.0` despite eight capsules of subsequent changes each independently validated. | `validationBaseline` is not automatically kept current by `task close`; it must be explicitly promoted, same gap T-0643's dogfood flagged (F-3: "project-state.update ... not discoverable as a public command"). |

## Scope

| Boundary | Items |
|---|---|
| In | Run one final comprehensive build + full-suite validation on current HEAD; update `.hadara/state/current.json`'s `validationBaseline.summary`/`evidence` and `currentRelease` using the existing exported `readProjectCurrentState`/`planProjectCurrentStateWrites`/`applyProjectCurrentStateWrites` functions (no new public command surface — reuses what already exists and keeps `docs/PROJECT_STATE.md`/`docs/AGENT_HANDOFF.md` projections in sync automatically); record the promotion itself as task evidence. |
| Out | Running `hadara release gate --mode strict --json` and full release-readiness recycle (explicitly noted as still outstanding, not performed here); npm/GitHub publish; adding a new public "update validation baseline" CLI command (the discoverability gap is real but out of scope for this promotion itself). |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Run a final build + full-suite validation on current HEAD and record it as task evidence. | Done |
| 2 | Promote `current.json`'s `validationBaseline` and `currentRelease` using existing exported state-write functions, verifying `docs/PROJECT_STATE.md`/`docs/AGENT_HANDOFF.md` projections stay in sync. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `current.json`'s `validationBaseline.summary` describes current (T-0658-T-0665) validation, not T-0649, with real evidence ids in `validationBaseline.evidence`. | Met | ev:T-0666:743b914bc1a341889cda50d2 | .hadara/state/current.json |
| AC-2 | `current.json`'s `currentRelease` is `0.5.0-rc.1`. | Met | ev:T-0666:743b914bc1a341889cda50d2 | .hadara/state/current.json |
| AC-3 | `docs/PROJECT_STATE.md` and `docs/AGENT_HANDOFF.md` managed projections match the new canon (no `STATE_CURRENT_CANON_PROJECTION_DRIFT`). | Met | ev:T-0666:743b914bc1a341889cda50d2 | `hadara protocol doctor --scope all --json` returned no canon/drift issues |
| AC-4 | Strict release gate / full release-readiness recycle explicitly remains flagged as outstanding, not silently implied as done. | Met | ev:T-0666:743b914bc1a341889cda50d2 | docs/RELEASE_READINESS.md, validationBaseline.summary itself |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | ev:T-0666:9c421996f28042b98203fad8 |
| Full test suite | Yes | Passed | ev:T-0666:743b914bc1a341889cda50d2 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Operator review | requirement | active | Flagged the stale T-0649 baseline as a Major issue and asked how it would be resolved. |
| `src/services/project-current-state.ts` | implementation-source | active | Owns `readProjectCurrentState`/`planProjectCurrentStateWrites`/`applyProjectCurrentStateWrites`, reused here rather than hand-editing JSON/Markdown directly. |

## Changes

| Area | Summary |
|---|---|
| `.hadara/state/current.json` | `currentRelease` `0.5.0-rc.0` → `0.5.0-rc.1`; `validationBaseline` promoted from the T-0649 summary to a new summary covering T-0658-T-0665, citing real evidence ids including this capsule's own 166-file/1226-test full-suite run. |
| `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` | Managed projections regenerated in sync via `planProjectCurrentStateWrites`/`applyProjectCurrentStateWrites` (no hand-editing); `hadara protocol doctor --scope all --json` confirmed no drift. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Strict release gate has not been rerun since the T-0649 baseline; this promotion reflects source validation currency, not full release readiness. Rerun release gate/readiness recycle before any actual npm/GitHub publish of `0.5.0-rc.1`. | Open | docs/RELEASE_READINESS.md |
| RF-2 | Follow-up | No public command exists to promote `validationBaseline` (F-3 from T-0643's dogfood, still unaddressed); this capsule reused existing exported functions directly rather than adding new CLI surface. | Open | Future discoverability capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-20 | Draft | Initial task scaffold. |
| 2026-07-20 | Done | Validation baseline and currentRelease promoted to 0.5.0-rc.1; projections verified drift-free; strict release gate/full readiness recycle explicitly left outstanding. |
