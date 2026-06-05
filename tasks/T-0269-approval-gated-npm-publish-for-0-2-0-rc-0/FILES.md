# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `README.md` | Updated | Align public install/npx examples, compact top package/runtime metadata, release artifact boundary language, actor metadata notes, and release/publish boundaries with `hadara@0.2.0-rc.0` publish candidate. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Updated | Clarify the standard task loop with the task-create branch and move `task complete` to optional post-ready workflow compression. | Done |
| `docs/IMPLEMENTATION_SOP.md` | Updated | Keep the session workflow loop aligned with the clarified task lifecycle order. | Done |
| `scripts/release/manual-publish-rc.sh` | Updated | Remove stale T-0143 default/examples, require explicit task id, add clean worktree guard, carry approval metadata through dry-run gates, and attach post-publish evidence after npm view verification. | Done |
| `src/services/dashboard-cache.ts` | Updated | Increase dashboard bootstrap/timeline/task-detail TTLs and start miss/stale TTL after slow report creation completes so newly created entries do not self-expire. | Done |
| `tests/unit/dashboard-cache.test.ts` | Updated | Add regression coverage for slow report creation so a newly created cache entry can still be hit immediately after creation. | Done |
| `tests/unit/dashboard-static.test.ts` | Updated | Move bootstrap cache hit/bypass assertions next to the initial bootstrap cache miss so the test no longer depends on slow later read-model calls finishing before TTL expiry. | Done |
| `docs/assets/hadara_sub_right_name.png` | Referenced | Place HADARA image at README top. | Done |
| `docs/RELEASE_NOTES.md` | Updated | Record T-0269 pre-publish status without claiming publish. | Done |
| `docs/RELEASE_READINESS.md` | Updated | Record T-0269 dry-run/token status and README asset/package boundary. | Done |
| `docs/PROJECT_STATE.md` | Updated | Reflect T-0269 active publish-prep state without claiming publish. | Done |
| `docs/AGENT_HANDOFF.md` | Updated | Carry forward publish blockers and next steps. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Updated | Add the T-0269 release publish-prep slice. | Done |
| `docs/TASK_BOARD.md` | Updated | T-0269 Draft row created by task create. | Done |
| `tasks/T-0269-approval-gated-npm-publish-for-0-2-0-rc-0/` | Updated | Record capsule scope, evidence, risks, and handoff. | In Progress |
