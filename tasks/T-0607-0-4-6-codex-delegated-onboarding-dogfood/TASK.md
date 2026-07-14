# T-0607 0.4.6 Codex delegated onboarding dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0607 |
| Title | 0.4.6 Codex delegated onboarding dogfood |
| Status | Draft |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Run a delegated Codex onboarding dogfood against an installed public HADARA package without explaining HADARA internals. | Verify whether a general coding agent can initialize HADARA, follow generated workflow docs, complete a small capsule, and surface first-user friction. |

## Scope

| Boundary | Items |
|---|---|
| In | `/tmp/hadara-codex-onboarding-v2`, global `hadara@0.4.5`, Codex CLI delegated run, resulting DOGFOOD report, and HADARA-dev evidence. |
| Out | Fixing HADARA code, closing this HADARA-dev capsule, or changing the delegated project after the agent completed. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Install or verify public HADARA package availability for delegated onboarding. | Done |
| 2 | Create a fresh `/tmp` toy project and run Codex with absolute project root, gpt-5.4-mini, medium reasoning, and workspace-write sandbox. | Done |
| 3 | Inspect delegated artifacts, validation result, task lifecycle outcome, and report findings. | Done |
| 4 | Record HADARA-dev evidence and leave T-0607 open for review. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Delegated Codex initializes HADARA and completes at least one useful task capsule in a fresh `/tmp` project. | Done | `ev:T-0607:2981bf28318f4915817f5acb` | `DOGFOOD_REPORT.md` |
| AC-2 | Delegated project validation and HADARA task lifecycle outcome are checked by the reviewer. | Done | `ev:T-0607:2981bf28318f4915817f5acb` | `/tmp/hadara-codex-onboarding-v2` |
| AC-3 | Onboarding friction is recorded for 0.4.6 follow-up planning. | Done | `DOGFOOD_REPORT.md` | `.hadara/local/feedback` not required |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Delegated Codex dogfood | Yes | Passed with findings | `ev:T-0607:2981bf28318f4915817f5acb` |
| Reviewer rerun: `/tmp/hadara-codex-onboarding-v2 npm test` | Yes | Passed | `ev:T-0607:2981bf28318f4915817f5acb` |
| Reviewer check: delegated task status | Yes | Passed, closed-valid | `ev:T-0607:2981bf28318f4915817f5acb` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/tmp/hadara-codex-onboarding-v2/DOGFOOD_REPORT.md` | reference | active | Delegated Codex's own report. |
| `/tmp/hadara-codex-onboarding-v2/tasks/T-0001-add-help-option-to-daily-note-cli/TASK.md` | reference | active | Delegated capsule reached closed-valid. |
| User request | constraint | active | Do not close this HADARA-dev capsule yet; rerun with Codex gpt-5.4-mini medium. |

## Changes

| Area | Summary |
|---|---|
| `DOGFOOD_REPORT.md` | Added reviewer-level synthesis of the delegated Codex onboarding run. |
| Evidence | Recorded delegated run outcome as `ev:T-0607:2981bf28318f4915817f5acb`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Consider a 0.4.6 capsule for repeated validation-wrapper `spawnSync npm EPERM` friction in delegated environments. | Open | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Consider clearer Role-token examples or aliases for common agent phrasing such as `project manifest` and `implementation target`. | Open | `DOGFOOD_REPORT.md` |
| RF-3 | Follow-up | Revisit brownfield nextWork/adoption baseline wording after a successful first feature capsule. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Delegated Codex dogfood completed and findings recorded; capsule intentionally left open for review. |
