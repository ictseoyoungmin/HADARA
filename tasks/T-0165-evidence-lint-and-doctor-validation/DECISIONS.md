# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add evidence lint as a read-only service before close orchestration. | Accepted | It catches hand-edited JSONL drift early without introducing repair writes. | Focused tests. |
| D-2 | Keep close validation evidence as audit trail, not a same-run validation precondition. | Accepted | Prevents fixed-point validation/evidence loops. | SOP and V1.0 planning docs. |
