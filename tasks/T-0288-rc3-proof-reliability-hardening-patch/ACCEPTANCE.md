# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Strict CI gate fails on empty scope and on unknown `--task`; `--allow-empty` permits empty bootstrap scope. | Met | ci gate built smoke (strict no-done ok:false, --allow-empty ok:true, T-9999 CI_GATE_TASK_NOT_FOUND). |
| AC-2 | A real multi-process parallel evidence append regression proves idempotent dedupe and untorn keyless appends. | Met | evidence-parallel-append.test.ts 2 tests passed via tsx child processes. |
| AC-3 | Append-lock timeout diagnostics name the lock path and owner, and proof freshness reports the real close-source set. | Met | evidence.ts timeout message + lock.json; proof status built smoke checkedSources. |
| AC-4 | Non-JSON evidence add-command/collect report idempotent no-ops; docs and capsule docs updated; residual risk recorded. | Met | non-JSON built smoke; CLI_JSON_CONTRACT.md; RISKS.md. |
