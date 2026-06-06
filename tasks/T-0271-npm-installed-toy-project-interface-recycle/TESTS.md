# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec hadara-recycle npm view hadara@0.2.0-rc.0 version` | Confirm registry visibility from the test container. | Yes | Passed | Returned `0.2.0-rc.0`. |
| `docker exec hadara-recycle npm install hadara@0.2.0-rc.0` | Install the published package in the toy project. | Yes | Passed | Added 1 package; 0 vulnerabilities. |
| `./node_modules/.bin/hadara ...` command matrix | Exercise representative installed CLI interfaces. | Yes | Passed with findings | See `FINDINGS.md`; `run scaffold` generated-script mismatch is a bug candidate. |
| `git diff --check` | Verify docs/evidence patch hygiene. | Yes | Passed | No output. |
| `hadara evidence lint --task T-0271 --json` | Verify T-0271 evidence syntax and semantics. | Yes | Passed | 1 record, 0 issues; slow on mounted workspace. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Publish execute | No | This task must not publish or mutate registries. | Not Run | Out of scope. |
| Full HADARA-dev Docker suite | No | This is a consumer-install recycle test, not a source-code change. | Not Run | Focused installed-interface checks are the evidence. |
