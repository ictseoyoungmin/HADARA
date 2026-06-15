# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0316 |
| Status | Done |
| Last Updated | 2026-06-15 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0316 capsule created. | `task create` returned ok:true. |
| Package-facing README/release docs staged for stable 0.3.0 publish. | README.md / docs/RELEASE_NOTES.md / docs/RELEASE_READINESS.md |
| Pre-publish prep checks passed. | `command:T-0316:prepublish-prep` |
| README release-status unit expectation updated. | `command:T-0316:readme-test-update` |
| Stable npm publish completed. | `command:T-0316:npm-publish`; `npm view` verified `0.3.0`; GitHub draft false. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0317 Stable 0.3.0 Post-Publish Installed-Package Recycle. | Stable npm publish is complete; consumer-environment validation should now prove installed-package behavior. | T-0312 recycle capsule, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not use T-0315 for publish evidence. | T-0315 is already closed as readiness-only. | Use T-0316 for all publish and npm view verification evidence. |
| Do not commit npm auth URLs, token values, or raw private logs. | Credential or privacy leak. | Paste only reduced publish completion and `npm view` verification output, or let Codex redact before committing. |
| Post-publish installed-package recycle is not T-0316. | T-0316 only proves publish and registry version visibility. | Use follow-up T-0317 after T-0316 closes. |
