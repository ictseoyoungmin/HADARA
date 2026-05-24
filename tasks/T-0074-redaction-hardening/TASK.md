# T-0074 Redaction Hardening

## Goal

Promote public evidence redaction from a simple regex list to a registry/report model with broader high/critical secret detection.

## Scope

- Add explicit redaction pattern metadata with ids, severities, descriptions, replacements, and enabled flags.
- Add `hadara.redaction.report.v1` report generation with byte counts and finding counts.
- Preserve existing `redactSecrets()` and `containsSecret()` APIs for evidence/audit callers.
- Cover AWS, GitHub, JWT, private key, npm, assignment-prefix, and no-capture replacement cases in tests.

## Out of Scope

- Adding new security CLI commands.
- Adding schema registry files for all JSON contracts.
- Changing private evidence storage or encryption behavior.

## Status

Done
