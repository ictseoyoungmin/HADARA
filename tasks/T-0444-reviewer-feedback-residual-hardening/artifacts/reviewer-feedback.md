# Reviewer Feedback Summary

## Required Fixes

1. Docs registry v2 metadata must be first-class enough for routing quality:
   `readTier`, `authority`, `editPolicy`, `activeForTasks`, and drift metadata
   should be stored on registry entries and accepted by `docs register`.

2. Docs read-map active task documents should use the 0.4 capsule shape:
   `TASK.md`, `HANDOFF.md`, and `EVIDENCE.md`. `CONTEXT.md` is legacy-only and
   should not be read-first for current 0.4 work.

3. Nested `docs/specs/**` discovery should be recursive enough to find
   unregistered spec-looking documents below paths such as
   `docs/specs/0.4.0/productization-redesign/...`.

4. `task finish` shared-state advisories should not hardcode docs that are not
   generated for the selected 0.4 profile.

5. `init register-doc` and `init enable-integration` are still SOP-based; 0.4
   projects should use the registry-first `docs register` path, while legacy
   compatibility should be explicit.

6. Done-level scaffold placeholder guidance should not mention removed
   `Scope` / `Out of Scope` sections.

## Additional Risks

1. Handoff summary snapshots in close-source can be kept as warning-only drift
   or made opt-in for stricter profiles later.

2. `EVIDENCE.md` projection execute rewrites the projection file. Documentation
   should describe it as a generated projection file rather than only generated
   slots.

3. `close-source.schema.json` currently leaves room through
   `additionalProperties: true`; stricter audit-critical schema review can be a
   later self-review item.

## Current Capsule Scope

T-0444 handles residual items not fully closed by T-0439:

- Fresh 0.4 docs registry schema alignment to `hadara.docsRegistry.v2`.
- Legacy `CONTEXT.md` read-map routing as conditional/historical.
- Projection-file wording for `EVIDENCE.md`.
- Legacy SOP registration guidance pointing 0.4 users to `docs register`.
