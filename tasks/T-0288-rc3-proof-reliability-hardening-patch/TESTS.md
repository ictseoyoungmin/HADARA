# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npx tsc -p tsconfig.json --noEmit | Typecheck the hardening edits. | Yes | Passed | `/tmp` copy exit 0. |
| npx vitest run ci-gate proof-status evidence-json evidence-parallel-append | Focused coverage for changed surfaces. | Yes | Passed | 4 files / 26 tests. |
| npm test (full suite in /tmp npm-ci copy) | Full repository test suite after build. | Yes | Passed | 103 files / 692 tests; tsc build exit 0. |
| npm run dev:docker-sync-build (Docker full) | Reproducible Docker baseline before publish. | No | Not Run | hadara-dev container absent this session; /tmp full check is the equivalent fallback (project precedent T-0284). |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Multi-process parallel evidence append | Yes | rc3 core bug was parallel evidence writes. | Passed | 2 tests via tsx child processes; 12 same-key -> 1 record, 12 keyless -> 12 untorn records. |
| Built CLI ci gate empty-scope smoke | Yes | Strict gate must not pass with empty scope. | Passed | strict no-done ok:false; `--allow-empty` ok:true; `--task T-9999` CI_GATE_TASK_NOT_FOUND. |
| Built CLI proof/evidence smoke | No | Confirm checkedSources and idempotent UX. | Passed | checkedSources lists full close-source set; non-JSON repeat prints "already exists". |
