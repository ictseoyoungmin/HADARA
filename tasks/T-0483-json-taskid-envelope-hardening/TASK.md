# T-0483 JSON taskId envelope hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0483 |
| Title | JSON taskId envelope hardening |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Task-scoped JSON responses expose a top-level `taskId`. | Keep nested task identifiers for compatibility, but make shell extraction use `.taskId` instead of defensive nested parsing. |

## Scope

| Boundary | Items |
|---|---|
| In | Task create/show/read/status, harness validate, evidence collect/lint, handoff, proof, CI gate, protocol migration/doctor, and release closeout/package/release reports that accept or resolve a task id. |
| Out | Removing existing nested task id fields, changing non-task/global list responses, or redesigning command schemas. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task-scoped JSON contract from the stable pre-release plan. | Done |
| 2 | Add top-level `taskId` to task-scoped report builders without removing nested fields. | Done |
| 3 | Add focused regression coverage for representative JSON envelopes. | Done |
| 4 | Run validation and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Task-scoped JSON report builders include top-level `taskId` when a task id is requested or resolved. | Met | `ev:T-0483:39a179e7507c461886c664e7` | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |
| AC-2 | Existing nested identifiers remain present for compatibility. | Met | `ev:T-0483:39a179e7507c461886c664e7` | `docs/CLI_JSON_CONTRACT.md` |
| AC-3 | Regression tests cover representative task-scoped JSON envelopes and missing-task responses. | Met | `ev:T-0483:39a179e7507c461886c664e7` | Dogfood report shell-parsing friction |
| AC-4 | Validation evidence is recorded. | Met | `ev:T-0483:39a179e7507c461886c664e7` | HADARA protocol |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docker check/build | Yes | Passed | `ev:T-0483:39a179e7507c461886c664e7` |
| Focused JSON envelope tests | Yes | Passed | `ev:T-0483:39a179e7507c461886c664e7` |
| Built CLI smoke | Yes | Passed | `ev:T-0483:39a179e7507c461886c664e7` |
| Done-level capsule validation and diff hygiene | Yes | Passed | `ev:T-0483:42ea8a6985a64d6a88bf6372` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | constraint | approved | Stable pre-release item: JSON taskId envelope hardening. |
| `docs/CLI_JSON_CONTRACT.md` | reference | approved | JSON command contract reference. |
| Dogfood report / known issue | reference | approved | Nested ids made shell extraction defensive during T-0479 dogfood. |

## Changes

| Area | Summary |
|---|---|
| JSON report builders | Added top-level `taskId` to task-scoped task, harness, evidence, handoff, proof, CI gate, protocol, release closeout, package smoke/recycle, clean-checkout, dashboard workbench, and TUI task read reports while preserving nested ids. |
| CLI task show | Fixed `hadara task show --task <id> --json` so `--task` is parsed as an option rather than mistaken for the task id. |
| Tests | Added and updated regression assertions for root `taskId` across representative success and error envelopes. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Consider documenting `.taskId` as the preferred shell extraction path in CLI JSON docs after this lands. | Open | `docs/CLI_JSON_CONTRACT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Scoped from the stable 0.4.0 pre-release plan and started implementation. |
| 2026-07-03 | Done | Implemented root `taskId` envelopes, fixed `task show --task` parsing, and validated with Docker check plus built CLI smoke. |
