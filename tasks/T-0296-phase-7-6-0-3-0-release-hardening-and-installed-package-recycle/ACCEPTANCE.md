# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | AC-7.6-1: Phase 7.0-7.5 acceptance criteria are complete and evidenced. | Done | T-0289 through T-0295 close/audit evidence exists; Phase 7.6 started after T-0295 commit. |
| AC-2 | AC-7.6-2: Full build, full test suite, and Docker baseline pass. | Done | Docker sync build evidence: `npm run check`, 115 files / 741 tests, `distLooksStale=false`. |
| AC-3 | AC-7.6-3: Package smoke and clean-checkout smoke pass. | Done | Package smoke passed with `/tmp` npm cache; Docker clean-checkout smoke passed after host DNS `EAI_AGAIN` failure was isolated. |
| AC-4 | AC-7.6-4: Installed package recycle passes using installed CLI, not source-only commands. | Done | Installed package recycle evidence from isolated `hadara-0.3.0-rc.0.tgz` prefix. |
| AC-5 | AC-7.6-5: Fresh init basic/standard/governed include expected command/docs registry surfaces. | Done | Installed CLI fresh init succeeded in separate basic, standard, and governed workspaces. |
| AC-6 | AC-7.6-6: Structured help and lifecycle help reduce command-selection ambiguity in installed-package recycle. | Done | Installed CLI `help`, `help lifecycle`, `help command task.close`, and `commands --family capsule-lifecycle --json` passed. |
| AC-7 | AC-7.6-7: Docs registry prevents stale/historical/superseded docs from default Required Reading. | Done | Installed CLI `docs list`, `docs doctor`, and `docs required-reading` passed; cleanup smoke confirmed superseded docs remain archive candidates. |
| AC-8 | AC-7.6-8: Managed patch plans are hash-guarded and do not overwrite freeform prose. | Done | Installed CLI rejected marker-inclusive content, rejected wrong before-hash, and accepted correct body-only hash-guarded patch. |
| AC-9 | AC-7.6-9: Docs cleanup marks status without deleting or moving historical files by default. | Done | Installed CLI `docs mark --execute` changed registry status and `docs archive --status superseded --json` stayed dry-run with `executeSupported:false`. |
| AC-10 | AC-7.6-10: README and release notes describe implemented behavior only. | Done | README/release notes/readiness docs updated for 0.3.0-rc.0 source candidate and explicit no-publish boundary. |
| AC-11 | AC-7.6-11: Release dry-run and publish dry-run pass with no unintended mutation. | Done | Release strict gate, release dry-run, and release publish dry-run passed for `hadara@0.3.0-rc.0`. |
| AC-12 | AC-7.6-12: No publish mutation occurs without explicit operator approval. | Done | Release artifact, release dry-run, and publish dry-run reported publish/GitHub/Docker mutation flags false; publish dry-run reported approval/token warnings only. |
