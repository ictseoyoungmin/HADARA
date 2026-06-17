# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Rebuild boundary is documented. | Done | README, CLI JSON contract, workflow docs, generated init docs, and command registry guidance |
| AC-2 | Design explicitly defers preview and execute implementation. | Done | Docs state no `evidence rebuild` preview/execute behavior exists in 0.3.2. |
| AC-3 | `EVIDENCE.md` remains non-canonical. | Done | Evidence boundary docs |
| AC-4 | `evidence.jsonl` remains canonical. | Done | Evidence boundary docs |
| AC-5 | No runtime command is added. | Done | Only documentation strings/guidance changed; no rebuild command registered. |
| AC-6 | Docs validation passes. | Done | Docker full sync-build passed 119 files / 791 tests; `git diff --check` passed. |
