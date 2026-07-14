# T-0608 0.4.6 delegated onboarding UX hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0608 |
| Title | 0.4.6 delegated onboarding UX hardening |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove the most immediate delegated-onboarding UX friction found in T-0606/T-0607 without expanding command surface. | Fix the active-task handoff note bug and accept common human/LLM source-role aliases while keeping canonical TASK.md vocabulary stable. |

## Scope

| Boundary | Items |
|---|---|
| In | `src/services/project-current-state.ts`, `src/services/controlled-vocabulary.ts`, `src/harness/validate.ts`, focused unit tests, and task evidence. |
| Out | Replacing the validation execution layer, changing persisted schema tokens, or adding a new command surface. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Review delegated dogfood findings and identify small safe fixes. | Done |
| 2 | Fix handoff projection note when `activeTask` is null. | Done |
| 3 | Add source-role input aliases for common delegated-agent phrases. | Done |
| 4 | Run focused tests and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `docs/AGENT_HANDOFF.md` projection no longer says "Resume this capsule first" when `activeTask` is null. | Done | `ev:T-0608:4e4932a07cf0475682bde422` | `src/services/project-current-state.ts` |
| AC-2 | Inputs / Constraints Role values such as `project manifest`, `implementation target`, `validation target`, `workflow constraint`, and `task driver` validate as aliases. | Done | `ev:T-0608:4e4932a07cf0475682bde422` | `src/services/controlled-vocabulary.ts`, `src/harness/validate.ts` |
| AC-3 | Canonical source role tokens remain unchanged. | Done | `ev:T-0608:4e4932a07cf0475682bde422` | `tests/harness/harness-validate.test.ts` |
| AC-4 | Focused validation evidence is recorded. | Done | `ev:T-0608:4e4932a07cf0475682bde422` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused tests | Yes | Passed | `ev:T-0608:4e4932a07cf0475682bde422` |
| TypeScript build | Yes | Passed | `ev:T-0608:41503c7d3b584d7081ff8c0c` |
| Docker dev sync build / full suite | Yes | Passed | `ev:T-0608:1d9edc24cb7d41aea5620eef` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0607-0-4-6-codex-delegated-onboarding-dogfood/DOGFOOD_REPORT.md` | reference | active | Delegated Codex onboarding findings. |
| `.hadara/local/feedback/T-0607-codex-delegated-onboarding-findings.md` | background | active | Local non-committed feedback summary. |
| `src/services/project-current-state.ts` | implementation-source | active | Handoff current-state projection. |
| `src/harness/validate.ts` | implementation-source | active | TASK.md controlled-token validation. |
| `src/services/controlled-vocabulary.ts` | implementation-source | active | Canonical vocabulary and alias normalization. |

## Changes

| Area | Summary |
|---|---|
| current-state projection | Use an active-task-aware handoff note. |
| controlled vocabulary | Accept common source role aliases without changing canonical tokens. |
| tests | Updated focused project-state, harness, and finalize tests for the new alias behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Validation execution layer stabilization remains a larger follow-up; current validation runner already records EPERM as blocked and supports direct-result recovery. | Open | `tasks/T-0607-0-4-6-codex-delegated-onboarding-dogfood/DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Implemented active-task handoff note and source-role alias normalization. |
| 2026-07-14 | Done | Focused tests, TypeScript build, and Docker full suite passed; dist refreshed. |
