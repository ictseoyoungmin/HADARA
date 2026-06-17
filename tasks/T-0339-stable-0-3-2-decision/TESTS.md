# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Check Markdown whitespace for docs-only changes. | Yes | Passed | No output; exit 0; recorded in `ev:T-0339:c13115df6d8e471791753886`. |
| `rg -n "Current release-candidate line status:.*T-0338|installed-package recycle from consumer paths is active in T-0338|installed-package recycle from consumer paths is complete through T-0338" docs/RELEASE_READINESS.md` | Confirm release readiness says T-0338 recycle is complete and no longer active. | Yes | Passed | Only the corrected complete-through-T-0338 line matched; recorded in `ev:T-0339:c13115df6d8e471791753886`. |
| Temp project HADARA lifecycle dogfood | Exercise init, task create, evidence, finish, ready, close, audit in `/tmp/hadara-dogfood-asteroid-ops`. | Yes | Passed | T-0001 reached `closed-valid`; findings recorded in `FINDINGS.md`; `ev:T-0339:49cceff9e094481a85b7b4b0`. |
| Temp project compose/app validation | Validate compose config, backend/frontend syntax, and backend runtime smoke. | Yes | Passed | Compose config and syntax checks passed; backend runtime smoke passed after sandbox escalation; `ev:T-0339:49cceff9e094481a85b7b4b0`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker validation | No | No runtime or generated docs change. | Not Run | Docs-only cleanup. |
| Package or registry smoke | No | No package/readiness execution or publish mutation. | Not Run | Out of scope. |
