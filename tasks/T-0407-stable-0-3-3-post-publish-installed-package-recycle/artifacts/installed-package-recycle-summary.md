# T-0407 Installed Package Recycle Summary

## Environment

| Field | Value |
|---|---|
| Registry | `https://registry.npmjs.org` |
| Package requested | `hadara@latest` |
| Observed version | `0.3.3` |
| Temporary prefix | `/tmp/hadara-0407-prefix-*` |
| Disposable project | `/tmp/hadara-0407-project-*` |

## Checks

| Check | Result |
|---|---|
| `npm view hadara@0.3.3 version` | Passed: `0.3.3` |
| `npm view hadara dist-tags --json` | Passed: `latest=0.3.3`, `next=0.3.3-rc.0` |
| `npm --prefix <tmp> install hadara@latest` | Passed |
| Installed `hadara version --json` | Passed: `packageVersion=0.3.3`, `distLooksStale=false` |
| Installed `hadara help lifecycle --json` | Passed: `ok=true` |
| Disposable `hadara init --profile governed` | Passed: generated governed docs and profile files |
| Disposable `hadara task create/status/lifecycle/finalize --json` | Passed: task surfaces executed from installed package; incomplete task correctly reported readiness blockers |
| Disposable `hadara context graph --json` | Passed |
| Disposable `hadara context pack --task T-0001 --json` | Passed |
| Disposable `hadara context slice --path docs/TASK_BOARD.md --from 1 --to 20 --json` | Passed |
| Disposable `hadara context cache status/warm/warm --execute --json` | Passed |
| Disposable `hadara session start --task T-0001 --json` | Passed: bounded no-live session packet returned `ok=true` |
| Temporary path cleanup | Passed: temp prefix and project removed |

## Notes

- `version --json` in a non-git disposable project reported `GIT_METADATA_UNAVAILABLE` as a warning; package execution and version metadata were valid.
- `task finalize --task T-0001 --json` was exercised as a read-only/default-flow smoke on a newly scaffolded incomplete task. It correctly reported readiness blockers instead of closing an incomplete scaffold.
- Context graph/pack output in the minimal disposable project included degraded-state warnings because generated docs do not include every HADARA-dev source file. This is expected for a fresh consumer scaffold.
