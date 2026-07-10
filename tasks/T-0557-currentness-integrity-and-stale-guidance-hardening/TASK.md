# T-0557 Currentness integrity and stale guidance hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0557 |
| Title | Currentness integrity and stale guidance hardening |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make HADARA's next-work and active-document guidance agree with current executable behavior. | Prevent historical Partial capsules and stale command/version examples from being presented as current work. |

## Scope

| Boundary | Items |
|---|---|
| In | Task-selection fallback semantics; semantic docs-doctor checks for stale install versions and removed command examples; current onboarding/high-level documentation corrections; focused and toy-project validation. |
| Out | Broad historical document archival, current-state projection redesign, new command families, provider/runtime expansion, release publication. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Lock currentness failure fixtures for historical Partial selection and active-document examples. | Done |
| 2 | Implement bounded selection and docs-doctor currentness diagnostics. | Done |
| 3 | Correct active onboarding and high-level documents that contradict the 0.4.2 command surface. | Done |
| 4 | Run focused tests, build, built-CLI smokes, and a fresh toy-project lifecycle smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Historical `Partial` Task Board rows remain backlog-only and are never selected as the primary fallback without an actionable current source. | Met | ev:T-0557:5979f12a38234a989563372d | tests/unit/task-selection.test.ts |
| AC-2 | `docs doctor` reports a distinct currentness warning for stale active install commands and removed public command examples, with an explicit health verdict. | Met | ev:T-0557:5979f12a38234a989563372d | tests/unit/docs-doctor.test.ts |
| AC-3 | Active onboarding and high-level product documents agree on 0.4.2 and the status/finalize lifecycle. | Met | ev:T-0557:09506d560d374230b2d29399 | README.md; docs/GETTING_STARTED.md; docs/LIFECYCLE_QUICKSTART.md; docs/ARCHITECTURE.md; docs/ROADMAP.md |
| AC-4 | Focused validation and fresh toy-project CLI dogfood pass with durable evidence. | Met | ev:T-0557:57062741eb8e4fa7a27302a3 | validation and dogfood commands |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused currentness tests | Yes | Passed | ev:T-0557:5979f12a38234a989563372d |
| TypeScript build | Yes | Passed | ev:T-0557:09506d560d374230b2d29399 |
| Fresh standard toy-project lifecycle | Yes | Passed | ev:T-0557:57062741eb8e4fa7a27302a3 |
| Full Docker sync-build | Yes | Passed | ev:T-0557:09506d560d374230b2d29399 |
| P0 standard toy lifecycle | Yes | Passed | ev:T-0557:57062741eb8e4fa7a27302a3 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request 2026-07-10 | constraint | active | Implement P0-P3 as separate committed capsules and dogfood each phase. |
| docs/HADARA_WORKFLOW.md | reference | active | Status-first, evidence-backed, finalize-close workflow. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | active | Current public lifecycle boundary. |
| src/task/task-selection.ts | implementation-source | active | Current next-work fallback logic. |
| src/services/docs-registry.ts | implementation-source | active | Current docs-doctor report and registry validation. |

## Changes

| Area | Summary |
|---|---|
| task selection | `Partial` rows remain visible as backlog but no longer become the primary fallback. |
| docs doctor | Added `health`, `currentnessIssues`, stale install-version checks, and removed-command example checks. |
| active docs | Aligned onboarding, lifecycle quickstart, architecture, roadmap, project state, and handoff with 0.4.2 behavior. |
| validation fixtures | Aligned close/ready/recovery/dogfood fixtures with the T-0556 History Done gate and restored the clean full-suite baseline. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Broad historical document archival and current-state projection redesign remain P1/P3 work. | Deferred | P1/P3 capsules |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | Done | Currentness integrity, fixture alignment, full validation, and standard toy dogfood completed. |
