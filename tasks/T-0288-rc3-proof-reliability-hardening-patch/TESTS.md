# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npx tsc -p tsconfig.json --noEmit | Typecheck the hardening edits. | Yes | Passed | `/tmp` copy exit 0. |
| npx vitest run ci-gate proof-status evidence-json evidence-parallel-append | Focused coverage for changed surfaces. | Yes | Passed | 4 files / 26 tests. |
| npm test (full suite in /tmp npm-ci copy) | Full repository test suite after build. | Yes | Passed | 103 files / 692 tests; tsc build exit 0. |
| npm run dev:docker-sync-build (Docker full) | Reproducible Docker baseline and workspace dist refresh. | Yes | Passed | 103 files / 695 tests; built version smoke `distLooksStale:false`. First run hit vitest worker-pool timeouts under the new parallel test's process load; reducing the multi-process test to 8 workers cleared it. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Multi-process parallel evidence append | Yes | rc3 core bug was parallel evidence writes. | Passed | 2 tests via tsx child processes; 12 same-key -> 1 record, 12 keyless -> 12 untorn records. |
| ci gate empty-scope unit tests | Yes | Lock in the strict gate empty-scope semantics as regression coverage. | Passed | ci-gate.test.ts: strict no-done -> ok:false CI_GATE_NO_DONE_TASKS; allowEmpty -> warning only; --task T-9999 -> CI_GATE_TASK_NOT_FOUND. |
| Built CLI ci gate empty-scope smoke | Yes | Strict gate must not pass with empty scope. | Passed | strict no-done ok:false; `--allow-empty` ok:true; `--task T-9999` CI_GATE_TASK_NOT_FOUND. |
| Built CLI proof/evidence smoke | No | Confirm checkedSources and idempotent UX. | Passed | checkedSources lists full close-source set; non-JSON repeat prints "already exists". |
