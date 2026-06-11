# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | AC-7.0-1: All Phase 7 spec files are present under `docs/specs/0.3.0/`. | Done | File existence check passed. |
| AC-2 | AC-7.0-2: New specs use Phase 7.x implementation naming, not rc4-rc9 internal phase labels. | Done | Text search found only explanatory/negative references, not rc-phase implementation naming. |
| AC-3 | AC-7.0-3: README has a planning note and does not claim Phase 7.1+ features exist. | Done | README includes planned 0.3.0 direction only. |
| AC-4 | AC-7.0-4: Release status wording is reconciled with repository evidence or explicitly qualified. | Done | README and release notes now reflect T-0289 rc3 publish evidence. |
| AC-5 | AC-7.0-5: Project State and Agent Handoff point to Phase 7 as the next work. | Done | Project State records Phase 7 planned line; Agent Handoff points to Phase 7.1. |
| AC-6 | AC-7.0-6: Development Slices includes Phase 7.x future rows. | Done | Rows 245-251 cover Phase 7.0 through Phase 7.6. |
| AC-7 | AC-7.0-7: No historical docs are moved, deleted, or marked superseded. | Done | Git diff review shows docs added/updated only; no historical move/delete/superseded status. |
| AC-8 | AC-7.0-8: Task evidence records docs-only scope and validation. | Done | Evidence records include docs-only validation and focused-test availability note. |
