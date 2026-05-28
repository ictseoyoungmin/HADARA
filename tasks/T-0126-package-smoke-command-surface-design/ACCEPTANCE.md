# Acceptance Criteria

- [x] `hadara package smoke` is documented as the primary future command surface, with `hadara release smoke` explicitly avoided as the primary command.
- [x] Flags and semantics are documented for `--dry-run`, `--json`, `--task`, `--workspace`, `--from`, `--keep-temp`, `--timeout`, `--no-evidence`, `--attach-evidence`, and `--private-logs`.
- [x] Approval, cleanup, timeout, failure, evidence attachment, and MCP boundary semantics are documented without implementing package-smoke execution.
- [x] `hadara release gate --mode strict --json` remains read-only and requires command-surface markers before passing release readiness.
- [x] Focused regression coverage proves missing command-surface documentation degrades advisory/strict release-gate checks with stable issue codes.
- [x] Docker validation evidence is recorded in `EVIDENCE.md` and `evidence.jsonl`.
- [x] `docs/TASK_BOARD.md`, `docs/PROJECT_STATE.md`, `docs/DEVELOPMENT_SLICES.md`, and `docs/AGENT_HANDOFF.md` are updated before stopping.
