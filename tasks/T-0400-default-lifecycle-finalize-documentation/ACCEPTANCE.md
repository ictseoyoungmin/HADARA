# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Root docs and AGENTS guidance make `task lifecycle` + reviewed `task finalize` the default 0.3.3 agent path. | Met | ev:T-0400:e1d131f54fc247d38022fe3a |
| AC-2 | Registry-backed help and lifecycle JSON projection expose lifecycle/finalize as primary and exclude the old low-level close sequence from the primary path. | Met | ev:T-0400:8bfd40cfd47f4f4b88882d64 |
| AC-3 | New project init templates scaffold finalize-first lifecycle guidance. | Met | ev:T-0400:e1d131f54fc247d38022fe3a |
| AC-4 | Low-level finish/ready/close/audit commands remain available and documented for debugging/recovery rather than removed. | Met | ev:T-0400:8bfd40cfd47f4f4b88882d64 |
| AC-5 | Validation evidence covers focused contract tests, full Docker build/test, dist freshness, and built CLI smoke. | Met | ev:T-0400:d792e4cabcdb49398eed875b |
