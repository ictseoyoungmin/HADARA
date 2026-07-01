# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Repaired the `task-close-repair-plan` fixture drift by using current close evidence generation and a current close-source drift file. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| Reclassified `task close-repair-plan` docs/registry wording as a conditional repair diagnostic, not an ordinary capsule loop command. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| Added ergonomic Change Summary line parsing and clearer invalid-format guidance. | `ev:T-0467:e6450a6e21b6450dbaae39ed` |
| Added `.git`-backed read-only Change Summary candidate rows to `task status`; the CLI suggests paths/ranges but does not edit TASK.md prose. | `ev:T-0467:a469046512334522b0bc0418` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Decide whether to optimize mounted-workspace `task status` performance. | T-0467 observed a slow status run while proving Change Summary candidates; the UX improvement is separate from this capsule's parser/read-model work. | `src/services/task-workbench.ts`, `src/task/task-close.ts`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `.git` assists Change Summary authoring but does not auto-write final prose. | Agents still need to review candidate rows and provide meaningful change/reason/evidence cells. | Treat `authoringSuggestions.changeSummary.candidateRows` as copy/edit hints, not canonical task documentation. |
| Mounted `task status` remains slow on this workspace. | Frequent status calls can interrupt agent flow. | Track as a future performance capsule rather than expanding T-0467. |
