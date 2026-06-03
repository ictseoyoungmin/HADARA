# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0236 |
| Status | Done |
| Last Updated | 2026-06-03 |

## Last Completed

| Item | Evidence |
|---|---|
| Hash-guarded execute mode exists. | `hadara evidence migrate --task <id> --to v2 --execute --before-hash <hash> --json` rewrites only the selected `evidence.jsonl` when the hash matches and skipped records are safe. |
| Validation passed. | Focused suite passed 7 files / 67 tests; Docker sync-build passed 92 files / 606 tests; built CLI temp-copy execute/mismatch smokes passed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Decide whether to migrate selected historical capsules or defer to lifecycle hardening. | Execute capability can exist without immediately mass-migrating history. | `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md`, `docs/AGENT_HANDOFF.md`. |
| Keep Markdown frame rewrite separate. | `EVIDENCE.md` still does not show v2 ids and should not be bundled into migration execute. | T-0236 RISKS. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Running execute against real historical tasks rewrites `evidence.jsonl`. | This is intentional but should be operator-selected, one task at a time. | Always run dry-run first and pass the returned `beforeHash`. |
| `EVIDENCE.md` still does not show v2 ids. | Operators need JSONL/read-model output for ids. | Keep Markdown frame rewrite separate. |
