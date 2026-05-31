# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara evidence lint --task <id> --json` reports schema-valid read-only evidence lint results. | Met | Focused Docker tests. |
| AC-2 | Task protocol doctor surfaces evidence lint errors such as unsupported kind values. | Met | `tests/unit/evidence-lint.test.ts`. |
| AC-3 | Close/evidence fixed-point redesign is documented in `/docs`. | Met | SOP and V1.0 planning updates. |
| AC-4 | Evidence and handoff are updated. | Met | T-0165 evidence and handoff files. |
