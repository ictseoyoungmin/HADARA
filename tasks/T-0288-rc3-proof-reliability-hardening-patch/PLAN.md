# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read AGENTS, SOP, workflow docs, and the rc3 review findings. | Done | Required Reading in CONTEXT.md. |
| 2 | Add CI gate strict empty-scope guard and `--allow-empty`. | Done | ci-gate.ts/ci.ts; ci gate built smoke. |
| 3 | Add stale-lock metadata and clearer append-lock timeout diagnostics. | Done | evidence.ts withEvidenceAppendLock. |
| 4 | Expose the real close-relevant source set in proof freshness. | Done | proof-status.ts; proof status built smoke. |
| 5 | Make non-JSON evidence add-command/collect report idempotent no-ops. | Done | evidence.ts CLI; non-JSON built smoke. |
| 6 | Add a real multi-process parallel evidence append regression test. | Done | evidence-parallel-append.test.ts (2 tests). |
| 7 | Run typecheck, focused tests, regression, and built-CLI smokes. | Done | EVIDENCE.md. |
| 8 | Update CLI_JSON_CONTRACT and capsule docs; record residual risk. | Done | docs/CLI_JSON_CONTRACT.md; RISKS.md. |
