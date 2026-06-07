# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/init.test.ts tests/unit/task-workflow-docs.test.ts` | Verify generated init docs and root workflow docs. | Yes | Passed | Docker `/tmp/hadara`: 2 files / 24 tests passed after close-source guidance update. |
| Generated three-profile init smoke | Verify basic/standard/governed generated docs include the new guidance. | Yes | Passed | Docker `/tmp/hadara` built CLI generated and doctored basic/standard/governed scaffolds; grep confirmed `.gitignore`, evidence, document-registration, and harness diagnostic guidance. |
| `git diff --check` | Verify no whitespace errors. | Yes | Passed | `git diff --check` returned no output after patch and after workspace `dist` sync. |
| Docker full check / sync build | Strongest routine validation if time permits. | Conditional | Passed | Docker `/tmp/hadara`: `npm run check` passed 100 files / 681 tests; `/tmp/hadara/dist` synced back to workspace `dist`. |
| Workspace built-CLI init smoke | Confirm workspace `dist` now contains updated templates. | Yes | Passed | `node dist/cli/main.js init --profile standard --project /tmp/init-0281-workspace-smoke-xZJNnU --json` and `init doctor` returned `ok:true`; hidden `.gitignore` and docs grep confirmed new guidance. |
| Close-source guidance generated-doc smoke | Confirm fresh init output tells operators to finalize docs before close and avoid volatile close evidence ids. | Yes | Passed | Docker built CLI and workspace built CLI standard init/doctor smokes returned `ok:true`; grep confirmed close-source guidance in AGENTS, SOP, workflow docs, and test strategy. |
| `hadara task ready/close/audit-close` | Verify done-level lifecycle closure. | Yes | Passed | `task ready --level done` returned `ready:true`; `task close --execute` appended close evidence; `task audit-close` returned `closed-valid` with 0 blockers and 0 warnings. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
| Direct harness validate smoke | Yes | Confirm `harness validate` still works as the documented diagnostic. | Passed before implementation | `node dist/cli/main.js harness validate --task T-0280 --level done --json` returned `ok:true`; focused task-ready/close/workbench tests passed 3 files / 20 tests in Docker `/tmp/hadara`. |
