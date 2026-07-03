# T-0482 Task Capsule v2 minimal human schema cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0482 |
| Title | Task Capsule v2 minimal human schema cleanup |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Make TASK.md v2 smaller and more human-readable before 0.4.0 stable. | Remove task-local columns that read like internal bookkeeping while preserving evidence where it proves acceptance and validation. |

## Scope

| Boundary | Items |
|---|---|
| In | TASK.md scaffold/template shape, harness compatibility, task workbench guidance, upgrade scaffold markers, regression tests, and stable pre-release plan notes. |
| Out | Removing legacy compatibility for existing capsules, changing evidence.jsonl schema, or redesigning close proof. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the v2 minimal TASK.md contract. | Done |
| 2 | Update scaffold, validators, workbench guidance, and upgrade markers. | Done |
| 3 | Update regression tests and docs. | Done |
| 4 | Run Docker validation and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | New TASK.md scaffolds use `Plan` without Evidence, `Acceptance` without Decision, `Inputs / Constraints` without Hash, `Changes` without Evidence, and manual `History` with `Date / State / Note`. | Met | `ev:T-0482:6ce94f74df354339b733197a` | User request, 2026-07-03 |
| AC-2 | Harness validation accepts the new lean schema while retaining compatibility for existing hash-enabled and legacy tables. | Met | `ev:T-0482:6ce94f74df354339b733197a` | `src/harness/validate.ts` |
| AC-3 | Workbench and upgrade-scaffold guidance prefer the lean schema and avoid suggesting hashes for new human TASK.md inputs. | Met | `ev:T-0482:6ce94f74df354339b733197a` | `src/services/task-workbench.ts` |
| AC-4 | Validation evidence is recorded and the capsule closes through the standard lifecycle. | Met | `ev:T-0482:c82757abddb24013b85cc7d8` | Done-level harness validation |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Ext4 Docker check | Yes | Passed | `ev:T-0482:6ce94f74df354339b733197a` |
| Scaffold smoke | Yes | Passed | `ev:T-0482:6ce94f74df354339b733197a` |
| Diff check | Yes | Passed | `ev:T-0482:6ce94f74df354339b733197a` |
| Done-level harness validation | Yes | Passed | `ev:T-0482:c82757abddb24013b85cc7d8` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request, 2026-07-03 | constraint | approved | Manual `History` with `Date / State / Note`; proceed with v2. |
| tasks/T-0481-task-capsule-human-readable-schema-cleanup/HANDOFF.md | reference | approved | Prior schema cleanup outcome and residual simplification discussion. |
| src/task/task-capsule.ts | implementation-source | implemented | Default TASK.md scaffold. |
| src/harness/validate.ts | implementation-source | implemented | TASK.md schema validation and legacy compatibility. |

## Changes

| Area | Summary |
|---|---|
| TASK.md schema | Replace internal-looking columns with lean human rows and manual History. |
| Harness validation | Accept new lean tables and retain legacy/hash table support. |
| Workbench guidance | Stop treating hashes as expected for new Inputs / Constraints tables. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Broader source drift/read-model design can move hash fidelity outside human TASK.md in a later capsule. | Deferred | Stable pre-release plan |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Capsule created from the previous scaffold. |
| 2026-07-03 | In Progress | Reauthored as the first minimal v2 TASK.md contract implementation. |
| 2026-07-03 | Done | Lean v2 scaffold, validator compatibility, guidance, tests, and docs completed. |
