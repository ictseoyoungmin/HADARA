# T-0662 Schema validator anyOf support (RF-3 fix)

## Identity

| Field | Value |
|---|---|
| ID | T-0662 |
| Title | Schema validator anyOf support (RF-3 fix) |
| Status | Done |
| Created | 2026-07-20T18:00 |
| Updated | 2026-07-20T18:10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0662 --json`.

## Goal

| Goal | Notes |
|---|---|
| Implement `anyOf` in the hand-rolled schema validator (`src/core/schema.ts`) so the pre-existing `anyOf` branches in `project-current-state.schema.json`, `protocol-migration.schema.json`, `protocol-remediation.schema.json`, `session-start.schema.json`, `task-selection-status.schema.json`, and `task-status-v2.schema.json` actually validate instead of silently passing everything. | Discovered as RF-3 during T-0661; this closes the general gap rather than only working around it locally with `oneOf`. |

## Scope

| Boundary | Items |
|---|---|
| In | `anyOf` handling in `validateValue()` (match >= 1 of the listed schema options, reusing `validateCandidate`), a focused unit test proving `anyOf` now rejects invalid values, and a full-suite run to catch any fixture/data shape across the six schemas above that was only passing because `anyOf` was a no-op. |
| Out | Implementing `allOf` (unused by any current schema — verified by grep), replacing the hand-rolled validator with a library (Ajv or similar), changing any schema's semantics beyond making `anyOf` actually enforce what it already declares. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add `anyOf` handling to `validateValue()`. | Done |
| 2 | Add a focused unit test for `anyOf` accept/reject behavior. | Done |
| 3 | Run the full suite; if `anyOf` now correctly rejects a previously-silent invalid fixture anywhere, fix the fixture/data (not the validator) unless it reveals a real product bug, in which case fix that narrowly. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `validateSchema`/`validateValue` treats `anyOf` as "matches at least one of the listed schemas" and reports `SCHEMA_ANY_OF_MISMATCH` when none match. | Met | ev:T-0662:700f4303c9644bc68828aa3e | src/core/schema.ts |
| AC-2 | A focused test proves `anyOf` now rejects a value matching none of its branches, where it previously always passed. | Met | ev:T-0662:700f4303c9644bc68828aa3e | tests/unit/schema-runtime.test.ts |
| AC-3 | Full suite passes with the fix live across all six schemas currently using `anyOf`. | Met | ev:T-0662:0f6b0625b10342969b7be5d5 | build + full suite (164 files, 1214 tests, no regressions) |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests (schema anyOf) | Yes | Passed | ev:T-0662:700f4303c9644bc68828aa3e |
| TypeScript build | Yes | Passed | ev:T-0662:da09f756e4be46ffaabe7673 |
| Full test suite | Yes | Passed | ev:T-0662:0f6b0625b10342969b7be5d5 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `src/core/schema.ts` | implementation-source | active | Hand-rolled JSON-Schema-subset validator; owns `validateValue`/`oneOf` today. |
| T-0661 `tasks/T-0661-continuation-model-task-close-promotion-and-idle-precedence-fix-/TASK.md` RF-3 | background | active | Origin of this fix; discovered while adding the `continuation` field. |

## Changes

| Area | Summary |
|---|---|
| `src/core/schema.ts` | Added an `anyOf` branch to `validateValue()` alongside the existing `oneOf`/`$ref`/`const` handling: matches >= 1 of the listed schema options via the existing `validateCandidate` helper, reporting `SCHEMA_ANY_OF_MISMATCH` when none match. |
| `src/schemas/project-current-state.schema.json` | Reverted the `continuation` field's `oneOf` workaround (added in T-0661 to route around this gap) back to `anyOf`, now that it validates correctly. |
| `tests/unit/schema-runtime.test.ts` | New test proving `anyOf` accepts a null/valid continuation and rejects an invalid disposition with `SCHEMA_ANY_OF_MISMATCH`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `allOf` is unused by any current schema (verified by grep) and was not implemented; add it if a future schema needs it. | Open | src/core/schema.ts |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-20 | Draft | Initial task scaffold. |
| 2026-07-20 | Done | anyOf implemented in the schema validator; full suite (164 files / 1214 tests) confirmed no latent fixture regressions across all six schemas using anyOf. |
