# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0330 review context. | Done | Current-state docs, task workflow docs, Task Board, and T-0330 handoff reviewed. |
| 2 | Add result/outcome compatibility guard. | Done | `src/cli/evidence.ts` rejects mismatches; focused CLI tests and built CLI smoke passed. |
| 3 | Add exact resolution marker outcome guard. | Done | `src/evidence/semantics.ts` only accepts passed/recorded exact marker records; semantic/lint tests passed. |
| 4 | Harden evidence writer task directory discovery. | Done | `src/evidence/evidence.ts` ignores `TASK.md`-less leftovers and rejects ambiguous valid same-id dirs; writer/task capsule tests passed. |
| 5 | Clean stale T-0330 handoff and update docs/contracts. | Done | T-0330 HANDOFF plus workflow/CLI docs, README, registry, and generated init text updated. |
| 6 | Run focused and full Docker validation, attach evidence, and close. | Done | Evidence recorded for focused pass, full timeout/retry, full pass, and built CLI mismatch smoke. |
