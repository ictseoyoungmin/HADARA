# T-0680 Markdown current-state authority simplification

## Identity

| Field | Value |
|---|---|
| ID | T-0680 |
| Title | Markdown current-state authority simplification |
| Status | Done |
| Created | 2026-07-22T08:47 |
| Updated | 2026-07-22T09:11 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0680 --json`.

## Goal

| Goal | Notes |
|---|---|
| Make ordinary lifecycle routing reconstructable from Markdown and Task Capsules while retaining `current.json` only as a compatibility checkpoint. | Default task selection must keep working if the checkpoint is missing or malformed. |

## Scope

| Boundary | Items |
|---|---|
| In | Make Task Board/Task Capsule state precede the structured checkpoint for active work; make malformed checkpoint data advisory; remove raw `current.json` from Required Reading and first-use routing; relabel managed projections/checkpoint ownership; update context, workflow, architecture, schemas, and tests. |
| Out | Profile-specific generated file sets, consumer release defaults, HADARA-dev prose leakage, installed-package dogfood, publishing, and deleting the 0.5.x checkpoint reader. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define Markdown-first routing and compatibility-checkpoint ownership. | Done |
| 2 | Make adaptive status derive active work from the Markdown selection model and degrade checkpoint failures to warnings. | Done |
| 3 | Remove raw checkpoint reads from normal Required Reading and align projections/docs/tests. | Done |
| 4 | Run focused and full Docker validation, built CLI missing/malformed checkpoint smokes, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | An existing open Task Board capsule drives default selected-task status without depending on `current.json`. | Met | ev:T-0680:f15442d885a4472c8397a8f9 | status tests |
| AC-2 | Missing or malformed `current.json` cannot block Markdown-based work selection; malformed data remains visible as an advisory issue. | Met | ev:T-0680:b9c381304c98458fa5a3ada0 | selection tests |
| AC-3 | AGENTS, HADARA_CONTEXT, workflow, and current project docs do not require agents to read raw `current.json`. | Met | ev:T-0680:b9c381304c98458fa5a3ada0 | docs tests |
| AC-4 | Managed state prose calls the file a compatibility checkpoint rather than the canonical human authority. | Met | ev:T-0680:b9c381304c98458fa5a3ada0 | current-state tests |
| AC-5 | Focused tests, full Docker source check, built CLI smokes, and close readiness pass with evidence. | Met | ev:T-0680:d3678aba966b4b0fad7d8aa3 | validation evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused status, selection, current-state, docs, init, and schema tests | Yes | Passed | ev:T-0680:b9c381304c98458fa5a3ada0 |
| Full source check | Yes | Passed | ev:T-0680:d3678aba966b4b0fad7d8aa3 |
| Built CLI missing/malformed checkpoint smokes | Yes | Passed | ev:T-0680:f15442d885a4472c8397a8f9 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md` | reference | active | Accepted pre-stable state ownership contract. |
| `src/task/task-selection.ts` | implementation-source | active | Markdown and checkpoint recommendation precedence. |
| `src/services/project-current-state.ts` | implementation-source | active | Compatibility checkpoint and managed projection behavior. |
| `AGENTS.md` | constraint | active | Required Reading and protocol rules. |
| `.hadara/context/HADARA_CONTEXT.md` | implementation-source | active | Normal human-inspectable read graph. |

## Changes

| Area | Summary |
|---|---|
| Contract | Defined Markdown-first routing with checkpoint-only structured state. |
| Selection | Made Task Board and Task Capsule recommendations precede the compatibility checkpoint; malformed checkpoint input is advisory. |
| Status | Made default adaptive task status select an existing open Markdown capsule without a structured checkpoint. |
| Documentation | Removed raw checkpoint reads from normal startup routing and relabeled generated/project projections as compatibility-only. |
| Surface | Removed deprecated `status baseline promote` mutation and its capability registration. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Make generated profiles materially distinct and remove remaining consumer scaffold leakage. | Open | Next Task Capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-22 | Draft | Initial task scaffold. |
| 2026-07-22 | Draft | Defined Markdown-first routing and compatibility-checkpoint boundaries. |
| 2026-07-22 | Done | Implementation, documentation, focused validation, full validation, and built CLI smoke completed; ready for close proof. |
