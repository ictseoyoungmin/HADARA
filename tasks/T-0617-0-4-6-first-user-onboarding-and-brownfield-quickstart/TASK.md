# T-0617 0.4.6 first-user onboarding and brownfield quickstart

## Identity

| Field | Value |
|---|---|
| ID | T-0617 |
| Title | 0.4.6 first-user onboarding and brownfield quickstart |
| Status | Done |
| Created | 2026-07-15 |
| Updated | 2026-07-15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Improve first-user and delegated-agent onboarding by fixing general CLI/documentation frictions surfaced in T-0615 dogfood. | Excludes HADARA-dev release-helper/package-candidate path issues; those are operational dogfood concerns rather than general product behavior. |

## Scope

| Boundary | Items |
|---|---|
| In | Legacy Task Board compatibility for brownfield projects; common task table token aliases; cleaner validation text output; clearer context-pack budget wording; command-level task create help routing; retiring completed current-state nextWork recommendations. |
| Out | `--no-bin-links`/Windows-mounted npm prefix guidance; delegated dogfood candidate PATH/entrypoint policy; external Codex output verbosity; no-socket sandbox testing guidance. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Classify T-0615 findings into general product fixes versus dogfood/release-operation issues. | Done |
| 2 | Implement general first-user UX hardening across task creation, validation output, context pack issues, task help routing, and controlled vocabulary aliases. | Done |
| 3 | Validate focused tests and TypeScript build, then record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Brownfield projects with the legacy Task Board table can still create tasks, while malformed or duplicate managed board sections fail closed. | Done | ev:T-0617:0ace70d9ef7a4996a050fd4c | T-0615 F-1/F-2 follow-up; T-0616 compatibility gap. |
| AC-2 | Delegated agents can use common task authoring terms without widening canonical vocabulary. | Done | ev:T-0617:0ace70d9ef7a4996a050fd4c | T-0615 F-6/F-11. |
| AC-3 | Human CLI output and command help avoid avoidable first-use confusion. | Done | ev:T-0617:0ace70d9ef7a4996a050fd4c | T-0615 F-5/F-7. |
| AC-4 | Context pack budget truncation is presented as informational guidance, not a degraded project warning. | Done | ev:T-0617:0ace70d9ef7a4996a050fd4c | T-0615 F-4. |
| AC-5 | Closing a task that matches structured nextWork retires that recommendation instead of suggesting a duplicate capsule. | Done | ev:T-0617:09ffe50f8e4b4bd780eb265b | Post-close status self-check. |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit and harness tests | Yes | Passed | ev:T-0617:0ace70d9ef7a4996a050fd4c |
| TypeScript build | Yes | Passed | ev:T-0617:0ace70d9ef7a4996a050fd4c |
| Current-state nextWork retirement regression | Yes | Passed | ev:T-0617:09ffe50f8e4b4bd780eb265b |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| tasks/T-0615-0-4-6-rc-0-installed-package-multi-scenario-delegated-dogfood/DOGFOOD_REPORT.md | reference | active | Source dogfood findings. |
| src/task/task-capsule.ts | implementation-source | active | Task allocation and Task Board write compatibility. |
| src/services/controlled-vocabulary.ts | implementation-source | active | Controlled vocabulary and CLI-input aliases. |
| src/cli/validation.ts | implementation-source | active | Human validation output. |
| src/context/context-pack.ts | implementation-source | active | Context pack issue severity and message wording. |
| src/cli/task.ts | implementation-source | active | Task subcommand help routing. |
| src/services/project-current-state.ts | implementation-source | active | Structured nextWork retirement after completed tasks. |
| tests/unit/project-current-state.test.ts | validation target | active | Current-state nextWork retirement regression coverage. |
| tests/unit/task-create.test.ts | validation target | active | Legacy board compatibility tests. |
| tests/harness/harness-validate.test.ts | validation target | active | Task table token alias tests. |
| tests/unit/validation-run.test.ts | validation target | active | Human output wording tests. |
| tests/unit/cli-help-routing.test.ts | validation target | active | Command-level help tests. |
| tests/unit/context-pack.test.ts | validation target | active | Context pack budget issue contract. |

## Changes

| Area | Summary |
|---|---|
| Task creation | Serialized task allocation now remains compatible with legacy canonical Task Board tables while still failing closed on malformed board surfaces. |
| Controlled vocabulary | Added CLI/input normalization for common source role aliases and no-risk risk-kind aliases without expanding persisted canonical tokens. |
| Validation CLI | Collapsed `taskValidationRow=updated updated` into a single `updated` token. |
| Context pack | Budget truncation now emits informational guidance with a clearer larger-budget hint. |
| Help routing | `hadara task create --help` now renders registry-backed help before title validation. |
| Current state | Completed structured nextWork recommendations are retired when their matching task is closed. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | HADARA-dev candidate-package install/PATH dogfood guidance remains a release-operation issue, not a general CLI fix. | Open | T-0615 F-3/F-10 |
| RF-2 | Follow-up | Restricted-agent no-socket test seam guidance may belong in generated docs for API projects. | Open | T-0615 F-8/F-12 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-15 | Draft | Initial task scaffold. |
| 2026-07-15 | In Progress | Implemented general first-user onboarding hardening from T-0615 dogfood findings. |
| 2026-07-15 | Done | Focused tests and TypeScript build passed; evidence recorded. |
