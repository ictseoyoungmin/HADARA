# T-0752 Refresh Dist and Init v1 Repository Guidance

## Identity

| Field | Value |
|---|---|
| ID | T-0752 |
| Title | Refresh Dist and Init v1 Repository Guidance |
| Status | Done |
| Created | 2026-08-08T16:12 |
| Updated | 2026-08-08T16:17 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Refresh the local built `dist` and align repository guidance with the current Init v1 generated-document contract. | Current Init v1 uses `.hadara/context/READ_MAP.md`; the retired `HADARA_CONTEXT.md` projection is removed. |

## Scope

| Boundary | Items |
|---|---|
| In | Build refresh, AGENTS/workflow routing updates, READ_MAP migration, and init fixture verification. |
| Out | Init adoption of the legacy project store, unrelated documentation rewrites, and product/runtime changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Refresh dist and repository Init v1 guidance. | Done |
| 3 | Validate and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `dist` is rebuilt from current source and reports the current package version. | Met | `ev:T-0752:b07acdfa107040658d1d13f2` | `npm run build`, version `0.5.0-rc.2` |
| AC-2 | AGENTS/workflow/read-map guidance matches current Init v1 routing and no active document points to retired `HADARA_CONTEXT.md`. | Met | `ev:T-0752:df33fdbff0e740038afef91f` | Active guidance uses `READ_MAP.md` and `--preset`. |
| AC-3 | Fresh governed init fixture generates the current Init v1 document set and passes doctor. | Met | `ev:T-0752:b8c58b836c174580a6752615` | Disposable governed fixture: apply, READ_MAP, no HADARA_CONTEXT, doctor `ok: true`. |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Build and version | Yes | Passed | Rebuilt current dist and verified package version `0.5.0-rc.2`. | `ev:T-0752:b07acdfa107040658d1d13f2` |
| Guidance routing check | Yes | Passed | Active guidance uses READ_MAP/current preset syntax and has no retired context file. | `ev:T-0752:df33fdbff0e740038afef91f` |
| Fresh init fixture | Yes | Passed | Governed Init v1 plan/apply generated READ_MAP and doctor returned `ok: true`. | `ev:T-0752:b8c58b836c174580a6752615` |
| Init v1 repository guidance | Yes | Passed | exit 0 in 125ms | ev:T-0752:df33fdbff0e740038afef91f |
| Dist build and version | Yes | Passed | exit 0 in 7628ms | ev:T-0752:b07acdfa107040658d1d13f2 |
| Fresh Init v1 governed fixture | Yes | Passed | exit 0 in 354ms | ev:T-0752:b8c58b836c174580a6752615 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `src/init/model.ts` | implementation-source | active | Current Init v1 artifact and routing contract. |
| `src/init/templates.ts` | implementation-source | active | Generated AGENTS/workflow prose. |
| `docs/HADARA_WORKFLOW.md` | constraint | active | Repository workflow guidance. |

## Changes

| Area | Summary |
|---|---|
| Dist | Rebuilt local `dist` from current source. |
| Repository guidance | Migrated context routing from HADARA_CONTEXT to READ_MAP and preset terminology. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Legacy project-store adoption remains separate from this guidance refresh. | Open | `docs/HADARA_WORKFLOW.md` |

## Close Summary

Pre-Close Operator Action: Review the Init v1 routing migration and confirm no external project
adoption or publication mutation is included.

Post-Close Continuation: Terminal. Future Init adoption of this legacy repository requires a separate reviewed capsule.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | Draft | Initial task scaffold. |
| 2026-08-08 | In Progress | Refreshing dist and migrating repository guidance to current Init v1 routing. |
| 2026-08-08 | Done | Dist rebuilt, Init v1 doctor aligned with project manifest/read-map state, and fixture validation passed. |
