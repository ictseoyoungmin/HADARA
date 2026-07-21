# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0673 |
| Title | Release Recycle Runbook and Command Contract |
| Status | Done |
| Created | 2026-07-21T22:33 |
| Updated | 2026-07-21T22:38 |
## Last Completed

| Item | Evidence |
|---|---|
| Added canonical release-readiness recycle runbook with `sourceRoot`, `evidenceRoot`, and `smokeProjectRoot` separation. | ev:T-0673:94958b6d68b448bc843d024b |
| Added release recycle quickstart to the workflow docs. | ev:T-0673:94958b6d68b448bc843d024b |
| Updated publish helpers so release artifact evidence uses journal-before-attach and publish prep creates a public GitHub Release note artifact when missing. | ev:T-0673:94958b6d68b448bc843d024b |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Start T-0674 Structured Handoff Continuation Contract. | actionable | yes | Reviewer queue continues with machine-readable handoff continuation semantics after the release recycle command contract is closed. | `docs/TASK_WORKFLOW_COMMANDS.md`; reviewer release recycle plan |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `manual-publish-rc.sh` now writes the release artifact journal under `/tmp/hadara-release-results` before attaching evidence. | Operators expecting direct artifact evidence append during artifact generation will see the attach as a separate helper step. | Keep journal generation and evidence attachment separate; this avoids clean-source self-invalidation. |
| `prepare-publish-env.sh` creates a generic public GitHub Release note when missing. | Release-specific highlights may still need human review before public GitHub publication. | Review `GITHUB_RELEASE_NOTE.md` before running `--github-draft` or publishing a draft. |
