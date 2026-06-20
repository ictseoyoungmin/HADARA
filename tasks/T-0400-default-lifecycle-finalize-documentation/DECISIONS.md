# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Make `task lifecycle` and `task finalize` the registry-primary lifecycle path for agents. | Accepted | Registry-backed help and JSON lifecycle projection are the machine-readable source agents will consume. | ev:T-0400:8bfd40cfd47f4f4b88882d64 |
| D-2 | Keep `task finish`, `task ready`, `task close`, and `task audit-close` available as low-level proof-boundary commands. | Accepted | HADARA still needs explicit recovery/debug surfaces and command implementation boundaries. | ev:T-0400:e1d131f54fc247d38022fe3a |
| D-3 | Update generated init profile docs, not only repository docs. | Accepted | New HADARA projects should scaffold the same 0.3.3 agent cycle. | ev:T-0400:e1d131f54fc247d38022fe3a |
