# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `hadara evidence lint --task <id> --json` as the current semantic summary source for selected-task consumers. | Accepted | T-0187 already exposes shared semantic summary/issues additively. | docs/DASHBOARD_READ_MODEL_CONTRACT.md |
| D-2 | Define proof status as a consumer derivation before inlining into workbench JSON. | Accepted | Keeps T-0189 contract-only while preserving future additive workbench posture. | docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md |
| D-3 | Do not add Dashboard/TUI rendering or routes in this slice. | Accepted | T-0189 is read-only contract docs, not implementation. | docs/DEVELOPMENT_SLICES.md |
