# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0402 |
| TaskStatus | In Progress |
| Last Updated | 2026-06-20 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0402 capsule prepared. | Publish-only docs and operator handoff are ready. |
| T-0401 readiness is complete. | `ev:T-0401:34875afe7c1c4a6c802a0a0d`, `ev:T-0401:9bffce41eea94e728636609a` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Operator runs npm login and helper dry-run/execute. | Actual publish requires npm auth and interactive `publish` confirmation. | `docs/RELEASE_READINESS.md`, `scripts/release/manual-publish-rc.sh` |
| After publish, record registry and installed-package verification evidence. | Publish is not complete until registry visibility and consumer execution are proven. | T-0402 TESTS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not pass `--github-draft` unless explicitly requested. | GitHub Release draft is a separate mutation outside default T-0402 scope. | Use `bash scripts/release/manual-publish-rc.sh T-0402 --execute` only. |
| Verify helper prints `npm tag: next` before typing `publish`. | Wrong tag could affect stable install guidance. | Stop if tag is not `next`. |
| Keep worktree clean before helper execution. | Helper refuses dirty worktree. | Commit this capsule preparation first. |
