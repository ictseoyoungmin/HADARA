# T-0561 0.4.3 structured current-state canon and projection

## Identity

| Field | Value |
|---|---|
| ID | T-0561 |
| Title | 0.4.3 structured current-state canon and projection |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Establish a portable structured current-state canon and deterministic Markdown projections for 0.4.3. | Preserve 0.4.2 project compatibility and add no public command. |

## Scope

| Boundary | Items |
|---|---|
| In | `.hadara/state/current.json` schema/service; init scaffold and upgrade migration; PROJECT_STATE/HANDOFF managed projections; task create/finish synchronization; state projection/read-model integration; focused tests and HADARA-dev migration. |
| Out | Publish/deploy execution; external-repository P3 study; provider/controller/cloud work; new public commands; broad prose generation outside managed current-state sections. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the structured state schema, ownership, migration, and projection contract. | Done |
| 2 | Implement scaffold/upgrade and task lifecycle synchronization. | Done |
| 3 | Migrate HADARA-dev current state and align read/projection services. | Done |
| 4 | Run focused/full validation and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A versioned portable current-state file owns release, latest/active task, next intent, known problems, and validation baseline. | Met | ev:T-0561:91afe9e67c5a4e42bd4d344b | `.hadara/state/current.json` and schema |
| AC-2 | New init and existing-project upgrade create the canon without overwriting unrelated prose. | Met | ev:T-0561:91afe9e67c5a4e42bd4d344b | init scaffold/upgrade tests |
| AC-3 | PROJECT_STATE/HANDOFF managed sections deterministically project the canon and drift is detectable. | Met | ev:T-0561:91afe9e67c5a4e42bd4d344b | service and state projection tests |
| AC-4 | Task create/finish keep active/latest task facts synchronized when the canon is present. | Met | ev:T-0561:91afe9e67c5a4e42bd4d344b | lifecycle tests |
| AC-5 | Focused and full Docker validation pass without a new public command. | Met | ev:T-0561:18e604d7bfc1491eaa14a4a4, ev:T-0561:c91062958d2344d8bae89643 | validation evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Current-state service/schema/init/lifecycle focused tests | Yes | Passed | ev:T-0561:91afe9e67c5a4e42bd4d344b |
| Command registry freeze regression | Yes | Passed | ev:T-0561:18e604d7bfc1491eaa14a4a4 |
| Full Docker sync-build | Yes | Passed | ev:T-0561:c91062958d2344d8bae89643 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User v0.4.3 request 2026-07-10 | constraint | active | Complete release preparation except deployment script execution. |
| docs/ARCHITECTURE.md | constraint | active | Preserve portable/project and local/private boundaries. |
| docs/TEST_STRATEGY.md | constraint | active | Docker check is the authoritative full gate. |
| docs/PRIMARY_WORKFLOW_BUDGET.md | constraint | active | No new public command. |

## Changes

| Area | Summary |
|---|---|
| current-state canon | Added schema-validated portable state, atomic bundle writes, legacy derivation, and managed projection rendering. |
| init/lifecycle | New scaffolds create the canon; upgrade migrates dry-run-first; task create/finish synchronize active/latest facts. |
| read models | Session start, status, state projection, project state, and handoff reads prefer the canon with Markdown fallback. |
| repository docs | Migrated HADARA-dev, removed duplicated current prose, documented ownership and fast session resume. |
| validation | Added focused service/init/lifecycle/session/schema regressions and preserved the command budget. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Measurement trace and seven-metric harness remain a separate 0.4.3 capsule. | Deferred | T-0562 planned |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Structured canon, managed projection, migration, and lifecycle scope accepted. |
| 2026-07-10 | Done | Canon, migration, lifecycle synchronization, fast session resume, and Docker validation completed. |
