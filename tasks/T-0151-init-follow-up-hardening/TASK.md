# T-0151 Init Follow-up Hardening

## Goal

Harden the T-0150 init follow-up command surfaces against misleading wording, weak input validation, profile-metadata drift, and partial integration writes.

## Scope

- Update generated SOP wording now that `hadara init register-doc` exists.
- Clarify profile upgrade as missing-doc expansion rather than full profile migration.
- Add doctor warnings for profile metadata drift after missing-doc expansion.
- Remove generic governed-profile release-planning wording.
- Clarify optional integration enablement as project guidance registration, not runtime enablement.
- Add stricter register-doc path/table-cell validation and `--require-exists`.
- Prevent integration enablement from creating docs when SOP registration cannot be updated.
- Update docs, tests, evidence, and handoff.

## Out of Scope

- Full diff/merge migration of existing profile-bearing docs.
- Runtime Hermes/MCP capability gate changes.
- Automatic repair of profile metadata drift.
- Broad init command redesign.

## Status

Done
