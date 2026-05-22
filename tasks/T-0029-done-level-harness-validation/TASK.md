# T-0029 Done-Level Harness Validation

## Goal

Add `draft` and `done` validation levels so Task Capsules can be structurally valid while still requiring stronger completion checks before being marked Done.

## Scope

- Add `hadara harness validate --level draft|done`.
- Preserve default validation behavior with `draft`.
- In `done` level, require `TASK.md` status to be Done.
- In `done` level, require all acceptance checkboxes to be checked.
- In `done` level, require at least one evidence index record.
- In `done` level, require handoff content to be updated beyond placeholders.
- Add focused regression tests.

## Out of Scope

- Rich semantic validation of acceptance wording.
- Evidence result policy beyond requiring at least one record.
- Init profile work.
- Run scenario scaffolding.

## Status

Done
