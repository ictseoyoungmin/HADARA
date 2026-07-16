# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Restored exact `Do not hand-edit \`evidence.jsonl\`.` guidance in the current workflow doc and init template. | `ev:T-0630:4886c561a6b94b4bb971843a`, `ev:T-0630:f07141120af546d3a0c44d82` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Rerun the release publish preparation helper for T-0629 from the committed hotfix state. | The clean publish clone previously failed on this exact workflow-doc assertion; the source and dist now include the fix. | `scripts/release/prepare-publish-env.sh`, `tasks/T-0629-0-4-6-stable-release-readiness-and-publish-preparation/HANDOFF.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The T-0629 release source-prep commit is superseded by this tiny doc/template hotfix for the actual publish clone. | Publishing from the older commit would rerun the failing test. | Publish only after committing T-0630. |
