# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0210 |
| Status | Partial |
| Last Updated | 2026-06-02 |

## Last Completed

| Item | Evidence |
|---|---|
| Built the focal Active/Next block with copy-only command guidance. | ui.tsx ActiveNext/CopyButton. |
| Verified no command-execution affordance exists. | Visual gate no-exec check. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Reviewer sign-off, then run task ready/finish/close and commit. | Implementation and validation are complete but intentionally uncommitted/unclosed. | docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Build deps (esbuild/preact) cannot be installed on the NTFS mount. | `npm install` fails in place; the build runs off-mount/Docker. | Use scripts/dashboard-build.sh or DASH_DEPS; output is the committed index.html. |
| Capsule is Partial, not closed. | May be revised or rolled back during review. | Defer finish/close until sign-off. |
