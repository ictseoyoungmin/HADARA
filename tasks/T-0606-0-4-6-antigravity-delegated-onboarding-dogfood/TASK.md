# T-0606 0.4.6 Antigravity delegated onboarding dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0606 |
| Title | 0.4.6 Antigravity delegated onboarding dogfood |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify whether Antigravity can onboard a fresh project through HADARA as an ordinary external agent. | Keep the prompt generic and avoid explaining HADARA internals. |

## Scope

| Boundary | Items |
|---|---|
| In | Global public HADARA install check, fresh `/tmp` toy project, delegated `agy -p` attempts, generated docs/task review, findings report. |
| Out | Fixing Antigravity itself, publishing a release, completing the toy project manually after delegated execution failed. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Install/verify public `hadara@0.4.5` for ordinary-user delegated onboarding. | Done |
| 2 | Run Antigravity with generic user prompts against `/tmp` toy projects. | Done |
| 3 | Inspect generated HADARA docs/task outputs and identify onboarding blockers. | Done |
| 4 | Record findings in a dogfood report. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Public `hadara` install path is verified before delegated onboarding retry. | Done | `ev:T-0606:77a2d2ba4f9645eba98bd1e4`, `ev:T-0606:e7754dccad1e43edaf889b01` | `hadara doctor --json` |
| AC-2 | Antigravity delegated attempts are recorded with concrete outcome and blocker. | Done | `ev:T-0606:d4741b74fb4045f4adc21b82`, `ev:T-0606:243c79328dfc4093b2cacdf2`, `ev:T-0606:77a2d2ba4f9645eba98bd1e4`, `ev:T-0606:e7754dccad1e43edaf889b01` | `DOGFOOD_REPORT.md` |
| AC-3 | Generated docs/task findings are summarized for 0.4.6 follow-up. | Done | `ev:T-0606:e7754dccad1e43edaf889b01` | `DOGFOOD_REPORT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Global install verification | Yes | Passed | `ev:T-0606:77a2d2ba4f9645eba98bd1e4` |
| Antigravity delegated attempt 1 | Yes | Blocked | `ev:T-0606:d4741b74fb4045f4adc21b82` |
| Antigravity delegated attempt 2 | Yes | Blocked | `ev:T-0606:243c79328dfc4093b2cacdf2` |
| Antigravity retry after install | Yes | Blocked | `ev:T-0606:77a2d2ba4f9645eba98bd1e4` |
| Dogfood report completion | Yes | Passed | `ev:T-0606:e7754dccad1e43edaf889b01` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | reference | active | Use Antigravity as an external ordinary agent without HADARA internals. |
| `/tmp/hadara-agy-onboarding` | reference | active | First delegated attempt artifact. |
| `/tmp/hadara-agy-onboarding-v2` | reference | active | Retry project after installing public `hadara@0.4.5`; blocked by Antigravity quota. |

## Changes

| Area | Summary |
|---|---|
| Dogfood report | Captured Antigravity cwd drift, stale global HADARA risk, generated task token friction, and quota blocker. |
| Environment | Installed public `hadara@0.4.5` globally for future ordinary-user delegated attempts. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `doctor`/`init doctor` did not flag a scaffold created by older global HADARA 0.4.0/registry v2. | Open | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Generated TASK authoring allowed invalid `Inputs / Constraints Role` token from external agent (`source-document`). | Open | `DOGFOOD_REPORT.md` |
| RF-3 | Follow-up | External agent cwd/project-boundary control may require a stronger prompt recipe or wrapper before delegated dogfood is reliable. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | Done | Completed Antigravity delegated onboarding audit; fresh retry blocked by Antigravity quota after public HADARA install was corrected. |
