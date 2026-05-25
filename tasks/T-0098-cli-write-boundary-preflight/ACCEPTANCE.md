# Acceptance Criteria

- [x] `hadara write preflight <command...> --json` returns `hadara.write.preflight.v1` reports without mutating project files.
- [x] Preflight reports list expected project-relative write paths for task, evidence, handoff, run-state, and debt write command families.
- [x] Unsupported target commands return a structured error issue and non-ok report.
- [x] Tests cover report generation and CLI output.
- [x] Evidence is attached.
- [x] Handoff is updated.
