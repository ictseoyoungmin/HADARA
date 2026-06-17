# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0337 |
| TaskStatus | In Progress |
| Last Updated | 2026-06-17 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0337 capsule created and scoped for approval-gated npm publish. | `ev:T-0337:67d9ffcaf2b74ee1b2901ae1` |
| README reviewed as appropriate for staged rc0 package-facing release posture; capsule-local release note added. | `RELEASE_NOTE.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| From repo root, run `scripts/release/manual-publish-rc.sh T-0337` for the safe dry-run path. | Refreshes final validation/evidence and proves the exact tarball without publishing. | `scripts/release/manual-publish-rc.sh`; `docs/RELEASE_READINESS.md` |
| After dry-run passes and npm auth is ready, run `scripts/release/manual-publish-rc.sh T-0337 --execute` and type `publish` only if the final prompt is correct. | Performs npm publish mutation and verifies `npm view`. | T-0337 spec |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not pass `--github-draft` unless explicitly requested. | Would create optional GitHub Release draft outside default T-0337 scope. | Keep default helper invocation npm-only. |
| Publish requires npm auth. | Helper will fail at `npm whoami` if unauthenticated. | Run `npm login --registry=https://registry.npmjs.org` or configure token before execute. |
