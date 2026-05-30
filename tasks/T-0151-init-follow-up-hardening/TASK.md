# T-0151 Init Follow-up Hardening

## Goal

Harden the T-0150 init follow-up command surfaces against misleading wording, weak input validation, profile-metadata drift, and partial integration writes.

## Scope

- Update generated SOP wording now that `hadara init register-doc` exists.
- Clarify profile upgrade as missing-doc expansion rather than full profile migration.
- Merge generated profile metadata in known scaffold files during profile upgrade.
- Add doctor warnings for profile metadata drift after missing-doc expansion.
- Remove generic governed-profile release-planning wording.
- Clarify optional integration enablement as project guidance registration, not runtime enablement.
- Add stricter register-doc path/table-cell validation and `--require-exists`.
- Commit integration enablement writes with temp-file/rename rollback behavior so SOP and integration docs do not remain partially written on commit failure.
- Update docs, tests, evidence, and handoff.

## Out of Scope

- Arbitrary diff/merge migration of user-authored sections outside known generated profile metadata.
- Runtime Hermes/MCP capability gate changes.
- Automatic repair of profile metadata drift outside explicit `init upgrade --execute`.
- Broad init command redesign.

## Status

Done
