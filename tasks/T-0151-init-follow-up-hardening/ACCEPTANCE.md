# Acceptance Criteria

- [x] Generated SOP uses current `hadara init register-doc` guidance instead of stale future/manual wording.
- [x] Governed profile generic wording does not include release planning.
- [x] `init upgrade` report states it creates missing docs and updates known generated profile metadata without overwriting unrelated user content.
- [x] `init upgrade --execute` updates generated `PROJECT_STATE`, `IMPLEMENTATION_SOP`, and `AGENTS` profile metadata/Required Reading rows when upgrading profiles.
- [x] `init doctor` reports `INIT_PROFILE_METADATA_MISMATCH` when higher-profile docs exist but profile-bearing docs still say a lower profile.
- [x] `init register-doc` rejects unsafe paths and invalid Markdown table cells.
- [x] `init register-doc --require-exists` treats missing docs as an error while default mode remains warning-only.
- [x] `init enable-integration` docs and reports say guidance registration does not enable runtime behavior.
- [x] `init enable-integration --execute` does not partially create integration docs when SOP registration cannot be updated.
- [x] `init enable-integration --execute` rolls back already-renamed files when a multi-file commit fails.
- [x] Focused init tests pass.
- [x] Full repository validation passes.
- [x] Done-level harness validation passes.
- [x] Evidence is attached.
- [x] Handoff is updated.
