# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused `npm run test:focused -- tests/harness/task-capsule.test.ts tests/unit/task-create.test.ts tests/unit/state-projection.test.ts tests/unit/protocol-consistency.test.ts tests/unit/ci-gate.test.ts` | Validate discovery regression and state/protocol/CI consumers. | Yes | Passed: 5 files / 44 tests. | `command:T-0324:focused-docker` |
| `npm run dev:docker-sync-build` | Run full build/test suite in Docker temp workspace and refresh `dist`. | Yes | Passed: 119 files / 777 tests; `distLooksStale:false`. | `command:T-0324:full-docker-sync-build` |
| `git diff --check` | Check whitespace errors. | Yes | Passed. | `command:T-0324:diff-check` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host focused Vitest | No | Host `node_modules` is not the HADARA-dev validation baseline. | Failed before Docker fallback: `vitest: not found`. | `command:T-0324:focused-docker` |
| Built CLI `state verify --json` | Yes | Confirm current repo no longer reports empty T-0073 directory drift. | Passed; only expected pre-close stale latest close-proof warning remained. | `command:T-0324:built-advisory-smokes` |
| Built CLI `protocol doctor --scope all --json` | Yes | Confirm state consistency is surfaced additively in protocol doctor. | Passed; state consistency remained warning-only before close. | `command:T-0324:built-advisory-smokes` |
| Built CLI `ci gate --mode advisory --task T-0324 --json` | Yes | Confirm advisory CI state check remains non-blocking. | Passed; `state:consistency` check reported `ok:true`. | `command:T-0324:built-advisory-smokes` |
