# T-0121 Done-level Capsule Scaffold Guard

## Goal

Add a done-level harness validation guard that fails completed Task Capsules when standard Markdown files still contain their initial scaffold placeholders or empty/default content.

## Scope

- Detect scaffold leftovers only during `hadara harness validate --level done`.
- Cover the standard Task Capsule Markdown files whose default content can otherwise pass structural validation.
- Add focused harness regressions for default scaffold failures and genuinely updated capsule success.
- Update task-local and project tracking docs with evidence.

## Out of Scope

- Changing draft-level validation behavior.
- Requiring a specific prose style or minimum word count beyond avoiding scaffold/default placeholders.
- Adding release-gate or CI-only enforcement beyond the existing harness validate path.

## Status

Done
