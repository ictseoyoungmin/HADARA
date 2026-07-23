# T-0687 RC2 Developer Surface Alignment

## Identity

| Field | Value |
|---|---|
| ID | T-0687 |
| Title | RC2 Developer Surface Alignment |
| Status | Done |
| Created | 2026-07-23T19:32 |
| Updated | 2026-07-23T19:41 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Correct the reviewer-found RC2 continuity and documentation drift, and record the first developer-surface code inventory for operational debt and release/readiness work. | Align shared docs with the compact Capsule contract, the RC2 scope boundary, and the next actionable remediation slice without changing runtime behavior. |

## Scope

| Boundary | Items |
|---|---|
| In | Shared-state and workflow documentation fixes for reviewer-found drift; compact Capsule guidance alignment; RC2 scope alignment in release/docs; development-slice row repair; developer-surface-first code inventory report for operational debt and release/readiness files. |
| Out | Runtime removal or refactor, DAG/status redesign work, validation-baseline promotion, fresh-session dogfood rerun, package publication, and any change to command behavior. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm the reviewer findings that still create continuity, ownership, or RC2 scope drift. | Done |
| 2 | Fix the shared documentation and workflow guidance errors without mutating runtime code. | Done |
| 3 | Record the first operational-debt and release/readiness code inventory in a task-local report. | Done |
| 4 | Validate the document set and close with an actionable next capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Shared docs no longer point RC2 simultaneously at DAG/status redesign and developer-surface-first reduction. | Met | Shared-doc updates plus ev:T-0687:9ff956a90bf640f6ac66b5af | `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |
| AC-2 | The compact Capsule contract and continuation semantics are aligned with reviewer feedback. | Met | Shared-doc updates plus ev:T-0687:113f63ae108d4a328837d03f | `AGENTS.md`, `docs/DEVELOPMENT_SLICES.md`, `HANDOFF.md` |
| AC-3 | A task-local report identifies the first operational-debt and release/readiness code files to change in the next remediation capsule. | Met | `RC2_DEVELOPER_SURFACE_REPORT.md` | `RC2_DEVELOPER_SURFACE_REPORT.md` |
| AC-4 | Validation evidence is recorded for the documentation-only alignment work. | Met | ev:T-0687:9ff956a90bf640f6ac66b5af, ev:T-0687:113f63ae108d4a328837d03f | Validation |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docs doctor currentness check | Yes | Passed | ev:T-0687:9ff956a90bf640f6ac66b5af |
| Working-tree diff format check | Yes | Passed | ev:T-0687:113f63ae108d4a328837d03f |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User direction, 2026-07-23 | constraint | active | RC2 should prioritize HADARA-dev-only surfaces such as operational debt and release, not DAG/status redesign. |
| Reviewer notes in `/home/ymin/.codex/attachments/c54c39cd-8eb0-4483-85e9-8e903ca1eec8/pasted-text.txt` | constraint | active | Fix the documented continuity, ownership, and scope errors before another reduction capsule. |
| `AGENTS.md` | constraint | active | Keep work in one Capsule, preserve evidence integrity, and update shared state before close. |
| `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/RELEASE_READINESS.md` | reference | active | These shared docs currently drift from the reviewer-approved RC2 interpretation. |
| `src/cli/debt.ts`, `src/services/operational-debt.ts`, `src/cli/release-*.ts`, `src/services/release-*.ts` | implementation-source | active | Inventory the first developer-surface code changes without editing runtime behavior in this capsule. |

## Changes

| Area | Summary |
|---|---|
| Shared docs | Aligned RC2 continuity, compact Capsule ownership, release scope wording, development-slice metadata, and Task Board notes with reviewer feedback. |
| Task-local report | Recorded the first operational-debt and release/readiness code inventory for the next remediation capsule. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Manual shared-doc fixes will not update the command-owned compatibility checkpoint until this capsule closes. | Open | `.hadara/state/current.json` |
| RF-2 | Follow-up | Fresh-session three-profile dogfood and validation-baseline promotion remain separate work after the developer-surface scope is settled. | Open | Reviewer notes |
| RF-3 | Follow-up | The next implementation capsule still has to choose whether release and operational-debt surfaces are extracted, deleted, or demoted behind tooling. | Open | `RC2_DEVELOPER_SURFACE_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | In Progress | Confirmed the reviewer findings affecting continuation semantics, compact Capsule ownership, malformed development-slice rows, and split RC2 scope. |
| 2026-07-23 | Done | Completed the RC2 developer-surface alignment, documented the next code inventory, and recorded docs validation evidence. |
