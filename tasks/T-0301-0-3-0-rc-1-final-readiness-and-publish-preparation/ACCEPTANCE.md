# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara@0.3.0-rc.1` publish helper rejects a mismatched release capsule such as T-0297 before npm auth or publish work. | Done | `T-0301:manual-publish-task-version-guard`. |
| AC-2 | The manual helper dry-run path cleans only generated release outputs so the same `/tmp` clone can run `--execute` next. | Done | `T-0301:manual-publish-dry-run-cleanup`. |
| AC-3 | README and release readiness docs do not claim rc.1 is already published before the operator publish step. | Done | README and `docs/RELEASE_READINESS.md`. |
| AC-4 | rc.1 release notes explain user-visible feature value, especially protocol migration for existing projects, metadata hardening, and evidence preservation. | Done | `docs/RELEASE_NOTES.md` and `GITHUB_RELEASE_NOTE.md`. |
| AC-5 | `npm run check` passes before closing the capsule. | Done | `T-0301:npm-run-check-tmp-copy`. |
| AC-6 | Capsule close-source docs are complete and ready/close can proceed without executing npm publish. | Done | T-0301 task docs, state docs, and evidence updates. |
