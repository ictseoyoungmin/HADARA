# T-0779 Freeze RC6 lifecycle evidence and close-currentness hardening design

## Identity

| Field | Value |
|---|---|
| ID | T-0779 |
| Title | Freeze RC6 lifecycle evidence and close-currentness hardening design |
| Status | Done |
| Created | 2026-08-12T18:14 |
| Updated | 2026-08-12T18:20 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Freeze a normative RC6 hardening design that converts the T-0778 reviewer findings into ordered, testable implementation capsules. | Preserve T-0778 as closed history; this capsule changes design/docs only and performs no package or external release mutation. |

## Scope

| Boundary | Items |
|---|---|
| In | `docs/specs/0.5.0-rc6/` version folder; terminal lifecycle semantic evidence contract; structured evidence-reference integrity; close-time HANDOFF currentness; release current-state projection; capsule budgets and RC6 invalidation rule; document registration. |
| Out | Runtime implementation; edits to T-0778 close-source docs; npm/GitHub/Docker mutation; RC6 artifact generation or publication. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reconcile reviewer findings with current evidence, close, handoff, and release contracts. | Done |
| 2 | Write and register the normative RC6 hardening specification. | Done |
| 3 | Validate document routing/currentness and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A versioned `docs/specs/0.5.0-rc6/` design freezes stale-plan fencing separately from fresh-plan execute idempotency. | Met | `ev:T-0779:200f5181af2b4b1ca32541e3` | `00_TERMINAL_LIFECYCLE_EVIDENCE_AND_CLOSE_CURRENTNESS_HARDENING.md` |
| AC-2 | The design specifies command-generated lifecycle evidence, a registered schema/reducer, and prevention of passed evidence when a required nested step fails. | Met | `ev:T-0779:200f5181af2b4b1ca32541e3` | Contract A |
| AC-3 | The design specifies a shared structured evidence-reference resolver and fail-closed close snapshot integrity. | Met | `ev:T-0779:200f5181af2b4b1ca32541e3` | Contract B |
| AC-4 | The design specifies enforceable Pre-Close/Post-Close HANDOFF rules and one command-owned release current-state projection. | Met | `ev:T-0779:200f5181af2b4b1ca32541e3` | Contracts C-D |
| AC-5 | Ordered T-0780 through T-0782 capsule scopes, budgets, regression matrices, and mandatory RC6 regeneration are documented. | Met | `ev:T-0779:200f5181af2b4b1ca32541e3` | Capsule Plan and Budgets |
| AC-6 | The spec is registered as an active normative task-specific document and validation evidence is recorded. | Met | `ev:T-0779:8bacb757c60443b482135cc1` | docs registry and T-0779 evidence |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Spec contract review | Yes | Passed | exit 0 in 64ms | ev:T-0779:200f5181af2b4b1ca32541e3 |
| Docs registration/read-map | Yes | Passed | exit 0 in 88ms | ev:T-0779:8bacb757c60443b482135cc1 |
| Task Capsule done validation | Yes | Passed | exit 0 in 130ms | ev:T-0779:32484a779a1142deab1ade15 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0778 lifecycle artifact and close proof | background | implemented | Preserves the observed stale old-plan refusal and post-close dry-run facts without rewriting closed history. |
| Reviewer feedback attached 2026-08-12 | requirement | active | Defines AC-4 semantic mismatch, stale HANDOFF, release currentness contradiction, and dangling evidence reference findings. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Owns close-source and phase-specific HANDOFF rules. |
| `docs/SECURITY_MODEL.md` | constraint | active | Keeps raw/private consumer logs and secrets out of public evidence. |

## Changes

| Area | Summary |
|---|---|
| Spec | Added versioned normative RC6 lifecycle evidence and close-currentness hardening design. |
| Routing | Register the spec as active for T-0779 through T-0782. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Implement command-generated terminal lifecycle acceptance. | Deferred | T-0780 after T-0779 close. |
| RF-2 | Follow-up | Implement structured evidence-reference integrity and close snapshot v2. | Deferred | T-0781 after T-0780. |
| RF-3 | Follow-up | Enforce HANDOFF phases and generate release current-state projection. | Deferred | T-0782 after T-0781. |
| RF-4 | Risk | Runtime implementation invalidates RC5 as the stable artifact candidate. | Accepted | Generate and publish exact RC6 only after T-0780 through T-0782 pass. |

## Close Summary

The RC6 hardening design is frozen and registered. It separates stale-plan fencing from fresh-plan execute idempotency, requires command-generated semantic lifecycle evidence, resolves structured evidence references before close, enforces phase-correct HANDOFF guidance, and assigns release currentness to one generated projection. Runtime implementation and RC6 regeneration remain separate capsules.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Reviewer findings reduced into four structural contracts with ordered capsule and RC6 boundaries. |
| 2026-08-12 | Done | Normative spec registered, focused contract/routing checks passed, and implementation continuation frozen for T-0780 through T-0782. |
