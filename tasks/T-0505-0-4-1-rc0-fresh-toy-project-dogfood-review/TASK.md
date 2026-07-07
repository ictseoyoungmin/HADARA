# T-0505 0.4.1 rc0 fresh toy project dogfood review

## Identity

| Field | Value |
|---|---|
| ID | T-0505 |
| Title | 0.4.1 rc0 fresh toy project dogfood review |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fresh toy-project dogfood review | Create a new disposable `/tmp` project, run HADARA init and task lifecycle commands from the current built CLI, inspect generated Markdown guidance, and record contradictions, improvement candidates, and strong UX points before `0.4.1-rc.0` release smoke. |

## Scope

| Boundary | Items |
|---|---|
| In | Disposable `/tmp` project init, generated scaffold review, task create/status/validation/finalize loop, representative CLI help/status/schema/slice/docs surfaces, structured dogfood report and local feedback notes. |
| Out | Product code changes, npm publish/release mutation, destructive cleanup outside the disposable `/tmp` dogfood directory. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and dogfood matrix. | Done |
| 2 | Create a fresh `/tmp` toy project and run `hadara init`. | Done |
| 3 | Inspect generated Markdown instructions and representative help/status/schema/slice/docs surfaces. | Done |
| 4 | Create and complete a toy task through validation and finalize. | Done |
| 5 | Write structured findings and local feedback. | Done |
| 6 | Validate this capsule and close with evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A fresh disposable toy project is initialized from the current built CLI and its scaffold docs are reviewed. | Met | `ev:T-0505:5f6574df14104b37b948b3fa` | `/tmp/hadara-t0505-toy` |
| AC-2 | A toy task is created, implemented, validated, and finalized through the current lifecycle. | Met | `ev:T-0505:5f6574df14104b37b948b3fa` | `/tmp/hadara-t0505-toy/tasks/T-0001-build-calculator-cli-mvp` |
| AC-3 | Findings are categorized as contradictions, improvement candidates, and strong points. | Met | `ev:T-0505:5f6574df14104b37b948b3fa` | `DOGFOOD_REPORT.md` |
| AC-4 | Repository-local feedback is written under `.hadara/local/feedback/` for non-committed UX notes. | Met | `ev:T-0505:5f6574df14104b37b948b3fa` | `.hadara/local/feedback/T-0505-fresh-toy-project-dogfood.md` |
| AC-5 | T-0505 capsule is ready for done-level validation and close through `task finalize --execute --auto`. | Met | `ev:T-0505:5f6574df14104b37b948b3fa` | T-0505 validation |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Fresh toy project lifecycle smoke | Yes | Passed | `ev:T-0505:5f6574df14104b37b948b3fa` |
| Finalize auto readiness | Yes | Passed | `ev:T-0505:5f6574df14104b37b948b3fa` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `AGENTS.md` | constraint | approved | HADARA-dev workflow and lifecycle rules. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | approved | Current task lifecycle command routing. |
| `docs/AGENT_HANDOFF.md` | reference | approved | Current 0.4.1-rc.0 release-line state. |
| Current built CLI `dist/cli/main.js` | implementation-source | implemented | Dogfood target. |

## Changes

| Area | Summary |
|---|---|
| Dogfood report | Added `DOGFOOD_REPORT.md` with setup, commands exercised, strong points, contradictions/bugs, command cleanup notes, and generated Markdown review. |
| Local feedback | Added non-committed `.hadara/local/feedback/T-0505-fresh-toy-project-dogfood.md`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Product-code UX fixes found during dogfood should be split into a later implementation capsule unless they block release smoke. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Fresh toy project dogfood completed and findings documented. |
