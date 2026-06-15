# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0316 |
| Status | In Progress |
| Last Updated | 2026-06-15 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0316 capsule created. | `task create` returned ok:true. |
| Package-facing README/release docs staged for stable 0.3.0 publish. | README.md / docs/RELEASE_NOTES.md / docs/RELEASE_READINESS.md |
| Pre-publish prep checks passed. | `command:T-0316:prepublish-prep` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit the pre-publish preparation, then run publish from a clean prepared environment. | The manual helper requires a clean worktree and reruns dry-run gates before mutation. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |
| Operator command after npm login: `bash scripts/release/manual-publish-rc.sh T-0316 --execute`. | This performs the approval-gated npm publish after the operator types `publish`. | `scripts/release/manual-publish-rc.sh` |
| Paste reduced helper output after publish. | Codex must attach T-0316 evidence, verify/update state docs, and close the capsule. | `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not use T-0315 for publish evidence. | T-0315 is already closed as readiness-only. | Use T-0316 for all publish and npm view verification evidence. |
| Do not commit npm auth URLs, token values, or raw private logs. | Credential or privacy leak. | Paste only reduced publish completion and `npm view` verification output, or let Codex redact before committing. |
| Post-publish installed-package recycle is not T-0316. | Scope creep delays publish evidence closure. | Use follow-up T-0317 after T-0316 closes. |
