# T-0101 Task Board Append Done-Level Guard

## Goal

Add done-level harness validation that catches broken `docs/TASK_BOARD.md` append/update results for the completed Task Capsule.

## Scope

- Check `docs/TASK_BOARD.md` during done-level validation.
- Require exactly one row for the task being validated.
- Require the Task Board row status to be `Done`.
- Require the Task Board capsule path to match the actual Task Capsule path.
- Add regressions for duplicate rows and stale status/capsule rows.
- Update project tracking docs and evidence.

## Out of Scope

- Rewriting the Task Board append implementation.
- Validating every row in `docs/TASK_BOARD.md` during draft-level validation.
- Adding release-gate enforcement for historical Task Board rows.

## Status

Done
