# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `main.ts` no longer top-level imports every command handler before dispatch. | Done | `src/cli/main.ts` dynamic imports. |
| AC-2 | Existing CLI/TUI command behavior remains covered by focused tests. | Done | Focused Docker tests passed 8 files / 53 tests. |
| AC-3 | Full Docker sync-build passes. | Done | 91 files / 595 tests; built CLI version smoke ok. |
| AC-4 | Built `/mnt/f` `hadara tui --snapshot` smoke is under 2 seconds. | Done | 1.37s. |
| AC-5 | Evidence is attached and handoff docs are updated. | Done | EVIDENCE.md/evidence.jsonl and docs updates. |
