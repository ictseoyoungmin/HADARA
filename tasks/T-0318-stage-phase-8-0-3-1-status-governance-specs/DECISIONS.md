# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat Work Item A and Work Item F as Phase 8 for the `0.3.1` line. | Accepted | Status governance must precede deterministic graph/context work so future projections do not encode ambiguous state. | User instruction; `docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/A_Stable_Recycle_Findings_Cleanup_and_Status_Governance.md`; `docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/F_State_Consistency_Projection.md`. |
| D-2 | Split Phase 8 into an rc1 implementation line with small capsules: status policy, task handoff state, installed-package findings cleanup, state projection, and doctor/CI integration. | Accepted | Worker ergonomics improve when each task has one validation surface and one bounded write/read model responsibility. | `docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md`. |
| D-3 | Register Phase 8 specs as current guidance and remove completed 0.3.0 implementation specs from active Required Reading rows. | Accepted | Required Reading should route workers to live planning rather than already completed release/adoption plans. | `docs/IMPLEMENTATION_SOP.md`. |
