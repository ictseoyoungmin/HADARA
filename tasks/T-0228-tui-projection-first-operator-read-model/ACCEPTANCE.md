# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | A committed TUI shared operator read-model spec records dashboard freeze, projection-first TUI rules, and deferred follow-ups. | Done | `docs/specs/tui/HADARA_TUI_Shared_Operator_Read_Model_Spec.md`. |
| AC-2 | TUI read model calls shared dashboard core/projection status services directly and exposes source, refresh, pending, and stale metadata. | Done | `src/tui/read-model.ts`; focused TUI tests passed. |
| AC-3 | TUI model construction remains read-only for project documents and ordinary core reads do not write dashboard projections. | Done | `writeProjection: false`; existing no-mutation TUI read-model test passed. |
| AC-4 | Snapshot output shows projection source/refresh/pending state. | Done | `src/tui/snapshot.ts`; built snapshot smoke displayed `source projection refresh idle pending timeline,debt`. |
| AC-5 | Focused TUI tests and full Docker sync-build pass, or residual risk is recorded. | Done | Focused Docker TUI tests passed 4 files / 46 tests; Docker sync-build passed 91 files / 595 tests. |
| AC-6 | Project state, handoff, development slices, and SOP required reading are updated. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/IMPLEMENTATION_SOP.md`. |
