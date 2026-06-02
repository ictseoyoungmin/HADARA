# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dashboard validation baseline extraction reads table-first handoff rows before falling back to validation history. | Met | Status/core tests and built route smoke report latest Docker validation with `latestContainsT0096:false`. |
| AC-2 | Explicit dashboard refresh uses bounded async projection stages instead of a combined heavy synchronous stage. | Met | `dashboard-refresh` tests cover async staged refresh; spec defines task-signals/core/timeline/debt/core-final stages. |
| AC-3 | Dashboard debt projection avoids full capsule scans during refresh while preserving deep debt diagnostics outside dashboard projection. | Met | `dashboard-heavy-projection` test confirms debt projection writes without task capsule scans; spec records non-goal and boundary. |
| AC-4 | T-0224 evidence, handoff, and closure docs are updated with validation results. | Met | T-0224 TESTS/RISKS/HANDOFF and project docs updated; command-log evidence attached. |
