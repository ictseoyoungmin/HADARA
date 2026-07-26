# T-0708 Registered Shared Close Projection

## Identity

| Field | Value |
|---|---|
| ID | T-0708 |
| Title | Registered Shared Close Projection |
| Status | Done |
| Created | 2026-07-26T21:16 |
| Updated | 2026-07-26T21:31 |

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
| 2 | Make applicability registry-aware and count planned managed projections as current. | Done |
| 3 | Validate fresh Init and legacy registered cases, close, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh Init v1 close does not create or request absent Project State, Agent Handoff, or Development Slices documents. | Met | `ev:T-0708:9e610f42622e4bf3a3d9cd4e` | Init v1 compact boundary |
| AC-2 | Existing registered Project State/Handoff managed sections are projected automatically and do not require duplicate prose mentions. | Met | `ev:T-0708:c53a8975802c466aaa165e40`, `ev:T-0708:9a59fb2db23e458b8c8e5721` | User instruction |
| AC-3 | Development Slices is applicable only when the task is explicitly linked; focused/full/built validation passes. | Met | `ev:T-0708:c53a8975802c466aaa165e40`, `ev:T-0708:9a59fb2db23e458b8c8e5721` | Ownership boundary |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused shared-projection regressions | Yes | Passed | Focused task finish, close, workflow-doc, and current-state suites passed 4 files/46 tests. | ev:T-0708:c53a8975802c466aaa165e40 |
| Full repository validation | Yes | Passed | npm run check passed 142 public files/1106 tests and 16 HADARA-dev files/129 tests. | ev:T-0708:9a59fb2db23e458b8c8e5721 |
| Built CLI fresh Init close-plan smoke | Yes | Passed | Fresh standard Init built-CLI close dry-run reported zero optional shared-document state entries or advisories. | ev:T-0708:9e610f42622e4bf3a3d9cd4e |
| Diff and evidence hygiene | Yes | Passed | git diff --check and evidence lint passed with zero issues. | ev:T-0708:e8828b7000424068846fab77 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Current user instruction | decision | active | Automate completion projection without adding Init document bloat. |
| `docs/ARCHITECTURE.md` | constraint | active | Preserve managed and user-authored ownership boundaries. |
| `docs/SECURITY_MODEL.md` | constraint | active | Keep close writes bounded and fail closed. |

## Changes

| Area | Summary |
|---|---|
| Finish planning | Shared-document advisories are registry-aware, ignore absent optional documents, and treat planned managed writes as current. |
| Slice applicability | Development Slices participates only when its existing content explicitly links the selected task. |
| Init and docs | Generated and repository workflow guidance now describes bounded automatic projection and preserves human-owned prose. |
| Tests | Added fresh Init, registered legacy projection, generated workflow, and close-routing regressions. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | HADARA-dev low-resource Docker mode remains tools-only next work. | Open | User instruction |

## Close Summary

Close now projects registered existing managed checkpoints without requesting absent optional docs or duplicate prose.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Implemented registry-aware applicability and planned-projection freshness. |
| 2026-07-26 | Done | Focused, full, built CLI, diff, and evidence validation passed. |
