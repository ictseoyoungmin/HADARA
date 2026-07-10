# T-0573 v0.4.4 R1 delegated-agent basic-profile dogfood pilot

## Identity

| Field | Value |
|---|---|
| ID | T-0573 |
| Title | v0.4.4 R1 delegated-agent basic-profile dogfood pilot |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Run the R1 external dogfood pilot through an independent delegated agent. | The local Codex session acts as reviewer/operator coordinator; the nested agent uses installed `hadara@latest` as an ordinary user in `/mnt/f/NowWorking/dev`. |

## Scope

| Boundary | Items |
|---|---|
| In | Prepare the delegated-agent prompt, run or attempt the R1 basic-profile dogfood in a disposable external project, review the resulting report, and record HADARA UX findings. |
| Out | Publishing, deployment, secret handling, destructive history edits, and using HADARA-dev source-only commands inside the dogfood target. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Write the delegated-agent operating prompt and safety boundary. | Done |
| 2 | Launch or attempt the delegated dogfood run under `/mnt/f/NowWorking/dev`. | Done |
| 3 | Review output and distill HADARA UX findings into the capsule. | Done |
| 4 | Validate capsule docs and close readiness. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Delegated-agent prompt exists and clearly separates reviewer/operator roles from user impersonation. | Done | `ev:T-0573:5474641e8e7b43d6897a34d6` | `DELEGATED_AGENT_PROMPT.md` |
| AC-2 | R1 dogfood is attempted against a disposable non-HADARA basic-profile project, or a concrete environment blocker is recorded. | Done | `ev:T-0573:5474641e8e7b43d6897a34d6` | `R1_DELEGATED_DOGFOOD_REPORT.md` |
| AC-3 | Findings are summarized without raw private logs, secrets, or target source dumps. | Done | `ev:T-0573:5474641e8e7b43d6897a34d6` | `R1_DELEGATED_DOGFOOD_REPORT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Delegated run or environment blocker captured | Yes | Passed | `ev:T-0573:5474641e8e7b43d6897a34d6` |
| HADARA capsule validation | Yes | Passed | `ev:T-0573:5474641e8e7b43d6897a34d6` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0572-v0-4-4-external-repository-validation-planning/EXTERNAL_REPOSITORY_VALIDATION_PLAN.md` | reference | active | Defines R1 profile, constraints, metrics, and release decision gates. |
| User request | constraint | active | Use Claude CLI as an independent delegated agent while this session acts as reviewer. |

## Changes

| Area | Summary |
|---|---|
| Task capsule | Defined delegated-agent dogfood prompt and review boundary. |
| Dogfood report | Recorded independent Claude CLI R1 results: 5 basic-profile capsules attempted and 5 closed-valid. |
| Local feedback | Added non-committed feedback for version flags, stale installed-package version warning, post-close output noise, placeholder location, and evidence update asymmetry. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Nested agent execution may require permissions, network access, or account-specific CLI capability outside this sandbox. | Open | `DELEGATED_AGENT_PROMPT.md` |
| RF-2 | Follow-up | R1 found first-contact version flag mismatch and installed-package stale-warning leakage. | Open | `R1_DELEGATED_DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Prepared delegated-agent R1 dogfood task contract. |
| 2026-07-10 | In Progress | Delegated Claude CLI completed 5 basic-profile capsules and report was reviewed. |
| 2026-07-10 | Done | Captured delegated R1 findings and next cleanup target. |
