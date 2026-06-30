# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement plan alias T-04A1 as actual capsule T-0427. | Accepted | Current `task create` and task lifecycle tooling support numeric `T-XXXX` ids only; preserving T-04A1 in the title keeps the worker-plan mapping without bypassing tooling. | `ev:T-0427:8f087c4cf64747628829a5dc` |
| D-2 | Register 0.4 specs through current `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md` surfaces. | Accepted | The proposed 0.4 `docs register` command is scheduled for T-04A4, so T-04A1 must use the current registry mechanism. | `ev:T-0427:8f087c4cf64747628829a5dc` |
| D-3 | Keep 0.4 manifest documents conditional instead of every-session default reading. | Accepted | This makes the spec package discoverable while preserving the accepted goal of reducing default document load. | `ev:T-0427:8f087c4cf64747628829a5dc` |
