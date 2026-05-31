# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara task upgrade-scaffold --task <id> --json [--execute]` exists. | Met | CLI handler and built CLI smoke passed. |
| AC-2 | Dry-run writes nothing and execute is non-destructive. | Met | Focused tests verify dry-run no-write and legacy prose preservation. |
| AC-3 | Execute is idempotent and skips ambiguous non-canonical semantic frames with warnings. | Met | Focused tests cover rerun skip and ambiguous acceptance table skip. |
| AC-4 | New JSON surface has a fixture-level schema and runtime validation. | Met | `hadara.task.upgrade_scaffold.v1` schema registered; tests validate reports. |
| AC-5 | Evidence and handoff are updated. | Met | Evidence JSONL and handoff updated. |
