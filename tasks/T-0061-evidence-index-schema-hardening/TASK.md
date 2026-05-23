# T-0061 Evidence Index Schema Hardening

## Goal

Harden Task Capsule `evidence.jsonl` validation so evidence records cannot drift from the canonical `hadara.evidence.v1` shape.

## Scope

- Migrate recent manual evidence records from `timestamp` to `time`.
- Require non-empty `time`, `summary`, and `visibility` fields in harness evidence index validation.
- Add regression coverage for timestamp-only and missing evidence metadata records.
- Document task-local decision that manual evidence records must match the same schema as `appendEvidence()`.

## Out of Scope

- Rewriting the evidence storage format.
- Encrypting private evidence.
- Dashboard evidence viewer implementation.

## Status

Done
