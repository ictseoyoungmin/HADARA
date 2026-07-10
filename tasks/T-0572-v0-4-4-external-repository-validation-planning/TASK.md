# T-0572 v0.4.4 external-repository validation planning

## Identity

| Field | Value |
|---|---|
| ID | T-0572 |
| Title | v0.4.4 external-repository validation planning |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Define the smallest executable v0.4.4 external-repository validation contract. | Planning only: choose repo shapes, workflow, metrics, artifacts, and release decision gates. |

## Scope

| Boundary | Items |
|---|---|
| In | External-repository validation plan, repo/profile slots, capsule budget, metrics, output artifacts, release decision gates, roadmap current wording cleanup. |
| Out | Running external dogfood, selecting private repositories, implementing product fixes, publishing packages, adding commands. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the planning-only task contract. | Done |
| 2 | Write the external-repository validation plan. | Done |
| 3 | Validate docs/currentness and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Plan defines three repository slots, profiles, budget, workflow, metrics, artifacts, and release decision gates. | Done | `ev:T-0572:f069634932cc4b668a80c1a7` | `EXTERNAL_REPOSITORY_VALIDATION_PLAN.md` |
| AC-2 | Roadmap no longer describes 0.4.3 publication as future work. | Done | `ev:T-0572:f069634932cc4b668a80c1a7` | `docs/ROADMAP.md` |
| AC-3 | Validation evidence is recorded. | Done | `ev:T-0572:f069634932cc4b668a80c1a7` | `docs doctor`, `harness validate`, `evidence lint` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `docs doctor --json` | Yes | Passed | Command returned `ok:true`; pre-finalize active/latest drift is expected until finalize bookkeeping. |
| `harness validate --task T-0572 --level done --json` | Yes | Passed | Rerun after token repair before close. |
| `evidence lint --task T-0572 --json` | Yes | Passed | `ev:T-0572:f069634932cc4b668a80c1a7` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/ROADMAP.md` | reference | active | v0.4.4 product question and evidence target. |
| `.hadara/state/current.json` | constraint | active | Names v0.4.4 external-repository validation planning as next work. |
| T-0571 | reference | active | Confirms 0.4.3 publication/recycle is complete before v0.4.4 planning. |

## Changes

| Area | Summary |
|---|---|
| Planning artifact | Added external-repository validation plan for v0.4.4. |
| Roadmap | Updated current baseline wording from pre-publish to published/recycled 0.4.3. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Execute the plan in separate dogfood capsules using real non-HADARA repositories. | Open | `EXTERNAL_REPOSITORY_VALIDATION_PLAN.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Wrote v0.4.4 external-repository validation plan. |
| 2026-07-10 | Done | Completed planning contract and set R1 basic-profile pilot as next work. |
