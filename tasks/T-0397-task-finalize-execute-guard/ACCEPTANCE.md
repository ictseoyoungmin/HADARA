# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task finalize --execute --plan-hash <hash>` refuses missing or stale hashes before any writes. | Met | `ev:T-0397:454daf3e664843cba5db3b1a`, `tests/unit/task-finalize.test.ts` |
| AC-2 | Matching execute plans run lifecycle phases serially, stop on blockers, and preserve underlying finish/close write boundaries. | Met | `ev:T-0397:59085932aced47be89c4532d`, `tests/unit/task-finalize.test.ts` |
| AC-3 | Successful guarded execute returns `ok:true` only when final audit is `closed-valid`. | Met | `ev:T-0397:59085932aced47be89c4532d`, `tests/unit/task-finalize.test.ts` |
| AC-4 | Schema, command registry, CLI JSON docs, workflow docs, and schema docs describe guarded execute behavior. | Met | `ev:T-0397:fd38f35a791e4b179285cc9d`, `ev:T-0397:3436c55fab2344789c6183b9` |
| AC-5 | Validation evidence and handoff/shared state docs are current before close. | Met | `ev:T-0397:59085932aced47be89c4532d`, `ev:T-0397:fd38f35a791e4b179285cc9d`, `ev:T-0397:3436c55fab2344789c6183b9` |
