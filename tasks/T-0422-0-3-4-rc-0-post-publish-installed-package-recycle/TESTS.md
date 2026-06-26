# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js package recycle --execute --package hadara@next --expected-version 0.3.4-rc.0 --task T-0422 --attach-evidence --json` | Verify the published RC from installed consumer paths and attach reduced public evidence. | Yes | Failed on the helper's extra installed `context graph --json` smoke; registry/version/install/help/init/task lifecycle/context pack/context slice/session/cleanup steps passed. | `ev:T-0422:158cb7ac06f94b00a09fda08`, `ev:T-0422:ba22c58572db4b3c8c3288da` |
| Manual disposable installed-bin acceptance smoke for `hadara@next` | Verify the reviewer-requested minimum acceptance list, including `task finalize --json`, `context pack --task`, `context slice docs/PROJECT_STATE.md`, session start, and cleanup. | Yes | Passed | `ev:T-0422:f32c692a502c49d494970f4d` |
| `git diff --check` | Confirm documentation updates do not introduce whitespace errors. | Yes | Passed | `ev:T-0422:ed2802b97d3d44ec9474890f` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Source unit/full suite | No | No source code changes are planned; this is registry-installed package validation. | Not Run | Not required unless source changes occur. |
| Integration smoke | Yes | Installed-package recycle is the required integration smoke for this capsule. | Passed with helper residual documented. | `ev:T-0422:f32c692a502c49d494970f4d` |
