# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | TUI task list uses dashboard task projection plus Task Board before legacy task scans. | Done | `createTuiTaskListReport()` and focused TUI tests. |
| AC-2 | Selected task detail refresh reads the selected capsule path directly from cached/shared summaries. | Done | `refreshes selected detail from cached task summaries without scanning every capsule`. |
| AC-3 | Fast cache validation no longer recomputes every task hash or scans `tasks/` for directory membership. | Done | TUI cache tests and source signal assertions. |
| AC-4 | `hadara tui --snapshot` uses the projection-first fast profile and built `/mnt/f` snapshot timing is recorded. | Done | Built CLI smoke: 4.05s; internal fast read-model/render about 160 ms. |
| AC-5 | Source-of-truth tradeoff for deleted task directories is documented. | Done | RISKS/HANDOFF and cache regression. |
| AC-6 | Evidence is attached and project handoff docs are updated. | Done | EVIDENCE.md/evidence.jsonl and docs updates. |
