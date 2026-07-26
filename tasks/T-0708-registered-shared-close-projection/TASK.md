# T-0708 Registered Shared Close Projection

## Identity

| Field | Value |
|---|---|
| ID | T-0708 |
| Title | Registered Shared Close Projection |
| Status | Draft |
| Targets | project |
| Created | 2026-07-26T21:16 |
| Updated | 2026-07-26T21:16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make task close satisfy applicable shared-state projection without requiring duplicate manual task mentions. | Project/Handoff managed checkpoints are already projected; fresh Init remains compact and optional prose documents are never created. |

## Scope

| Boundary | Items |
|---|---|
| In | Init v1/legacy registry-aware applicability; automatic Project State/Handoff managed projection freshness; Development Slices only when linked to the task; finish/close tests and docs. |
| Out | Generating optional global prose docs, inferring product narrative, changing slice ownership, Docker mode, failure classification, or archive moves. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Characterize current managed projection and duplicate advisory behavior. | Done |
| 2 | Make applicability registry-aware and count planned managed projections as current. | In Progress |
| 3 | Validate fresh Init and legacy registered cases, close, and commit. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh Init v1 close does not create or request absent Project State, Agent Handoff, or Development Slices documents. | Pending | TBD | Init v1 compact boundary |
| AC-2 | Existing registered Project State/Handoff managed sections are projected automatically and do not require duplicate prose mentions. | Pending | TBD | User instruction |
| AC-3 | Development Slices is applicable only when the task is explicitly linked; focused/full/built validation passes. | Pending | TBD | Ownership boundary |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused shared-projection regressions | Yes | Not Run | Pending execution. | TBD |
| Full repository validation | Yes | Not Run | Pending execution. | TBD |
| Built CLI fresh Init close-plan smoke | Yes | Not Run | Pending execution. | TBD |
| Diff and evidence hygiene | Yes | Not Run | Pending execution. | TBD |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Current user instruction | decision | active | Automate completion projection without adding Init document bloat. |
| `docs/ARCHITECTURE.md` | constraint | active | Preserve managed and user-authored ownership boundaries. |
| `docs/SECURITY_MODEL.md` | constraint | active | Keep close writes bounded and fail closed. |

## Changes

| Area | Summary |
|---|---|
| Task Capsule | Froze registered-existing-only projection semantics. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | HADARA-dev low-resource Docker mode remains tools-only next work. | Open | User instruction |

## Close Summary


## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
