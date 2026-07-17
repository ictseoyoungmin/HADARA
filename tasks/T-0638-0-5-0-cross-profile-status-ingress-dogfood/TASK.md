# T-0638 0.5.0 cross-profile status ingress dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0638 |
| Title | 0.5.0 cross-profile status ingress dogfood |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0638 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Dogfood 0.5.0 status-first ingress across disposable profiles. | Verify basic, standard, governed, malformed-state, active/idle, compatibility, and package-style entrypoint behavior before moving beyond 0.5.0. |

## Scope

| Boundary | Items |
|---|---|
| In | Disposable `/tmp` projects for basic/standard/governed, current built CLI entrypoint, status v2/v1 compatibility, task-selection v2, selected-task v2, context pack replacement path, missing canonical-state behavior, package-style local tarball install smoke where feasible. |
| Out | External delegated agent MVP build, npm publish, GitHub release, changing product code unless dogfood finds a blocker. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Build or reuse current CLI artifact for dogfood. | Done |
| 3 | Exercise basic/standard/governed greenfield projects. | Done |
| 4 | Exercise active/idle/malformed current-state scenarios. | Done |
| 5 | Exercise package-style local install entrypoint. | Done |
| 6 | Record report, evidence, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Each scaffold profile initializes and returns `hadara.project.status.v2` from `status --json`. | Done | `ev:T-0638:eaa991534431425bb9af6f5f` | 050-C06 |
| AC-2 | Task-selection and selected-task status v2 are usable in disposable projects without `session start`. | Done | `ev:T-0638:eaa991534431425bb9af6f5f` | 050-C06 |
| AC-3 | v1 compatibility routes remain explicit and functional. | Done | `ev:T-0638:eaa991534431425bb9af6f5f` | compatibility policy |
| AC-4 | Malformed optional/canonical state cases produce explicit issues rather than silent wrong guidance. | Done | `ev:T-0638:b330a6b776994cb49a3942ae`, `ev:T-0638:eaa991534431425bb9af6f5f` | failure semantics |
| AC-5 | A package-style installed entrypoint exercises status-first smokes and does not expose `session.start` in command registry. | Done | `ev:T-0638:0a3aae1c6cc14e52926c3440` | installed-package dogfood |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Cross-profile dogfood report | Yes | Passed | `ev:T-0638:eaa991534431425bb9af6f5f` |
| Package-style local install dogfood | Yes | Passed | `ev:T-0638:0a3aae1c6cc14e52926c3440` |
| Focused status/task/package tests | Yes | Passed | `ev:T-0638:b330a6b776994cb49a3942ae`, `ev:T-0638:cbf27bb179604c31a164e83d` |
| TypeScript build | Yes | Passed | `ev:T-0638:1b2c80bb38d642a58d5c8d73` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md | implementation-source | active | 050-C06 dogfood gate. |
| tasks/T-0634-0-5-0-status-ingress-and-evaluation/TASK.md | reference | active | Project status v2 implementation. |
| tasks/T-0635-0-5-0-task-selection-status-v2-projection/TASK.md | reference | active | Task-selection v2 implementation. |
| tasks/T-0636-0-5-0-selected-task-status-v2-cockpit/TASK.md | reference | active | Selected-task status v2 implementation. |
| tasks/T-0637-0-5-0-remove-public-session-start-ingress/TASK.md | reference | active | Public session-start removal. |

## Changes

| Area | Summary |
|---|---|
| Dogfood | Added `DOGFOOD_REPORT.md` for cross-profile and package-style status ingress validation. |
| Status v2 | Fixed malformed `.hadara/state/current.json` handling so parse/validation errors surface as blocked project status issues and route to `status --detail full`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Any non-blocking dogfood UX friction should be recorded in `.hadara/local/feedback/` and the report. | Open | T-0638 |
| RF-2 | Follow-up | `hadara init --json > init.json` inside a new target creates an output file before init inspects the directory and can trigger brownfield adoption. | Open | `.hadara/local/feedback/T-0638-init-output-redirection-brownfield-trap.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Defined 0.5.0 cross-profile dogfood contract. |
| 2026-07-17 | In Progress | Fixed malformed current-state status v2 issue propagation and completed cross-profile/package dogfood. |
| 2026-07-17 | Done | Completed 0.5.0 status ingress dogfood and package-style entrypoint validation. |
