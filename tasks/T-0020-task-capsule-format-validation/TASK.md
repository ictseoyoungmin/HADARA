# T-0020 Task Capsule Format Validation

## Goal

Harden harness validation so Task Capsule Markdown format drift is detected after session changes, handoffs, or context compression.

## Scope

- Add standard Markdown format checks for Task Capsule files beyond presence.
- Validate `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md` structure.
- Add regression tests that fail on the kind of format drift seen in T-0019.
- Record evidence and update handoff docs.

## Out of Scope

- Automatic Markdown rewriting.
- Full prose style linting.
- Dashboard UI.
- External CI observation.

## Status

Done
