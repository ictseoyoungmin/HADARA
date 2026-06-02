# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0213 |
| Status | Partial |
| Last Updated | 2026-06-02 |

## Last Completed

| Item | Evidence |
|---|---|
| Gave metrics context and moved raw JSON behind a read-only disclosure. | ui.tsx MetricsRow/DeveloperJSON. |
| Removed inspector vocabulary from the primary surface. | dashboard-static.test.ts absence assertions. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Reviewer sign-off, then run task ready/finish/close and commit. | Implementation and validation are complete but intentionally uncommitted/unclosed. | docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Build deps (esbuild/preact) cannot be installed on the NTFS mount. | `npm install` fails in place; the build runs off-mount/Docker. | Use scripts/dashboard-build.sh or DASH_DEPS; output is the committed index.html. |
| Capsule is Partial, not closed. | May be revised or rolled back during review. | Defer finish/close until sign-off. |
